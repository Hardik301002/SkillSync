const mongoose = require('mongoose');
const Job = require('./server/models/Job');
require('dotenv').config();

const dummyJobs = [
    { title: "Frontend Dev", company: "A", requiredSkills: ["React"], description: "..." },
    { title: "Backend Dev", company: "B", requiredSkills: ["Node.js"], description: "..." }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Job.insertMany(dummyJobs);
    console.log("Database Seeded!");
    process.exit();
});