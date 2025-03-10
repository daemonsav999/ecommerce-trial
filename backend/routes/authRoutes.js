// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
});

// Login and update login streaks
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Handle login streak logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).setHours(0, 0, 0, 0) : null;

    if (lastLogin && today === lastLogin) {
      // Already logged in today
    } else if (lastLogin && today - lastLogin === 86400000) {
      user.loginStreak += 1;
      user.points += 10; // Reward for maintaining streak
    } else {
      user.loginStreak = 1;
    }

    user.lastLoginDate = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, loginStreak: user.loginStreak, points: user.points });
  } catch (err) {
    next(err);
  }
});

// Subscribe to push notifications
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    const user = await User.findByPk(userId);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    user.notificationSubscription = subscription;
    await user.save();

    res.json({ message: "Subscription saved!" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Leaderboard Route
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.findAll({
      attributes: ["username", "points", "loginStreak"],
      order: [["points", "DESC"]],
      limit: 10,
    });

    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
