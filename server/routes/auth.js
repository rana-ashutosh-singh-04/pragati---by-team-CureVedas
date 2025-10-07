const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();

// Mock user database (in production, use MongoDB)
const users = [
  {
    id: 1,
    email: 'admin@adarshgram.gov.in',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
    role: 'admin',
    district: 'All Districts',
    state: 'All States'
  },
  {
    id: 2,
    email: 'officer@district1.gov.in',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'District Officer',
    role: 'district_officer',
    district: 'District 1',
    state: 'State 1'
  },
  {
    id: 3,
    email: 'admin2@adarshgram.gov.in',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // adminpass123
    name: 'New Administrator',
    role: 'admin',
    district: 'All Districts',
    state: 'All States'
  }
];

// OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Mock email transporter (configure with real SMTP in production)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        district: user.district,
        state: user.state
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          district: user.district,
          state: user.state
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'district_officer', district, state } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      district: district || 'Default District',
      state: state || 'Default State'
    };

    // Add to users array (in production, save to database)
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        district: newUser.district,
        state: newUser.state
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          district: newUser.district,
          state: newUser.state
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /api/auth/send-otp - Send OTP for password reset
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStorage.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    // Send OTP email (mock implementation)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@adarshgram.gov.in',
        to: email,
        subject: 'AdarshGramGapFinder - Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d5a27;">AdarshGramGapFinder</h2>
            <p>Hello ${user.name},</p>
            <p>Your OTP for password reset is:</p>
            <div style="background-color: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1e40af; margin: 0; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated message from AdarshGramGapFinder system.
            </p>
          </div>
        `
      });

      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          email,
          expiresIn: 300 // 5 minutes in seconds
        }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // In development, return OTP directly
      if (process.env.NODE_ENV === 'development') {
        res.json({
          success: true,
          message: 'OTP generated (development mode)',
          data: {
            email,
            otp, // Only in development
            expiresIn: 300
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send OTP email'
        });
      }
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
});

// POST /api/auth/verify-otp - Verify OTP and reset password
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    // Check if OTP exists and is valid
    const storedOtp = otpStorage.get(email);
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (storedOtp.expires < Date.now()) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Find user and update password
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;

    // Remove used OTP
    otpStorage.delete(email);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        district: user.district,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = router;



