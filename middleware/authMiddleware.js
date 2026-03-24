const jwt = require('jsonwebtoken');

// 1. Check karna ki user logged in hai ya nahi
const protect = (req, res, next) => {
    let token = req.headers.authorization;
    
    // Check karte hain ki token bheja gaya hai ya nahi
    if (token && token.startsWith('Bearer')) {
        try {
            // "Bearer " word ko hata kar sirf actual token nikalna
            token = token.split(' ')[1];
            
            // Token ko verify karna apni secret key ke sath
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // User ka data aage ke steps ke liye save kar lena
            req.user = decoded; // Isme user ki ID aur role (user/admin) hoga
            next(); // Sab theek hai, aage badhne do
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Check karna ki user Admin hai ya nahi
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Agar admin hai, toh aage badhne do
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };
