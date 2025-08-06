const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_001',
      message: 'Too many requests, please try again later'
    }
  }
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_002',
      message: 'Too many authentication attempts, please try again later'
    }
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data storage for testing (replace with Firebase later)
const users = [
  {
    id: '1',
    email: 'admin@zedhustle.com',
    password: '$2b$10$example', // hashed password
    name: 'Admin User',
    role: 'admin',
    phone: '+260955123456',
    profile: {
      age: 30,
      workCategory: 'technology',
      experience: '5+ years',
      bio: 'Platform administrator',
      profileImage: 'https://via.placeholder.com/150',
      videoUrl: null,
      portfolio: []
    },
    emailVerified: true,
    phoneVerified: true,
    premiumPlan: 'premium_100',
    premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    bids: {
      available: 300,
      used: 0,
      purchased: 0
    },
    wallet: {
      balance: 10000,
      accountNumber: 'ZH001',
      transactions: []
    },
    referralCode: 'ADMIN001',
    referredBy: null,
    referrals: [],
    achievements: ['first_job', 'first_trade', 'first_investment'],
    stats: {
      totalEarnings: 5000,
      jobsCompleted: 10,
      tradingProfit: 2000,
      investmentReturns: 1000,
      totalWithdrawals: 2000,
      totalDeposits: 10000
    },
    kyc: {
      status: 'verified',
      documents: ['id_card', 'proof_of_address'],
      verifiedAt: new Date()
    },
    preferences: {
      privacy: 'public',
      aiAssistant: true
    },
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'user@zedhustle.com',
    password: '$2b$10$example', // hashed password
    name: 'Test User',
    role: 'user',
    phone: '+260955789012',
    profile: {
      age: 25,
      workCategory: 'freelance',
      experience: '2-3 years',
      bio: 'Freelance developer looking for opportunities',
      profileImage: 'https://via.placeholder.com/150',
      videoUrl: null,
      portfolio: ['https://example.com/portfolio1', 'https://example.com/portfolio2']
    },
    emailVerified: true,
    phoneVerified: false,
    premiumPlan: 'free',
    premiumExpiresAt: null,
    bids: {
      available: 50,
      used: 5,
      purchased: 0
    },
    wallet: {
      balance: 2500,
      accountNumber: 'ZH002',
      transactions: []
    },
    referralCode: 'USER002',
    referredBy: 'ADMIN001',
    referrals: [],
    achievements: ['first_job'],
    stats: {
      totalEarnings: 1500,
      jobsCompleted: 3,
      tradingProfit: 500,
      investmentReturns: 0,
      totalWithdrawals: 500,
      totalDeposits: 3000
    },
    kyc: {
      status: 'pending',
      documents: [],
      verifiedAt: null
    },
    preferences: {
      privacy: 'public',
      aiAssistant: false
    },
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const jobs = [
  {
    id: '1',
    title: 'Web Developer Needed',
    description: 'Looking for a skilled web developer to build a modern e-commerce website using Vue.js and Node.js.',
    employer: '1',
    jobType: 'online',
    salary: {
      min: 5000,
      max: 8000,
      currency: 'ZMW',
      period: 'monthly'
    },
    experienceLevel: 'intermediate',
    skills: ['Vue.js', 'Node.js', 'MongoDB', 'JavaScript'],
    location: 'Lusaka, Zambia',
    status: 'active',
    applications: [],
    views: 45,
    featured: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    tags: ['web-development', 'vue.js', 'node.js'],
    searchKeywords: ['web developer', 'vue', 'node', 'javascript'],
    postingFee: 100,
    feePaid: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Mobile App Developer',
    description: 'Seeking an experienced mobile app developer to create a cross-platform app using React Native.',
    employer: '1',
    jobType: 'online',
    salary: {
      min: 6000,
      max: 10000,
      currency: 'ZMW',
      period: 'monthly'
    },
    experienceLevel: 'senior',
    skills: ['React Native', 'JavaScript', 'Firebase', 'API Integration'],
    location: 'Remote',
    status: 'active',
    applications: [],
    views: 32,
    featured: false,
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    tags: ['mobile-development', 'react-native', 'cross-platform'],
    searchKeywords: ['mobile developer', 'react native', 'app development'],
    postingFee: 100,
    feePaid: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const zedForexTokens = [
  {
    id: '1',
    symbol: 'COPPER',
    name: 'Copper Token',
    commodity: 'copper',
    description: 'Token backed by Zambian copper reserves',
    currentPrice: 150.50,
    previousPrice: 148.75,
    priceChange: 1.75,
    priceChangePercent: 1.18,
    marketCap: 1500000,
    volume24h: 25000,
    high24h: 152.00,
    low24h: 147.50,
    totalSupply: 10000,
    circulatingSupply: 8500,
    isActive: true,
    isFeatured: true,
    commodityData: {
      unit: 'kg',
      source: 'Zambian Mining Authority',
      lastUpdated: new Date()
    },
    priceHistory: [
      { price: 148.75, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { price: 150.50, timestamp: new Date() }
    ],
    tradingStats: {
      totalTrades: 150,
      totalVolume: 25000,
      averageTradeSize: 166.67
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    symbol: 'GOLD',
    name: 'Gold Token',
    commodity: 'gold',
    description: 'Token backed by gold reserves',
    currentPrice: 2500.00,
    previousPrice: 2480.00,
    priceChange: 20.00,
    priceChangePercent: 0.81,
    marketCap: 2500000,
    volume24h: 15000,
    high24h: 2510.00,
    low24h: 2475.00,
    totalSupply: 1000,
    circulatingSupply: 800,
    isActive: true,
    isFeatured: true,
    commodityData: {
      unit: 'g',
      source: 'International Gold Standard',
      lastUpdated: new Date()
    },
    priceHistory: [
      { price: 2480.00, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { price: 2500.00, timestamp: new Date() }
    ],
    tradingStats: {
      totalTrades: 75,
      totalVolume: 15000,
      averageTradeSize: 200.00
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const zedInvestBusinesses = [
  {
    id: '1',
    name: 'TechStart Zambia',
    description: 'Innovative technology startup focusing on mobile payment solutions for the Zambian market.',
    category: 'technology',
    owner: '1',
    location: 'Lusaka, Zambia',
    established: new Date('2022-01-15'),
    totalValue: 500000,
    tokensIssued: 10000,
    tokensAvailable: 3000,
    tokenPrice: 50,
    minInvestment: 100,
    maxInvestment: 50000,
    annualRevenue: 200000,
    annualProfit: 50000,
    expectedReturn: 25,
    dividendRate: 8,
    status: 'active',
    isFeatured: true,
    isVerified: true,
    images: [
      { url: 'https://via.placeholder.com/400x300', caption: 'Office Building', isPrimary: true },
      { url: 'https://via.placeholder.com/400x300', caption: 'Team Meeting', isPrimary: false }
    ],
    documents: [
      { name: 'Business Plan', url: 'https://example.com/business-plan.pdf', type: 'business_plan' },
      { name: 'Financial Statement', url: 'https://example.com/financial.pdf', type: 'financial_statement' }
    ],
    businessPlan: {
      summary: 'Mobile payment platform for Zambia',
      marketAnalysis: 'Growing mobile money market in Zambia',
      competitiveAdvantage: 'Local market knowledge and partnerships',
      growthStrategy: 'Expand to rural areas and add new services',
      riskFactors: 'Regulatory changes, competition from established players'
    },
    investmentTerms: {
      lockPeriod: 12,
      exitStrategy: 'IPO or acquisition within 5 years',
      votingRights: true,
      dividendSchedule: 'quarterly'
    },
    investors: [
      {
        user: '2',
        tokensOwned: 100,
        totalInvested: 5000,
        investedAt: new Date(),
        dividendsReceived: 400
      }
    ],
    performance: {
      totalInvestors: 1,
      totalInvestment: 5000,
      fundingProgress: 70,
      averageRating: 4.5,
      totalReviews: 1
    },
    updates: [
      {
        title: 'Q3 2024 Financial Update',
        content: 'Strong revenue growth of 25% compared to Q2',
        date: new Date(),
        type: 'financial'
      }
    ],
    reviews: [
      {
        user: '2',
        rating: 5,
        comment: 'Excellent business model and strong team. Highly recommended!',
        date: new Date()
      }
    ],
    tags: ['technology', 'mobile-payments', 'fintech'],
    searchKeywords: ['tech', 'mobile', 'payment', 'startup'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: 'Access token required'
      }
    });
  }

  // For testing, accept any token that starts with 'test-'
  if (token.startsWith('test-')) {
    const userId = token.replace('test-', '');
    const user = users.find(u => u.id === userId);
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Invalid token'
        }
      });
    }
  } else {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_002',
        message: 'Invalid token'
      }
    });
  }
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "ZedHustle API is running with Firebase 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: "Firebase (Test Mode)"
  });
});

// Authentication routes
app.post('/api/auth/register', authLimiter, (req, res) => {
  const { email, password, name, phone } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_003',
        message: 'Email, password, and name are required'
      }
    });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_004',
        message: 'User already exists'
      }
    });
  }

  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password: '$2b$10$example', // In real app, hash the password
    name,
    phone: phone || null,
    role: 'user',
    profile: {
      age: null,
      workCategory: null,
      experience: null,
      bio: null,
      profileImage: null,
      videoUrl: null,
      portfolio: []
    },
    emailVerified: false,
    phoneVerified: false,
    premiumPlan: 'free',
    premiumExpiresAt: null,
    bids: {
      available: 50,
      used: 0,
      purchased: 0
    },
    wallet: {
      balance: 0,
      accountNumber: `ZH${String(users.length + 1).padStart(3, '0')}`,
      transactions: []
    },
    referralCode: `USER${String(users.length + 1).padStart(3, '0')}`,
    referredBy: null,
    referrals: [],
    achievements: [],
    stats: {
      totalEarnings: 0,
      jobsCompleted: 0,
      tradingProfit: 0,
      investmentReturns: 0,
      totalWithdrawals: 0,
      totalDeposits: 0
    },
    kyc: {
      status: 'pending',
      documents: [],
      verifiedAt: null
    },
    preferences: {
      privacy: 'public',
      aiAssistant: false
    },
    lastActive: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      token: `test-${newUser.id}`
    }
  });
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'AUTH_003',
        message: 'Email and password are required'
      }
    });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_005',
        message: 'Invalid credentials'
      }
    });
  }

  // In real app, verify password hash
  if (password !== 'password123') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_005',
        message: 'Invalid credentials'
      }
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        premiumPlan: user.premiumPlan,
        bids: user.bids,
        wallet: user.wallet
      },
      token: `test-${user.id}`
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        profile: req.user.profile,
        premiumPlan: req.user.premiumPlan,
        bids: req.user.bids,
        wallet: req.user.wallet,
        referralCode: req.user.referralCode,
        achievements: req.user.achievements,
        stats: req.user.stats
      }
    }
  });
});

// Jobs routes
app.get('/api/jobs', (req, res) => {
  const { page = 1, limit = 10, search, category, location, jobType } = req.query;
  
  let filteredJobs = [...jobs];

  if (search) {
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (category) {
    filteredJobs = filteredJobs.filter(job => 
      job.skills.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
    );
  }

  if (location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (jobType) {
    filteredJobs = filteredJobs.filter(job => job.jobType === jobType);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      jobs: paginatedJobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredJobs.length / limit),
        totalJobs: filteredJobs.length,
        hasNextPage: endIndex < filteredJobs.length,
        hasPrevPage: page > 1
      }
    }
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'JOB_001',
        message: 'Job not found'
      }
    });
  }

  // Increment views
  job.views += 1;

  res.json({
    success: true,
    data: { job }
  });
});

app.post('/api/jobs/:id/apply', authenticateToken, (req, res) => {
  const { proposal, hourlyRate } = req.body;
  const job = jobs.find(j => j.id === req.params.id);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'JOB_001',
        message: 'Job not found'
      }
    });
  }

  if (!proposal || !hourlyRate) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'JOB_002',
        message: 'Proposal and hourly rate are required'
      }
    });
  }

  // Check if user has enough bids
  if (req.user.bids.available < 1) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BID_001',
        message: 'Insufficient bids. Please purchase more bids to apply.'
      }
    });
  }

  // Deduct bid
  req.user.bids.available -= 1;
  req.user.bids.used += 1;

  const application = {
    id: (job.applications.length + 1).toString(),
    user: req.user.id,
    proposal,
    hourlyRate: parseFloat(hourlyRate),
    age: req.user.profile.age,
    location: req.user.profile.location || 'Not specified',
    workExperience: req.user.profile.experience,
    profileImage: req.user.profile.profileImage,
    bidsUsed: 1,
    isHighPriority: req.user.premiumPlan !== 'free',
    aiGenerated: false,
    aiTone: null,
    visibilityScore: Math.floor(Math.random() * 100) + 1,
    status: 'pending',
    appliedAt: new Date()
  };

  job.applications.push(application);

  res.json({
    success: true,
    message: 'Application submitted successfully',
    data: { application }
  });
});

// ZedForex routes
app.get('/api/zedforex/tokens', (req, res) => {
  res.json({
    success: true,
    data: { tokens: zedForexTokens }
  });
});

app.get('/api/zedforex/tokens/featured', (req, res) => {
  const featuredTokens = zedForexTokens.filter(token => token.isFeatured);
  res.json({
    success: true,
    data: { tokens: featuredTokens }
  });
});

app.get('/api/zedforex/portfolio', authenticateToken, (req, res) => {
  // Mock portfolio data
  const portfolio = {
    totalValue: 5000,
    availableBalance: 2500,
    totalProfit: 500,
    holdings: [
      {
        token: zedForexTokens[0],
        quantity: 10,
        averagePrice: 145.00,
        currentValue: 1505.00,
        profit: 55.00
      }
    ],
    recentTrades: [
      {
        id: '1',
        token: 'COPPER',
        action: 'buy',
        quantity: 10,
        price: 145.00,
        total: 1450.00,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  };

  res.json({
    success: true,
    data: { portfolio }
  });
});

// ZedInvest routes
app.get('/api/zedinvest/businesses', (req, res) => {
  res.json({
    success: true,
    data: { businesses: zedInvestBusinesses }
  });
});

app.get('/api/zedinvest/businesses/featured', (req, res) => {
  const featuredBusinesses = zedInvestBusinesses.filter(business => business.isFeatured);
  res.json({
    success: true,
    data: { businesses: featuredBusinesses }
  });
});

app.get('/api/zedinvest/businesses/:id', (req, res) => {
  const business = zedInvestBusinesses.find(b => b.id === req.params.id);
  
  if (!business) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'BUSINESS_001',
        message: 'Business not found'
      }
    });
  }

  res.json({
    success: true,
    data: { business }
  });
});

// Bids routes
app.get('/api/bids/info', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      bids: req.user.bids,
      premiumPlan: req.user.premiumPlan,
      packages: [
        { id: 'basic', name: 'Basic Package', bids: 100, price: 20, currency: 'ZMW' },
        { id: 'premium', name: 'Premium Package', bids: 250, price: 45, currency: 'ZMW' },
        { id: 'pro', name: 'Pro Package', bids: 500, price: 80, currency: 'ZMW' }
      ]
    }
  });
});

// Referrals routes
app.get('/api/referrals/code', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      referralCode: req.user.referralCode,
      referralLink: `https://zedhustle.com/register?ref=${req.user.referralCode}`,
      stats: {
        totalReferrals: req.user.referrals.length,
        totalEarnings: req.user.referrals.length * 5,
        pendingReferrals: req.user.referrals.filter(r => r.status === 'pending').length
      }
    }
  });
});

// Messages routes
app.get('/api/messages/notifications', authenticateToken, (req, res) => {
  const notifications = [
    {
      id: '1',
      type: 'notification',
      subject: 'Welcome to ZedHustle!',
      content: 'Thank you for joining our platform. Start exploring jobs, trading, and investment opportunities.',
      status: 'unread',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'notification',
      subject: 'Job Application Update',
      content: 'Your application for "Web Developer Needed" has been viewed by the employer.',
      status: 'read',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  res.json({
    success: true,
    data: { notifications }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ZedHustle API with Firebase 🚀",
    documentation: "/api/docs",
    health: "/api/health",
    testMode: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ZedHustle API running on port ${PORT}`);
  console.log(`📊 Test Mode: Using in-memory data storage`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend should run on: http://localhost:5173`);
}); 