const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'finance', 'healthcare', 'education', 'marketing', 'sales', 'agriculture', 'mining', 'tourism', 'freelance', 'other']
  },
  
  // Job Type and Pricing
  jobType: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'freelance', 'contract', 'internship', 'gig']
  },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'ZMW' },
    period: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'], default: 'monthly' }
  },
  
  // Requirements and Benefits
  requirements: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  
  // Employer Information
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Applications with Enhanced Features
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    proposal: {
      type: String,
      required: true,
      maxlength: 500 // Bid proposal limit
    },
    hourlyRate: {
      type: Number,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100
    },
    location: {
      type: String,
      required: true
    },
    workExperience: {
      type: String,
      required: true
    },
    profileImage: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    bidsUsed: {
      type: Number,
      required: true
    },
    isHighPriority: {
      type: Boolean,
      default: false
    },
    aiGenerated: {
      type: Boolean,
      default: false
    },
    aiTone: {
      type: String,
      enum: ['professional', 'friendly', 'creative']
    },
    visibilityScore: {
      type: Number,
      default: 0
    }
  }],
  
  // Job Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'filled', 'expired'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Pricing for Offline Jobs
  postingFee: {
    type: Number,
    default: 0 // K100 for offline jobs
  },
  feePaid: {
    type: Boolean,
    default: false
  },
  
  // Deadlines and Timestamps
  deadline: {
    type: Date,
    required: true
  },
  startDate: Date,
  endDate: Date,
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  
  // Job Specific Details
  isRemote: {
    type: Boolean,
    default: false
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'specialized'],
    required: true
  },
  contractLength: {
    type: String,
    enum: ['one-time', 'ongoing', 'fixed-term']
  },
  
  // Tags and Search
  tags: [String],
  searchKeywords: [String]
}, {
  timestamps: true
});

// Virtual for days until deadline
jobSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Virtual for is expired
jobSchema.virtual('isExpired').get(function() {
  return new Date() > new Date(this.deadline);
});

// Virtual for average hourly rate
jobSchema.virtual('averageHourlyRate').get(function() {
  if (this.applications.length === 0) return 0;
  const total = this.applications.reduce((sum, app) => sum + app.hourlyRate, 0);
  return total / this.applications.length;
});

// Method to check if user has applied
jobSchema.methods.hasUserApplied = function(userId) {
  return this.applications.some(app => app.applicant.toString() === userId.toString());
};

// Method to add application
jobSchema.methods.addApplication = function(applicationData) {
  // Check if user already applied
  if (this.hasUserApplied(applicationData.applicant)) {
    throw new Error('User has already applied to this job');
  }

  // Determine bid cost based on experience level
  let bidCost = 5; // Entry level
  if (applicationData.experienceLevel === 'mid') {
    bidCost = 10;
  } else if (applicationData.experienceLevel === 'specialized') {
    bidCost = 15;
  }

  // Add bid cost to application
  applicationData.bidsUsed = bidCost;

  this.applications.push(applicationData);
  this.applicationsCount = this.applications.length;
  
  return this.save();
};

// Method to update application status
jobSchema.methods.updateApplicationStatus = function(applicationId, status) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  application.status = status;
  return this.save();
};

// Method to mark application as high priority (for premium users)
jobSchema.methods.markHighPriority = function(applicationId) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  application.isHighPriority = true;
  return this.save();
};

// Method to calculate visibility score
jobSchema.methods.calculateVisibilityScore = function(applicationId) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  let score = 0;
  
  // Base score for applying
  score += 10;
  
  // Premium user bonus
  if (application.isHighPriority) {
    score += 20;
  }
  
  // AI generated bonus
  if (application.aiGenerated) {
    score += 5;
  }
  
  // Experience level bonus
  switch (application.experienceLevel) {
    case 'specialized':
      score += 15;
      break;
    case 'mid':
      score += 10;
      break;
    case 'entry':
      score += 5;
      break;
  }
  
  // Profile completeness bonus
  if (application.profileImage) {
    score += 5;
  }
  
  application.visibilityScore = score;
  return this.save();
};

// Method to get applications sorted by priority
jobSchema.methods.getSortedApplications = function() {
  return this.applications.sort((a, b) => {
    // High priority applications first
    if (a.isHighPriority && !b.isHighPriority) return -1;
    if (!a.isHighPriority && b.isHighPriority) return 1;
    
    // Then by visibility score
    if (a.visibilityScore !== b.visibilityScore) {
      return b.visibilityScore - a.visibilityScore;
    }
    
    // Then by application date
    return new Date(b.appliedAt) - new Date(a.appliedAt);
  });
};

// Ensure virtuals are serialized
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
