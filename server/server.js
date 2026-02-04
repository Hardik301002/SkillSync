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
        "http://localhost:5173",                  // Your Local Frontend
        "https://gleaming-marshmallow-fef403.netlify.app" // Your Netlify Frontend (Check your exact URL!)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// This lets you open your Render URL in a browser to check if it's working
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// Routes
app.use('/api/v1', require('./routes/mainRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));