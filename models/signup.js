const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer', // default role
  }
}, { timestamps: true });

module.exports = mongoose.model('Signup', signupSchema);
