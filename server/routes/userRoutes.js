const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path to your User model
const auth = require('../middleware/auth'); // Adjust path to your Auth middleware
const multer = require('multer');
const path = require('path');

// --- 1. MULTER CONFIGURATION (For handling files) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File Filter (Accept Images & PDFs)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed for avatar!'), false);
        }
    } else if (file.fieldname === 'resume') {
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


// --- 2. UPDATE PROFILE ROUTE (PUT /api/users/profile) ---
// We use upload.fields() to accept TWO different files: 'avatar' and 'resume'
const cpUpload = upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'resume', maxCount: 1 }
]);

router.put('/profile', auth, cpUpload, async (req, res) => {
    try {
        // 1. Get text fields from the request body
        const { name, bio, skills } = req.body;

        // 2. Find the user by ID (from the auth token)
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 3. Update text fields if they exist
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (skills) {
            // If skills come as a comma-separated string, split them
            // If it's already an array, use it directly (safety check)
            user.skills = Array.isArray(skills) 
                ? skills 
                : skills.split(',').map(skill => skill.trim());
        }

        // 4. Update AVATAR if a new file is uploaded
        if (req.files && req.files['avatar']) {
            user.avatar = req.files['avatar'][0].path;
        }

        // 5. Update RESUME if a new file is uploaded
        if (req.files && req.files['resume']) {
            user.resume = req.files['resume'][0].path;
        }

        // 6. Save the user
        await user.save();

        // 7. Return the updated user (excluding password)
        res.json(user);

    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. GET CURRENT USER PROFILE (GET /api/users/me) ---
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