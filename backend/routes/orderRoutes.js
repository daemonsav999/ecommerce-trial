// routes/orderRoutes.js
const express = require('express');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const totalPrice = (product.discountPrice || product.price) * quantity;
    const order = await Order.create({
      userId: req.user.id,
      productId,
      quantity,
      totalPrice,
      status: 'pending',
    });
    
    // Integrate with a payment gateway here (e.g., Razorpay, Paytm)
    // For demonstration, assume immediate payment success:
    await order.update({ status: 'paid' });
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    next(err);
  }
});

// Get order details
router.get('/:orderId', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.orderId, userId: req.user.id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
