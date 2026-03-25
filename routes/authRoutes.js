const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            token: generateToken(user._id, user.role),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. LOGIN (Frontend ke sath match karne ke liye update kiya)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user._id, user.role),
                user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🚨 MAGIC ROUTE: Apne aap ko Admin banane ke liye
router.get('/make-me-admin/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email }, // Aapka email dhoondhega
            { role: 'admin' },           // Role ko 'admin' kar dega
            { new: true }
        );
        if(user) {
            res.json({ message: "Badhai ho! Ab aap database se permanently Admin ban gaye hain! 👑", user });
        } else {
            res.status(404).json({ message: "User nahi mila, email ki spelling check karein!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 👑 ADMIN DASHBOARD ROUTE (Jo main galti se kha gaya tha)
router.get('/admin-dashboard', protect, adminOnly, async (req, res) => {
    try {
        // Saare users dhoondho (par password hide kar do)
        const allUsers = await User.find({}).select('-password'); 
        res.json({ message: 'Welcome to Admin Panel', users: allUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;