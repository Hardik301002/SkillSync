const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    
    // It Track who posted the job
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    
    postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);