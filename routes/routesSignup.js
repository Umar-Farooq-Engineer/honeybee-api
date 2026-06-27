const express = require('express');
const router = express.Router();
const Signup = require('../models/signup');
const bcrypt = require('bcrypt'); // for hashing passwords

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Signup({
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword, // optional, can remove in real app
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'Account created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
