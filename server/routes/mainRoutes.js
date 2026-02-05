const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const sendEmail = require('../utils/sendEmail');

// Models
const Application = require('../models/Application');
const User = require('../models/User');

// Controllers
const { 
    registerUser, loginUser, updateUserProfile, 
    getAllUsers, deleteUser 
} = require('../controllers/authController');

const { 
    getRecommendedJobs, getMyApplications, getJobById, createJob, 
    getJobApplications, updateApplicationStatus, deleteJob, deleteApplication,
    updateJob, getJobStats, getMyPostedJobs, toggleSavedJob, getSavedJobs,
    getAllJobsAdmin, getPublicJobs
} = require('../controllers/jobController');

// --- MULTER CONFIGURATION (Keep as is) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) return cb(new Error('Images only!'), false);
    } else if (file.fieldname === 'resume') {
        if (!file.originalname.match(/\.(pdf)$/)) return cb(new Error('PDFs only!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]);

//  AUTH ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', auth, cpUpload, updateUserProfile);

//  COMPANY ROUTES
router.use('/companies', require('./companyRoutes'));

//  ADMIN ROUTES
router.get('/admin/users', auth, admin, getAllUsers);     
router.delete('/admin/users/:id', auth, admin, deleteUser); 
router.get('/admin/jobs', auth, admin, getAllJobsAdmin);    

//  JOB ROUTES
router.get('/public-jobs', getPublicJobs);
router.get('/recommendations', auth, getRecommendedJobs);
router.get('/stats', auth, getJobStats);
router.get('/my-posted-jobs', auth, getMyPostedJobs);
router.get('/saved-jobs', auth, getSavedJobs);
router.put('/jobs/:id/save', auth, toggleSavedJob);
router.get('/jobs/:id', auth, getJobById);
router.post('/jobs', auth, createJob);
router.delete('/jobs/:id', auth, deleteJob);
router.put('/jobs/:id', auth, updateJob);

//  APPLICATION ROUTES (Keep the rest exactly the same)
router.get('/applications', auth, getMyApplications);
router.get('/jobs/:jobId/applications', auth, getJobApplications);
router.put('/applications/:id/status', auth, updateApplicationStatus);
router.delete('/applications/:id', auth, deleteApplication);

router.post('/apply', auth, upload.single('resume'), async (req, res) => {
    try {
        const { jobId, jobTitle, company } = req.body;
        const userId = req.user.id;
        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) return res.status(400).json({ message: "Please upload a Resume (PDF)" });

        const existingApp = await Application.findOne({ user: userId, jobId: jobId });
        if (existingApp) return res.status(400).json({ message: "You have already applied for this job." });

        const newApplication = new Application({
            user: userId,
            jobId,
            jobTitle,
            company,
            status: 'Applied',
            resume: resumePath
        });

        await newApplication.save();
        res.json({ message: "Application Submitted Successfully!" });
    } catch (error) { 
        console.error("Apply Error:", error.message);
        res.status(500).json({ message: "Server Error" }); 
    }
});

module.exports = router;