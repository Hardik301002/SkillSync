const User = require('../models/User');

module.exports = async function(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Admins Only' });
        }
        
        next(); 
    } catch (err) {
        res.status(500).send('Server Error');
    }
};