const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { 
    getCompanies, 
    createCompany, 
    getCompanyById, 
    updateCompany 
} = require('../controllers/companyController');

// Reuse the multer config from mainRoutes.js (or can extract it to a config file)
const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const fileFilter = (req, file, cb) => {
    // It Allow Images for Company Logo
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed for the logo!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Routes
router.get('/', auth, getCompanies);
router.post('/', auth, upload.single('logo'), createCompany);
router.get('/:id', auth, getCompanyById);
router.put('/:id', auth, upload.single('logo'), updateCompany);

module.exports = router;