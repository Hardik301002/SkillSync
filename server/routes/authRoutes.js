const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); 
const User = require('../models/User');     
const multer = require('multer');
const path = require('path');

// --- 1. MULTER CONFIGURATION  ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the 'uploads' folder exists in your server root directory
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-originalName
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File Filter: Validate extensions
const fileFilter = (req, file, cb) => {
    //  Allow Images for Avatar
    if (file.fieldname === 'avatar') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed for avatar!'), false);
        }
    } 
    //  Allow PDFs for Resume (This prevents the "Unexpected field" error)
    else if (file.fieldname === 'resume') {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Only PDF files are allowed for resume!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// --- 2. REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    const { name, email, password, role, skills } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' (Candidate)
            skills: skills ? skills.split(',').map(s => s.trim()) : []
        });

        await user.save();

        // Create JWT Token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    _id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    resume: user.resume
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 4. UPDATE PROFILE ROUTE ---

const cpUpload = upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'resume', maxCount: 1 }
]);

router.put('/profile', auth, cpUpload, async (req, res) => {
    try {
        const { name, bio, skills } = req.body;
        
        // Find user by ID (from auth middleware)
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update Text Fields
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (skills) {
            user.skills = Array.isArray(skills) 
                ? skills 
                : skills.split(',').map(skill => skill.trim());
        }

        //  Handle Avatar File
        if (req.files && req.files['avatar']) {
            user.avatar = req.files['avatar'][0].path;
        }

        //  Handle Resume File
        if (req.files && req.files['resume']) {
            user.resume = req.files['resume'][0].path;
        }

        await user.save();
        res.json(user);

    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- 5. GET CURRENT USER ---
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;