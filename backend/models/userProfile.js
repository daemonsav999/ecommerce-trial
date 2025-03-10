const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  bio: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    groupBuyUpdates: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalGroupBuys: {
      type: Number,
      default: 0
    },
    successfulGroupBuys: {
      type: Number,
      default: 0
    },
    totalSavings: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  verifiedStatus: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    identity: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Middleware to create profile when user is created
userProfileSchema.statics.createProfile = async function(userId) {
  return this.create({ user: userId });
};

// Instance methods
userProfileSchema.methods.updateStats = async function(field, value) {
  if (typeof value === 'number') {
    this.stats[field] = value;
  } else {
    this.stats[field] += 1;
  }
  return this.save();
};

userProfileSchema.methods.addSavings = async function(amount) {
  this.stats.totalSavings += parseFloat(amount);
  return this.save();
};

userProfileSchema.methods.updateVerificationStatus = async function(field, status) {
  this.verifiedStatus[field] = status;
  return this.save();
};

// Virtual for full name
userProfileSchema.virtual('fullAddress').get(function() {
  const addr = this.shippingAddress;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;