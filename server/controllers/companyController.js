const Company = require('../models/Company');
const fs = require('fs');
const path = require('path');

// GET /api/companies
// Get all companies for the current recruiter
exports.getCompanies = async (req, res) => {
    try {
        // Fetch companies added by the logged-in recruiter
        const companies = await Company.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// POST /api/companies
// Create a new company
exports.createCompany = async (req, res) => {
    try {
        const { name, location, website, description } = req.body;
        let logoPath = '';

        if (req.file) {
            logoPath = req.file.path;
        }

        const newCompany = new Company({
            name,
            location,
            website,
            description,
            logo: logoPath,
            recruiter: req.user.id
        });

        const company = await newCompany.save();
        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// GET /api/companies/:id
// Get a single company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }
        // Ensure the recruiter owns this company
        if (company.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(company);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Company not found' });
        }
        res.status(500).send('Server Error');
    }
};

// PUT /api/companies/:id
// Update a company
exports.updateCompany = async (req, res) => {
    try {
        const { name, location, website, description } = req.body;
        let company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        // Ensure user owns the company
        if (company.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const companyFields = { name, location, website, description };
        if (req.file) {
            // Delete old logo if it exists
            if (company.logo) {
                fs.unlink(path.join(__dirname, '..', '..', company.logo), (err) => {
                    if (err) console.error("Failed to delete old logo:", err);
                });
            }
            companyFields.logo = req.file.path;
        }

        company = await Company.findByIdAndUpdate(
            req.params.id,
            { $set: companyFields },
            { new: true }
        );

        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};