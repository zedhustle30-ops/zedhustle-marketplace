const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALID_001',
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    
    next();
  };
};

// User registration validation schema
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  phone: Joi.string().pattern(/^\+260[0-9]{9}$/).required().messages({
    'string.pattern.base': 'Please provide a valid Zambian phone number (+260XXXXXXXXX)',
    'any.required': 'Phone number is required'
  }),
  role: Joi.string().valid('user', 'employer', 'business_owner').default('user'),
  location: Joi.object({
    city: Joi.string().max(100),
    province: Joi.string().max(100)
  }).optional()
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Job posting validation schema
const jobSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Job title must be at least 5 characters long',
    'string.max': 'Job title cannot exceed 200 characters',
    'any.required': 'Job title is required'
  }),
  description: Joi.string().min(50).max(5000).required().messages({
    'string.min': 'Job description must be at least 50 characters long',
    'string.max': 'Job description cannot exceed 5000 characters',
    'any.required': 'Job description is required'
  }),
  company: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Company name must be at least 2 characters long',
    'string.max': 'Company name cannot exceed 200 characters',
    'any.required': 'Company name is required'
  }),
  location: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Location must be at least 2 characters long',
    'string.max': 'Location cannot exceed 200 characters',
    'any.required': 'Location is required'
  }),
  type: Joi.string().valid('full-time', 'part-time', 'freelance', 'contract', 'internship').required().messages({
    'any.only': 'Job type must be one of: full-time, part-time, freelance, contract, internship',
    'any.required': 'Job type is required'
  }),
  category: Joi.string().valid('technology', 'finance', 'marketing', 'education', 'healthcare', 'agriculture', 'mining', 'tourism', 'other').required(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(Joi.ref('min')).required(),
    currency: Joi.string().default('ZMW'),
    period: Joi.string().valid('hourly', 'daily', 'weekly', 'monthly', 'yearly').default('monthly')
  }).required(),
  requirements: Joi.array().items(Joi.string().max(500)).max(20),
  benefits: Joi.array().items(Joi.string().max(500)).max(20),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+260[0-9]{9}$/),
    whatsapp: Joi.string().pattern(/^\+260[0-9]{9}$/)
  }).required(),
  deadline: Joi.date().greater('now').required().messages({
    'date.greater': 'Application deadline must be in the future',
    'any.required': 'Application deadline is required'
  })
});

// Investment opportunity validation schema
const investmentSchema = Joi.object({
  businessName: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(100).max(5000).required(),
  category: Joi.string().valid('agriculture', 'technology', 'manufacturing', 'retail', 'services', 'mining', 'tourism', 'other').required(),
  location: Joi.object({
    city: Joi.string().max(100).required(),
    province: Joi.string().max(100).required(),
    address: Joi.string().max(500)
  }).required(),
  funding: Joi.object({
    goal: Joi.number().min(1000).max(10000000).required(),
    minimum: Joi.number().min(100).max(Joi.ref('goal')).required(),
    currency: Joi.string().default('ZMW')
  }).required(),
  returns: Joi.object({
    expected: Joi.number().min(0).max(100).required(),
    timeline: Joi.string().required(),
    type: Joi.string().valid('fixed', 'variable', 'equity').default('fixed')
  }).required(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').required(),
  deadline: Joi.date().greater('now').required()
});

// Trading validation schema
const tradeSchema = Joi.object({
  portfolioId: Joi.string().required(),
  symbol: Joi.string().required(),
  type: Joi.string().valid('buy', 'sell').required(),
  quantity: Joi.number().min(0.01).required(),
  orderType: Joi.string().valid('market', 'limit').default('market'),
  limitPrice: Joi.when('orderType', {
    is: 'limit',
    then: Joi.number().min(0).required(),
    otherwise: Joi.optional()
  }),
  stopLoss: Joi.number().min(0).optional(),
  takeProfit: Joi.number().min(0).optional()
});

// Password reset validation schema
const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'New password is required'
  })
});

// Profile update validation schema
const profileUpdateSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^\+260[0-9]{9}$/),
    location: Joi.object({
      city: Joi.string().max(100),
      province: Joi.string().max(100)
    }),
    dateOfBirth: Joi.date().max('now')
  }),
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean()
    }),
    language: Joi.string().valid('en', 'ny', 'bem'),
    theme: Joi.string().valid('light', 'dark'),
    currency: Joi.string().valid('ZMW', 'USD')
  })
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  jobSchema,
  investmentSchema,
  tradeSchema,
  passwordResetSchema,
  profileUpdateSchema
};