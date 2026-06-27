const express = require('express');
const router = express.Router();
const Signup = require('../models/signup');
const bcrypt = require('bcrypt');

router.post('/user', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Success: include role in response
    res.json({ success: true, message: 'Login successful', user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
