const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/users - Fetching all users');
        const users = await User.find().sort({ createdAt: -1 });
        console.log(`Found ${users.length} users`);
        
        // Add CORS headers explicitly for this route
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST create new user
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/users - Creating user:', req.body);
        const { name, email, phone, age, address } = req.body;
        
        // Validation
        if (!name || !email || !phone || !age || !address) {
            return res.status(400).json({ 
                message: 'All fields are required',
                required: ['name', 'email', 'phone', 'age', 'address']
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            phone,
            age: parseInt(age),
            address
        });

        const savedUser = await user.save();
        console.log('User created successfully:', savedUser._id);
        
        // Add CORS headers explicitly
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 11000) {
            // Duplicate email error
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`GET /api/users/${req.params.id} - Fetching user by ID`);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'Invalid user ID' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// OPTIONS handler for preflight requests
router.options('/', (req, res) => {
    console.log('OPTIONS /api/users - Preflight request');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

module.exports = router;