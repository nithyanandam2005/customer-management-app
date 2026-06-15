require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();


// CONNECT DATABASE
connectDB();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);


// HOME ROUTE
app.get('/', (req, res) => {
  res.json({
    message: 'Server Running Successfully'
  });
});


// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
