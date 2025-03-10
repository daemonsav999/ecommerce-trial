// models/gamificationModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');

const Gamification = sequelize.define('Gamification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  badges: { type: DataTypes.JSON, defaultValue: [] }, // Array of badge identifiers
}, {
  timestamps: true,
});

Gamification.belongsTo(User, { foreignKey: 'userId' });

module.exports = Gamification;
