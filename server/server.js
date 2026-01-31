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
app.use(cors());
app.use(express.json());

// here i use 'uploads' directly to match Multer's relative path configuration.
// This ensures that wherever Multer saves the file, Express looks in the same place.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1', require('./routes/mainRoutes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));