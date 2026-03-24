const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper Function: JWT Token Generate karne ke liye
const generateToken = (id, role) => {
    // Ye token 30 din tak valid rahega
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. SIGNUP ROUTE (Naya account banana)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check karna ki email pehle se toh nahi hai
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Password ko secure (hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user database mein save karna
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword
        });

        // User banne ke baad uska data aur token wapas bhejna
        res.status(201).json({
            _id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        // Check karna ki user hai aur password match kar raha hai ya nahi
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. ADMIN DASHBOARD ROUTE (Sirf Admin ke liye)
// Isme humne 'protect' aur 'adminOnly' middleware lagaya hai
router.get('/admin-dashboard', protect, adminOnly, async (req, res) => {
    try {
        // Saare users ka data nikalna (par password nahi bhejna)
        const allUsers = await User.find({}).select('-password'); 
        res.json({ message: 'Welcome to Admin Panel', users: allUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
