// models/index.js
const { sequelize } = require('../config/db');
const User = require('./userModel');
const UserProfile = require('./userProfileModel');
const Product = require('./productModel');

// Define associations
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile'
});
UserProfile.belongsTo(User, {
  foreignKey: 'userId'
});

// Export models
module.exports = {
  sequelize,
  User,
  UserProfile,
  Product
};