const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../models/configDb'); // adjust path if needed
const User = require('../models/users')(sequelize); 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const signup = async (req, res) => {
  try {
    const { name, email, password, phone_number, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      phone_number,
      role: role || 'passenger', // fallback to 'passenger'
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.user_id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
}


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User Not Found' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    next(err)
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

module.exports = {login, signup}