const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');


// CREATE JWT TOKEN
const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};



// REGISTER
router.post('/register', async (req, res) => {

  try {

    const {
      fullName,
      email,
      password,
      phoneNumber,
      address
    } = req.body;


    // CHECK EMPTY FIELDS
    if (!fullName || !email || !password || !phoneNumber ) {

      return res.status(400).json({
        message: 'Please fill all fields'
      });
    }


    // CHECK USER EXISTS
    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: 'User already exists'
      });
    }


    // CREATE USER
    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      address,
      role: 'customer'
    });


    // SEND RESPONSE
    res.status(201).json({

      _id: user._id,

      fullName: user.fullName,

      email: user.email,

      role: user.role,

      token: generateToken(user._id)
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});



// LOGIN
router.post('/login', async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // FIND USER
    const user =
      await User.findOne({ email });


    // CHECK PASSWORD
    if (
      user &&
      await user.matchPassword(password)
    ) {

      res.json({

        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role,

        token: generateToken(user._id)
      });

    } else {

      res.status(401).json({
        message: 'Invalid Email or Password'
      });
    }

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});



// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {

  try {

    // FIND USER
    const user = await User.findOne({
      email: req.body.email
    });


    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      });
    }


    // CREATE TOKEN
    const token = crypto
      .randomBytes(20)
      .toString('hex');


    // SAVE TOKEN
    user.resetPasswordToken = token;

    user.resetPasswordExpires =
      Date.now() + 3600000;

    await user.save();


    // RESET LINK
    const resetLink =
      `http://localhost:5173/reset-password/${token}`;


    // SEND EMAIL
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      text: `Reset Password: ${resetLink}`
    });


    res.json({
      message: 'Reset Email Sent'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});



// RESET PASSWORD
router.post(
  '/reset-password/:token',
  async (req, res) => {

    try {

      // FIND USER
      const user = await User.findOne({

        resetPasswordToken:
          req.params.token,

        resetPasswordExpires: {
          $gt: Date.now()
        }
      });


      // INVALID TOKEN
      if (!user) {
        return res.status(400).json({
          message: 'Invalid or Expired Token'
        });
      }

      // UPDATE PASSWORD
      user.password =
        req.body.password;

      // REMOVE TOKEN
      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpires =
        undefined;


      await user.save();


      res.json({
        message: 'Password Reset Successful'
      });

    } catch (err) {

      res.status(500).json({
        message: 'Server Error'
      });
    }
  }
);


module.exports = router;





