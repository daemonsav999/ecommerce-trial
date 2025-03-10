// models/productModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: { 
    type: DataTypes.TEXT,
    validate: {
      notEmpty: true
    }
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), // Changed from FLOAT for better precision
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountPrice: { 
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0,
      isLessThanPrice(value) {
        if (value >= this.price) {
          throw new Error('Discount price must be less than regular price');
        }
      }
    }
  },
  imageUrl: { 
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['name']
    }
  ]
});

module.exports = Product;