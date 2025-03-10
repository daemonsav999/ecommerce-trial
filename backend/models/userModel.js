// models/userModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loginStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastLoginDate: {
    type: DataTypes.DATE
  },
  notificationSubscription: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    afterCreate: async (user) => {
      // Create user profile after user creation
      await sequelize.models.UserProfile.create({
        userId: user.id
      });
    }
  }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;