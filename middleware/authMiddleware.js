const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password');
            console.log("🟢 Protect Guard: User mil gaya ->", req.user?.email, "| Role ->", req.user?.role);
            
            next(); 
        } catch (error) {
            console.log("🔴 Protect Guard Error: Token verify fail hua ->", error.message);
            return res.status(401).json({ message: 'Token verify nahi hua' });
        }
    } else {
        console.log("🔴 Protect Guard: Browser ne token bheja hi nahi!");
        return res.status(401).json({ message: 'Token nahi mila' });
    }
};

const adminOnly = (req, res, next) => {
    console.log("🟡 Admin Guard: Checking role ->", req.user?.role);
    if (req.user && req.user.role === 'admin') {
        console.log("🟢 Admin Guard: VIP Pass confirmed! Aage jane do.");
        next(); 
    } else {
        console.log("🔴 Admin Guard: Blocked! User admin nahi hai.");
        return res.status(403).json({ message: 'Aap Admin nahi hain!' });
    }
};

module.exports = { protect, adminOnly };