// models/groupOrderMember.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const GroupOrder = require('./groupOrderModel');
const User = require('./userModel');

const GroupOrderMember = sequelize.define('GroupOrderMember', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

// Many-to-Many: GroupOrder ↔ User
GroupOrder.belongsToMany(User, { through: GroupOrderMember, as: 'members', foreignKey: 'groupOrderId' });
User.belongsToMany(GroupOrder, { through: GroupOrderMember, as: 'groupOrders', foreignKey: 'userId' });

module.exports = GroupOrderMember;
