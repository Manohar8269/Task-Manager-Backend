const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("📩 Register Request Received:", { name, email });

    // 0️⃣ Validate input fields
    if (!name || !email || !password) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ User Registered Successfully:", newUser.email);
    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    // 🧩 Here’s the enhanced error log you asked for
    console.error("❌ Register Error:", error);
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
      error: error.message,
    });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login Request Received:", email);

    // 0️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: 'User not found' });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Invalid password for:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    console.log("✅ Login Successful:", email);
    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
