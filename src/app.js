const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./models/configDb')
const User = require('./models/users')
// You can import other protected routes as needed

// ===== Middleware Setup =====
app.use(cors());
app.use(express.json());

// ✅ Logger Middleware (inline)
app.use((req, res, next) => {
  // console.log(sequelize)
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ===== Routes =====
app.use('/api/auth', authRoutes);

// Add protected routes like:
// app.use('/api/bookings', authMiddleware, bookingRoutes);

// ✅ Global Error Handler (inline)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

sequelize.sync({ alter: true })  // or { force: true } to drop & recreate
  .then(() => {
    console.log('✅ All models synchronized successfully.');
  })
  .catch(err => {
    console.error('❌ Failed to sync models:', err);
  });
  // User.sync({ alter: true }) For single model sync

module.exports = app;
