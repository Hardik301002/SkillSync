const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
    const { name, email, password, skills, role } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
            role: role || 'user'
        });

        await user.save();

        // Send Welcome Email
        const message = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h1 style="color: #6366f1;">Welcome to SkillSync, ${user.name}! </h1>
                <p>We are thrilled to have you on board.</p>
                <p>Start applying to top tech jobs or post your own openings today.</p>
                <br>
                <a href="http://localhost:5173/login" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to SkillSync! 🎉',
                message
            });
        } catch (err) {
            console.error("Welcome Email Failed:", err.message);
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            skills: user.skills,
            bio: user.bio,
            role: user.role,
            avatar: user.avatar,
            resume: user.resume, 
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 3. UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'User not authenticated' });

        const { name, skills, bio, role } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.bio = bio || user.bio;
        if (role) user.role = role;
        
        if (skills) {
            user.skills = Array.isArray(skills) 
                ? skills 
                : skills.split(',').map(skill => skill.trim());
        }

        //  CRITICAL FIX: Handle 'req.files' (Plural)
        if (req.files) {
            // Handle Avatar
            if (req.files['avatar']) {
                user.avatar = req.files['avatar'][0].path;
            }
            // Handle Resume
            if (req.files['resume']) {
                user.resume = req.files['resume'][0].path;
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            skills: updatedUser.skills,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            resume: updatedUser.resume, 
            token: req.headers['x-auth-token']
        });

    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. ADMIN: GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 }).lean();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 5. ADMIN: DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};