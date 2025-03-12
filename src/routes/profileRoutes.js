const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id })
      .populate('user', 'username email points loginStreak');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const {
      displayName,
      bio,
      phoneNumber,
      shippingAddress,
      billingAddress,
      preferences,
      socialLinks
    } = req.body;

    const profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.set({
      displayName,
      bio,
      phoneNumber,
      shippingAddress,
      billingAddress,
      preferences: { ...profile.preferences, ...preferences },
      socialLinks: { ...profile.socialLinks, ...socialLinks }
    });

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ... rest of the routes remain the same ...