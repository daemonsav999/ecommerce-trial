// routes/groupBuyingRoutes.js
const express = require('express');
const GroupOrder = require('../models/groupOrderModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new group order
router.post('/create', authMiddleware, async (req, res, next) => {
  try {
    const { productId, targetSize } = req.body;
    if (!productId || !targetSize) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Create group order with the current user as the initiator
    const groupOrder = await GroupOrder.create({
      productId,
      initiatorId: req.user.id,
      targetSize,
      status: 'open',
    });
    // Automatically add the initiator as a member
    await groupOrder.addMember(req.user.id);
    res.status(201).json({ message: 'Group order created', groupOrder });
  } catch (err) {
    next(err);
  }
});

// Join an existing group order
router.post('/join/:groupOrderId', authMiddleware, async (req, res, next) => {
  try {
    const groupOrder = await GroupOrder.findByPk(req.params.groupOrderId);
    if (!groupOrder) return res.status(404).json({ message: 'Group order not found' });
    
    // Check if user already joined
    const members = await groupOrder.getMembers();
    if (members.find(member => member.id === req.user.id)) {
      return res.status(400).json({ message: 'User already joined this group order' });
    }
    
    // Add the user to the group order
    await groupOrder.addMember(req.user.id);
    
    // Refresh members count and update status if complete
    const updatedMembers = await groupOrder.getMembers();
    if (updatedMembers.length >= groupOrder.targetSize) {
      await groupOrder.update({ status: 'completed' });
      // Optionally, trigger notifications or other business logic here
    }
    
    res.json({ message: 'Joined group order successfully', groupOrder });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
