const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  
  // Profile Information
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    location: {
      type: String,
      required: true
    },
    workCategory: {
      type: String,
      enum: ['technology', 'finance', 'healthcare', 'education', 'marketing', 'sales', 'agriculture', 'mining', 'tourism', 'freelance', 'other']
    },
    experience: {
      type: String,
      enum: ['entry', 'mid', 'specialized']
    },
    bio: String,
    profileImage: String,
    videoUrl: String, // Premium feature
    portfolio: [{
      title: String,
      description: String,
      mediaUrl: String,
      mediaType: {
        type: String,
        enum: ['image', 'video', 'document']
      }
    }]
  },

  // Account Status
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Role and Permissions
  role: {
    type: String,
    enum: ['user', 'employer', 'admin'],
    default: 'user'
  },

  // Premium Features
  premiumPlan: {
    type: String,
    enum: ['free', 'k50', 'k100'],
    default: 'free'
  },
  premiumExpiresAt: Date,

  // Bidding System
  bids: {
    available: {
      type: Number,
      default: 50 // Free bids on signup
    },
    used: {
      type: Number,
      default: 0
    },
    purchased: {
      type: Number,
      default: 0
    }
  },

  // Wallet and Payments
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    accountNumber: {
      type: String,
      unique: true
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },

  // Trading Portfolio (ZedForex)
  tradingPortfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  },

  // Investment Portfolio (ZedInvest)
  investmentPortfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  },

  // Referral System
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referrals: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    earned: {
      type: Number,
      default: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],

  // Achievements and Badges
  achievements: [{
    type: String,
    enum: [
      'first_job',
      'ten_jobs',
      'hundred_bids',
      'first_withdrawal',
      'verified_trader',
      'verified_investor',
      'top_earner',
      'premium_user'
    ]
  }],

  // Statistics
  stats: {
    totalEarnings: {
      type: Number,
      default: 0
    },
    jobsCompleted: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalTrades: {
      type: Number,
      default: 0
    },
    tradingProfit: {
      type: Number,
      default: 0
    },
    totalInvestments: {
      type: Number,
      default: 0
    },
    investmentReturns: {
      type: Number,
      default: 0
    }
  },

  // KYC Information
  kyc: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    documents: [{
      type: String,
      enum: ['id_card', 'passport', 'drivers_license', 'utility_bill'],
      required: true
    }],
    documentUrls: [String],
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      earningsVisible: { type: Boolean, default: false }
    },
    aiAssistant: {
      enabled: { type: Boolean, default: false },
      tone: {
        type: String,
        enum: ['professional', 'friendly', 'creative'],
        default: 'professional'
      }
    }
  },

  // Timestamps
  lastLogin: Date,
  lastActive: Date
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for total portfolio value
userSchema.virtual('totalPortfolioValue').get(function() {
  const tradingValue = this.tradingPortfolio?.totalValue || 0;
  const investmentValue = this.investmentPortfolio?.totalValue || 0;
  return tradingValue + investmentValue;
});

// Virtual for total bids
userSchema.virtual('totalBids').get(function() {
  return this.bids.available + this.bids.purchased - this.bids.used;
});

// Virtual for is premium
userSchema.virtual('isPremium').get(function() {
  return this.premiumPlan !== 'free' && 
         (!this.premiumExpiresAt || this.premiumExpiresAt > new Date());
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Generate account number if new user
  if (this.isNew && !this.wallet.accountNumber) {
    this.wallet.accountNumber = `ZH${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  // Generate referral code if new user
  if (this.isNew && !this.referralCode) {
    this.referralCode = `REF${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  // Update lastActive
  this.lastActive = new Date();

  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to deduct bids
userSchema.methods.deductBids = function(amount) {
  if (this.bids.available >= amount) {
    this.bids.available -= amount;
    this.bids.used += amount;
    return true;
  }
  return false;
};

// Method to add bids
userSchema.methods.addBids = function(amount, type = 'purchased') {
  if (type === 'purchased') {
    this.bids.purchased += amount;
  } else {
    this.bids.available += amount;
  }
};

// Method to add achievement
userSchema.methods.addAchievement = function(achievement) {
  if (!this.achievements.includes(achievement)) {
    this.achievements.push(achievement);
  }
};

// Method to update stats
userSchema.methods.updateStats = function(type, value) {
  switch (type) {
    case 'earnings':
      this.stats.totalEarnings += value;
      break;
    case 'jobs':
      this.stats.jobsCompleted += value;
      break;
    case 'trades':
      this.stats.totalTrades += value;
      break;
    case 'trading_profit':
      this.stats.tradingProfit += value;
      break;
    case 'investments':
      this.stats.totalInvestments += value;
      break;
    case 'investment_returns':
      this.stats.investmentReturns += value;
      break;
  }
};

// Ensure virtuals are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);