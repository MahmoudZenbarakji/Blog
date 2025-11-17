const User = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};


exports.signup = async (req, res) => {
  try {
    const { name, lastname, username, email, password, birthDate } = req.body;

    // Check required fields
    if (!name || !lastname || !username || !email || !password || !birthDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
      birthDate
    });

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};



// =================== LOGIN ===================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and Password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token: generateToken(user._id),
      user: user
    });

  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ status: "success", data: user });
};
