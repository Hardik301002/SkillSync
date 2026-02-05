const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');

// 1. GET RECOMMENDED JOBS (Optimized with .lean())
exports.getRecommendedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        const { search, page = 1, limit = 6 } = req.query; 

        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { requiredSkills: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const count = await Job.countDocuments(query);

        const jobs = await Job.find(query)
            .sort({ postedAt: -1 }) 
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean() // Optimization
            .exec();

        const userSkills = user && user.skills ? user.skills.map(s => s.toLowerCase().trim()) : [];

        let recommendations = jobs.map(job => {
            const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());
            const matchingSkills = jobSkills.filter(skill => 
                userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
            );
            const matchPercentage = jobSkills.length > 0 
                ? Math.round((matchingSkills.length / jobSkills.length) * 100)
                : 0;

            return { ...job, matchPercentage };
        });

        res.json({
            jobs: recommendations,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });

    } catch (err) {
        console.error("Recommendation Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 2. GET JOB BY ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email').lean();
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 3. POST NEW JOB
exports.createJob = async (req, res) => {
    const { title, company, location, salary, description, requiredSkills } = req.body;
    try {
        const newJob = new Job({
            title,
            company,
            location,
            salary,
            description,
            requiredSkills: requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : [],
            postedBy: req.user.id
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error("Create Job Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 4. DELETE JOB
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check ownership or admin status
        if (job.postedBy.toString() !== req.user.id) {
            const user = await User.findById(req.user.id);
            if (user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }
        }
        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (err) {
        console.error("Delete Job Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 5. UPDATE JOB
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, company, location, salary, description, requiredSkills } = req.body;
        
        job.title = title || job.title;
        job.company = company || job.company;
        job.location = location || job.location;
        job.salary = salary || job.salary;
        job.description = description || job.description;
        
        if (requiredSkills) {
            job.requiredSkills = requiredSkills.split(',').map(s => s.trim());
        }
        
        await job.save();
        res.json(job);
    } catch (err) {
        console.error("Update Job Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 6. GET APPLICATIONS FOR JOB
exports.getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('user', 'name email skills')
            .lean();
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 7. UPDATE APPLICATION STATUS
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('user');
        
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        await application.save();

        // Send Email Notification
        if (application.user && application.user.email) {
            const candidateEmail = application.user.email;
            let subject = `Update: ${application.jobTitle}`;
            let message = '';

            if (status === 'Accepted') {
                subject = `🎉 Offer: ${application.jobTitle} at ${application.company}`;
                message = `<h1 style="color: green;">Congratulations! 🎉</h1><p>You have been accepted for <strong>${application.jobTitle}</strong>.</p>`;
            } else if (status === 'Rejected') {
                subject = `Update: ${application.jobTitle}`;
                message = `<p>Thank you for your interest in <strong>${application.jobTitle}</strong>. We have moved forward with other candidates.</p>`;
            }

            if (message) {
                try {
                    await sendEmail({ email: candidateEmail, subject, message });
                } catch (err) { console.error("Email failed:", err.message); }
            }
        }

        res.json(application);
    } catch (err) {
        console.error("App Status Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// 8. GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id })
            .populate('jobId', 'location salary') 
            .sort({ appliedAt: -1 })
            .lean();

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 9. DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: "Application Withdrawn" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 10. GET STATS
exports.getJobStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const myApps = await Application.countDocuments({ user: req.user.id });
        const acceptedApps = await Application.countDocuments({ user: req.user.id, status: 'Accepted' });

        res.json({ totalJobs, myApps, acceptedApps });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 11. GET MY POSTED JOBS
exports.getMyPostedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ postedAt: -1 }).lean();
        
        // Add applicant count to each job
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const applicationCount = await Application.countDocuments({ jobId: job._id });
            return { ...job, totalApplied: applicationCount };
        }));
        
        res.json(jobsWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 12. TOGGLE SAVED JOB
exports.toggleSavedJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.id;

        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.json({ message: 'Job removed', saved: false });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.json({ message: 'Job saved', saved: true });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 13. GET SAVED JOBS
exports.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedJobs').lean();
        res.json(user.savedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 14. GET PUBLIC JOBS
exports.getPublicJobs = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        
        if (totalJobs === 0) {
            const admin = await User.findOne({}); 
            
            if (admin) {
                const seedJobs = [
                    { title: "Software Engineer III", company: "Google", location: "Bangalore", salary: "₹35L - ₹50L", description: "Google Cloud infra.", postedAt: new Date(), requiredSkills: ["Go", "Kubernetes", "Distributed Systems"] },
                    { title: "Frontend Developer", company: "Netflix", location: "Remote", salary: "₹45L", description: "Netflix TV UI.", postedAt: new Date(), requiredSkills: ["React", "JavaScript", "Performance"] },
                    { title: "SDE-2 (Backend)", company: "Amazon", location: "Hyderabad", salary: "₹38L", description: "Amazon Pay systems.", postedAt: new Date(), requiredSkills: ["Java", "DynamoDB", "AWS"] },
                    { title: "Product Designer", company: "Airbnb", location: "Remote", salary: "₹25L", description: "Design experiences.", postedAt: new Date(), requiredSkills: ["Figma", "UI/UX"] },
                    { title: "Full Stack Engineer", company: "Zomato", location: "Gurugram", salary: "₹22L", description: "Order systems.", postedAt: new Date(), requiredSkills: ["Node.js", "React", "MongoDB"] },
                    { title: "Data Scientist", company: "Microsoft", location: "Bangalore", salary: "₹40L", description: "Azure AI.", postedAt: new Date(), requiredSkills: ["Python", "PyTorch", "Azure"] }
                ];
                
                const jobsWithUser = seedJobs.map(job => ({ ...job, postedBy: admin._id }));
                await Job.insertMany(jobsWithUser);
                console.log("✅ Database was empty. Auto-Seeded 6 jobs.");
            }
        }
        

        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { requiredSkills: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const limit = search ? 12 : 6;
        
        const jobs = await Job.find(query)
            .select('title company location salary requiredSkills postedAt description')
            .sort({ postedAt: -1 }) 
            .limit(limit)
            .lean();
            
        res.json(jobs);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 15. SEED REAL JOBS (Dev Tool)
exports.seedRealJobs = async (req, res) => {
    try {
        await Job.deleteMany({});
        const admin = await User.findOne({ role: 'admin' }) || await User.findOne({});
        if (!admin) return res.status(400).json({ message: "Create a user first!" });

        const realJobs = [
            { title: "Software Engineer III", company: "Google", location: "Bangalore", salary: "₹35L - ₹50L", description: "Google Cloud infra.", requiredSkills: ["Go", "Kubernetes", "Distributed Systems"] },
            { title: "Frontend Developer", company: "Netflix", location: "Remote", salary: "₹45L", description: "Netflix TV UI.", requiredSkills: ["React", "JavaScript", "Performance"] },
            { title: "SDE-2 (Backend)", company: "Amazon", location: "Hyderabad", salary: "₹38L", description: "Amazon Pay systems.", requiredSkills: ["Java", "DynamoDB", "AWS"] },
            { title: "Product Designer", company: "Airbnb", location: "Remote", salary: "₹25L", description: "Design experiences.", requiredSkills: ["Figma", "UI/UX"] },
            { title: "Full Stack Engineer", company: "Zomato", location: "Gurugram", salary: "₹22L", description: "Order systems.", requiredSkills: ["Node.js", "React", "MongoDB"] },
            { title: "Data Scientist", company: "Microsoft", location: "Bangalore", salary: "₹40L", description: "Azure AI.", requiredSkills: ["Python", "PyTorch", "Azure"] }
        ];

        const jobsWithUser = realJobs.map(job => ({ ...job, postedBy: admin._id }));
        await Job.insertMany(jobsWithUser);
        res.json({ message: "✅ Real Jobs Seeded!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 16. ADMIN: GET ALL JOBS
exports.getAllJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email').sort({ postedAt: -1 }).lean();
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};