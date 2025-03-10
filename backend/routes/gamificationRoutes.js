// routes/gamificationRoutes.js
const express = require('express');
const Gamification = require('../models/gamificationModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get a user's gamification status (points, badges)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    let gamification = await Gamification.findOne({ where: { userId: req.user.id } });
    if (!gamification) {
      gamification = await Gamification.create({ userId: req.user.id, points: 0, badges: [] });
    }
    res.json({ gamification });
  } catch (err) {
    next(err);
  }
});

// Update gamification points (for actions like group buying, purchases, etc.)
router.post('/update', authMiddleware, async (req, res, next) => {
  try {
    const { pointsEarned, badge } = req.body;
    let gamification = await Gamification.findOne({ where: { userId: req.user.id } });
    if (!gamification) {
      gamification = await Gamification.create({ userId: req.user.id, points: 0, badges: [] });
    }
    const newPoints = gamification.points + (pointsEarned || 0);
    let badges = gamification.badges || [];
    if (badge && !badges.includes(badge)) {
      badges.push(badge);
    }
    await gamification.update({ points: newPoints, badges });
    res.json({ message: 'Gamification updated', gamification });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
