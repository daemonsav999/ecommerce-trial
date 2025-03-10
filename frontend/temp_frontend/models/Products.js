const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  inventory: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  groupBuyingRules: {
    minParticipants: { type: Number, default: 2 },
    discount: { type: Number, required: true },
    expiryTime: { type: Date, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);