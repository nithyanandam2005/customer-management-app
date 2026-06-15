require('dotenv').config();

const mongoose = require('mongoose');

const User = require('./models/User');


// VIEW DATABASE USERS
const viewDatabase = async () => {

  try {

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');


    // Get all users
    const users = await User.find()
      .select('-password');

    
    // Print users
    console.log(users);


    // Close connection
    mongoose.connection.close();

  } catch (error) {

    console.log('Error Viewing Database');
  }
};


// RUN FUNCTION
viewDatabase();
