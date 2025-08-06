const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  businessName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'agriculture', 
      'technology', 
      'manufacturing', 
      'retail', 
      'services', 
      'mining', 
      'tourism',
      'transport',
      'construction',
      'healthcare',
      'education',
      'other'
    ]
  },
  location: {
    city: { type: String, required: true },
    province: { 
      type: String, 
      required: true,
      enum: [
        'Central', 'Copperbelt', 'Eastern', 'Luapula', 
        'Lusaka', 'Muchinga', 'Northern', 'North-Western', 
        'Southern', 'Western'
      ]
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  funding: {
    goal: { type: Number, required: true, min: 1000 },
    current: { type: Number, default: 0, min: 0 },
    minimum: { type: Number, required: true, min: 100 },
    currency: { type: String, default: 'ZMW' }
  },
  returns: {
    expected: { type: Number, required: true, min: 0, max: 100 }, // Percentage
    timeline: { type: String, required: true }, // e.g., "12 months", "2 years"
    type: { 
      type: String, 
      enum: ['fixed', 'variable', 'equity'], 
      default: 'fixed' 
    }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  documents: {
    businessPlan: String, // File URL
    financials: String, // File URL
    licenses: [String], // Array of file URLs
    images: [String],
    certificates: [String]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    percentage: Number, // For equity investments
    date: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'paid', 'cancelled'], 
      default: 'pending' 
    },
    paymentReference: String,
    expectedReturns: Number
  }],
  milestones: [{
    title: { type: String, required: true },
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedDate: Date,
    evidence: [String] // File URLs for proof
  }],
  updates: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    attachments: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'active', 'funded', 'closed', 'cancelled', 'rejected'],
    default: 'draft'
  },
  verification: {
    status: { 
      type: String, 
      enum: ['pending', 'verified', 'rejected'], 
      default: 'pending' 
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    notes: String
  },
  featured: { type: Boolean, default: false },
  deadline: Date,
  tags: [String],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    website: String
  },
  contactInfo: {
    email: String,
    phone: String,
    whatsapp: String
  },
  analytics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better performance
InvestmentSchema.index({ category: 1, status: 1 });
InvestmentSchema.index({ 'location.province': 1, 'location.city': 1 });
InvestmentSchema.index({ owner: 1 });
InvestmentSchema.index({ featured: 1, status: 1 });
InvestmentSchema.index({ createdAt: -1 });

// Virtual for funding progress percentage
InvestmentSchema.virtual('fundingProgress').get(function() {
  return Math.round((this.funding.current / this.funding.goal) * 100);
});

// Virtual for total investors count
InvestmentSchema.virtual('investorCount').get(function() {
  return this.investors.filter(inv => inv.status === 'confirmed' || inv.status === 'paid').length;
});

// Pre-save middleware to update the updatedAt field
InvestmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add investor
InvestmentSchema.methods.addInvestor = function(userId, amount) {
  const investment = {
    user: userId,
    amount: amount,
    percentage: this.returns.type === 'equity' ? (amount / this.funding.goal) * 100 : 0,
    expectedReturns: (amount * this.returns.expected) / 100
  };
  
  this.investors.push(investment);
  this.funding.current += amount;
  
  return this.save();
};

// Method to update funding status
InvestmentSchema.methods.updateFundingStatus = function() {
  if (this.funding.current >= this.funding.goal) {
    this.status = 'funded';
  }
  return this.save();
};

module.exports = mongoose.model('Investment', InvestmentSchema);
