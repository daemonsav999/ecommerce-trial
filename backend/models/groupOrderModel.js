// models/groupOrderModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Product = require('./productModel');

const GroupOrder = sequelize.define('GroupOrder', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  initiatorId: { type: DataTypes.INTEGER, allowNull: false },
  targetSize: { type: DataTypes.INTEGER, allowNull: false },
  membersJoined: { type: DataTypes.INTEGER, defaultValue: 1 }, // Track number of users joined
  status: { 
    type: DataTypes.ENUM('open', 'completed', 'expired'), 
    defaultValue: 'open' 
  },
  expiresAt: { type: DataTypes.DATE, allowNull: true }, // Future Expiration Support
}, {
  timestamps: true,
});

// Associations
GroupOrder.belongsTo(Product, { foreignKey: 'productId' });
GroupOrder.belongsTo(User, { foreignKey: 'initiatorId' });

module.exports = GroupOrder;
