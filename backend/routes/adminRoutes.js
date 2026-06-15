const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { protect, restrictTo } = require('../middleware/auth');


// PROTECT ALL ROUTES
router.use(protect, restrictTo('admin'));


// GET ALL CUSTOMERS
router.get('/customers', async (req, res) => {

  try {

    const customers = await User.find({
      role: 'customer'
    }).select('-password');

    res.json(customers);

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// GET SINGLE CUSTOMER
router.get('/customers/:id', async (req, res) => {

  try {

    const customer = await User.findById(
      req.params.id
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    res.json(customer);

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// UPDATE CUSTOMER
router.put('/customers/:id', async (req, res) => {

  try {

    const customer = await User.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    customer.fullName =
      req.body.fullName;

    customer.email =
      req.body.email;

    customer.phoneNumber =
      req.body.phoneNumber;

    customer.address =
      req.body.address;

    // UPDATE PASSWORD
    if (req.body.password) {
      customer.password =
        req.body.password;
    }

    await customer.save();

    res.json({
      message: 'Customer Updated'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// DELETE CUSTOMER
router.delete('/customers/:id', async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: 'Customer Deleted'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server Error'
    });
  }
});


// SEND RESET EMAIL
router.post(
  '/customers/:id/reset-email',
  async (req, res) => {

    try {

      const customer =
        await User.findById(req.params.id);

      if (!customer) {
        return res.status(404).json({
          message: 'Customer not found'
        });
      }

      // CREATE TOKEN
      const token = crypto
        .randomBytes(20)
        .toString('hex');

      customer.resetPasswordToken = token;

      customer.resetPasswordExpires =
        Date.now() + 3600000;

      await customer.save();

      // RESET LINK
      const resetLink =
        `http://localhost:5173/reset-password/${token}`;

      // SEND MAIL
      await sendEmail({
        email: customer.email,
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
  }
);


module.exports = router;
