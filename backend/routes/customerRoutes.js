const express = require('express');
const router = express.Router();

const User = require('../models/User');

const {
  protect,
  restrictTo
} = require('../middleware/auth');

// PROTECT ROUTES
router.use(
  protect,
  restrictTo('customer')
);

// GET PROFILE
router.get('/profile', async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    ).select('-password');

    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    // SEND USER
    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});



// UPDATE PROFILE
router.put('/profile', async (req, res) => {

  try {
    const user = await User.findById(
      req.user._id
    );

    // USER NOT FOUND
    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      });
    }

    // UPDATE DATA
    user.fullName =
      req.body.fullName;

    user.email =
      req.body.email;

    user.phoneNumber =
      req.body.phoneNumber;

    user.address =
      req.body.address;


    // UPDATE PASSWORD
    if (req.body.password) {

      user.password =
        req.body.password;
    }

    // SAVE USER
    await user.save();

    // SEND RESPONSE
    res.json({

      _id: user._id,

      fullName: user.fullName,

      email: user.email,

      phoneNumber: user.phoneNumber,

      address: user.address,

      role: user.role
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});


module.exports = router;