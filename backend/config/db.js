const mongoose = require('mongoose');

const User = require('../models/User');


// CONNECT DATABASE
const connectDB = async () => {

  try {

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');

    // Create admin account
    await createAdmin();

  } catch (error) {

    console.log('Database Connection Failed');

    process.exit(1);
  }
};


// CREATE ADMIN USER
const createAdmin = async () => {

  // Check admin exists
  const adminExists = await User.findOne({
    role: 'admin'
  });

  // Create admin if not exists
  if (!adminExists) {

    await User.create({
      fullName: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      phoneNumber: '1234567890',
      address: 'Admin Address',
      role: 'admin'
    });

    console.log('Admin Created');
  }
};


module.exports = connectDB;
