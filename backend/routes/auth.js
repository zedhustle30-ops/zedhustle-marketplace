const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, generateRefreshToken, authenticateToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, passwordResetSchema } = require('../middleware/validation');

const router = express.Router();

// Register new user
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_002',
          message: 'Email already exists'
        }
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      profile: {
        firstName,
        lastName,
        phone,
        location: location || {}
      },
      role: role || 'user'
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token,
        refreshToken
      },
      message: 'User registered successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Invalid credentials'
        }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Invalid credentials'
        }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
        refreshToken
      },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Refresh token required'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_001',
          message: 'User not found or inactive'
        }
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      },
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Refresh token expired'
        }
      });
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_001',
        message: 'Invalid refresh token'
      }
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('tradingAccount.portfolios', 'name totalValue totalReturn')
      .populate('wallet.transactions', 'type amount status createdAt', null, { limit: 10, sort: { createdAt: -1 } });

    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { profile, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_001',
          message: 'User not found'
        }
      });
    }

    // Update profile fields
    if (profile) {
      Object.keys(profile).forEach(key => {
        if (profile[key] !== undefined) {
          user.profile[key] = profile[key];
        }
      });
    }

    // Update preferences
    if (preferences) {
      Object.keys(preferences).forEach(key => {
        if (preferences[key] !== undefined) {
          user.preferences[key] = preferences[key];
        }
      });
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
        timestamp: new Date().toISOString()
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // For now, we'll just return the token (in production, this should be sent via email)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      // Remove this in production
      data: { resetToken },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Reset password
router.post('/reset-password', validate(passwordResetSchema), async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Invalid reset token'
        }
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_001',
          message: 'User not found or inactive'
        }
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Reset token expired'
        }
      });
    }

    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might maintain a blacklist of tokens
    // For now, we'll just return success and let the client handle token removal
    
    res.json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_001',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;