const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load Environment Variables
dotenv.config();

// Initialize App
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",  // Keep this for local development
        "https://skillsync-1ppr.onrender.com" // Add your OWN Render URL here (optional but good practice)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (API)
app.use('/api/v1', require('./routes/mainRoutes'));

// -------------------------------------------------------------------------
// 🚀 STEP 3: SERVE FRONTEND (This is the new part)
// -------------------------------------------------------------------------

// 1. Serve static files (CSS, JS, Images) from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// 2. The Catch-All Handler:
// If a user goes to ANY page (like /dashboard or /login), send them index.html
// This fixes the 404 errors on refresh!
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));