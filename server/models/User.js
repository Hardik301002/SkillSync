const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String], default: [] },
    bio: { type: String },
    role: { type: String, enum: ['user', 'recruiter', 'admin'], default: 'user' },
    avatar: { type: String },
    resume: { type: String },
    
    // It Store Saved Job IDs
    savedJobs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
    }],
    
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);