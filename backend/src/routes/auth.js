import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Register user
router.post('/register',
  [
    body('email')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject('Email already registered');
          }
        });
      }),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
          }))
        });
      }

      const { email, password, name } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        name,
        role: 'user',
        subscription: {
          type: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
        }
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            subscription: user.subscription
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', {
        name: error.name,
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      if (error.name === 'MongoServerError') {
        if (error.code === 11000) {
          return res.status(400).json({
            status: 'error',
            error: 'Email already exists'
          });
        }
        return res.status(500).json({
          status: 'error',
          error: 'Database error. Please try again later.'
        });
      } else if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          error: error.message
        });
      } else if (error.name === 'MongooseError') {
        return res.status(500).json({
          status: 'error',
          error: 'Database connection error. Please try again later.'
        });
      }
      
      res.status(500).json({
        status: 'error',
        error: 'Failed to register user. Please try again later.'
      })
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription
        }
      });
    } catch (error) {
      console.error('Registration error:', {
        name: error.name,
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      if (error.name === 'MongoServerError') {
        if (error.code === 11000) {
          return res.status(400).json({
            status: 'error',
            error: 'Email already exists'
          });
        }
        return res.status(500).json({
          status: 'error',
          error: 'Database error. Please try again later.'
        });
      } else if (error.name === 'ValidationError') {
        return res.status(400).json({
          status: 'error',
          error: error.message
        });
      } else if (error.name === 'MongooseError') {
        return res.status(500).json({
          status: 'error',
          error: 'Database connection error. Please try again later.'
        });
      }
      
      res.status(500).json({
        status: 'error',
        error: 'Failed to register user. Please try again later.'
      })
    }
  }
);

export default router;