const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mernapp')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Test routes for debugging
app.get('/api/test', (req, res) => {
    console.log('Test route hit - GET');
    res.json({ 
        message: 'CORS working!', 
        method: 'GET',
        timestamp: new Date()
    });
});

app.post('/api/test', (req, res) => {
    console.log('Test route hit - POST');
    res.json({ 
        message: 'CORS working!', 
        method: 'POST', 
        body: req.body,
        timestamp: new Date()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    console.log('Health check route hit');
    res.json({ 
        message: 'Backend is running!', 
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        port: PORT
    });
});

// Load users routes
try {
    const usersRouter = require('./routes/users');
    app.use('/api/users', usersRouter);
    console.log('Users routes loaded successfully');
} catch (error) {
    console.error('Error loading users routes:', error);
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ 
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`Users endpoint: http://localhost:${PORT}/api/users`);
});