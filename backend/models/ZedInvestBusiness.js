const mongoose = require('mongoose');

const zedInvestBusinessSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'technology', 'manufacturing', 'retail', 'services', 'mining', 'tourism', 'education', 'healthcare', 'other']
  },
  
  // Business Details
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  established: {
    type: Date,
    required: true
  },
  
  // Investment Information
  totalValue: {
    type: Number,
    required: true,
    min: 0
  },
  tokensIssued: {
    type: Number,
    required: true,
    min: 0
  },
  tokensAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  tokenPrice: {
    type: Number,
    required: true,
    min: 0
  },
  minInvestment: {
    type: Number,
    required: true,
    min: 0
  },
  maxInvestment: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Financial Performance
  annualRevenue: {
    type: Number,
    default: 0
  },
  annualProfit: {
    type: Number,
    default: 0
  },
  expectedReturn: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  dividendRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'funded', 'closed', 'suspended'],
    default: 'pending'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Media and Documentation
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['business_plan', 'financial_statement', 'legal_document', 'other']
    }
  }],
  
  // Business Plan
  businessPlan: {
    summary: String,
    marketAnalysis: String,
    competitiveAdvantage: String,
    growthStrategy: String,
    riskFactors: String
  },
  
  // Investment Terms
  investmentTerms: {
    lockPeriod: {
      type: Number,
      default: 12 // months
    },
    exitStrategy: String,
    votingRights: {
      type: Boolean,
      default: false
    },
    dividendSchedule: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually', 'none'],
      default: 'quarterly'
    }
  },
  
  // Investors and Transactions
  investors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tokensOwned: {
      type: Number,
      required: true,
      min: 0
    },
    totalInvested: {
      type: Number,
      required: true,
      min: 0
    },
    investedAt: {
      type: Date,
      default: Date.now
    },
    dividendsReceived: {
      type: Number,
      default: 0
    }
  }],
  
  // Performance Metrics
  performance: {
    totalInvestors: {
      type: Number,
      default: 0
    },
    totalInvestment: {
      type: Number,
      default: 0
    },
    fundingProgress: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  
  // Updates and Communication
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['financial', 'operational', 'milestone', 'general']
    }
  }],
  
  // Reviews and Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags and Search
  tags: [String],
  searchKeywords: [String]
}, {
  timestamps: true
});

// Virtual for funding percentage
zedInvestBusinessSchema.virtual('fundingPercentage').get(function() {
  if (this.tokensIssued === 0) return 0;
  return ((this.tokensIssued - this.tokensAvailable) / this.tokensIssued) * 100;
});

// Virtual for tokens sold
zedInvestBusinessSchema.virtual('tokensSold').get(function() {
  return this.tokensIssued - this.tokensAvailable;
});

// Virtual for total market cap
zedInvestBusinessSchema.virtual('marketCap').get(function() {
  return this.tokensIssued * this.tokenPrice;
});

// Virtual for business age
zedInvestBusinessSchema.virtual('businessAge').get(function() {
  const now = new Date();
  const established = new Date(this.established);
  const diffTime = Math.abs(now - established);
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
});

// Method to add investor
zedInvestBusinessSchema.methods.addInvestor = function(userId, tokens, amount) {
  // Check if user is already an investor
  const existingInvestor = this.investors.find(inv => inv.user.toString() === userId.toString());
  
  if (existingInvestor) {
    existingInvestor.tokensOwned += tokens;
    existingInvestor.totalInvested += amount;
  } else {
    this.investors.push({
      user: userId,
      tokensOwned: tokens,
      totalInvested: amount
    });
    this.performance.totalInvestors += 1;
  }
  
  // Update business metrics
  this.tokensAvailable -= tokens;
  this.performance.totalInvestment += amount;
  this.performance.fundingProgress = this.fundingPercentage;
  
  return this.save();
};

// Method to distribute dividends
zedInvestBusinessSchema.methods.distributeDividends = function(amount) {
  const totalTokens = this.tokensIssued - this.tokensAvailable;
  if (totalTokens === 0) return;
  
  const dividendPerToken = amount / totalTokens;
  
  this.investors.forEach(investor => {
    const dividend = investor.tokensOwned * dividendPerToken;
    investor.dividendsReceived += dividend;
  });
  
  return this.save();
};

// Method to add update
zedInvestBusinessSchema.methods.addUpdate = function(updateData) {
  this.updates.push(updateData);
  return this.save();
};

// Method to add review
zedInvestBusinessSchema.methods.addReview = function(userId, rating, comment) {
  // Check if user has already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.date = new Date();
  } else {
    this.reviews.push({
      user: userId,
      rating,
      comment
    });
    this.performance.totalReviews += 1;
  }
  
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.performance.averageRating = totalRating / this.reviews.length;
  
  return this.save();
};

// Method to calculate ROI
zedInvestBusinessSchema.methods.calculateROI = function() {
  if (this.performance.totalInvestment === 0) return 0;
  
  const currentValue = this.marketCap;
  const totalInvestment = this.performance.totalInvestment;
  
  return ((currentValue - totalInvestment) / totalInvestment) * 100;
};

// Static method to get active businesses
zedInvestBusinessSchema.statics.getActiveBusinesses = function() {
  return this.find({ status: 'active' }).sort({ createdAt: -1 });
};

// Static method to get featured businesses
zedInvestBusinessSchema.statics.getFeaturedBusinesses = function() {
  return this.find({ isFeatured: true, status: 'active' }).sort({ createdAt: -1 });
};

// Static method to get businesses by category
zedInvestBusinessSchema.statics.getBusinessesByCategory = function(category) {
  return this.find({ category, status: 'active' }).sort({ createdAt: -1 });
};

// Ensure virtuals are serialized
zedInvestBusinessSchema.set('toJSON', { virtuals: true });
zedInvestBusinessSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ZedInvestBusiness', zedInvestBusinessSchema); 