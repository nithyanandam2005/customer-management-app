const jwt = require('jsonwebtoken');

const User = require('../models/User');


// PROTECT ROUTES
const protect = async (req, res, next) => {

  try {

    // Get token from headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get logged-in user
    req.user = await User.findById(decoded.id)
      .select('-password');

    next();

  } catch (error) {

    res.status(401).json({
      message: 'Not Authorized'
    });
  }
};


// ROLE PROTECTION
const restrictTo = (...roles) => {

  return (req, res, next) => {

    // Check user role
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: 'Access Denied'
      });
    }

    next();
  };
};


module.exports = {
  protect,
  restrictTo
};
