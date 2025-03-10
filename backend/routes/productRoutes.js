// routes/productRoutes.js
const express = require('express');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Retrieve all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// Retrieve product details by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// Create a new product (Admin only)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, description, price, discountPrice, imageUrl, stock } = req.body;
    const product = await Product.create({ name, description, price, discountPrice, imageUrl, stock });
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    next(err);
  }
});

// Update an existing product (Admin only)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { name, description, price, discountPrice, imageUrl, stock } = req.body;
    await product.update({ name, description, price, discountPrice, imageUrl, stock });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
