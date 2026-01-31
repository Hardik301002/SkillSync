const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    description: { type: String, trim: true },
    logo: { type: String }, 
    recruiter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);