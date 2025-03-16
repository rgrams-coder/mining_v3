import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.subscription || user.subscription.status !== 'active') {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    if (new Date(user.subscription.endDate) < new Date()) {
      user.subscription.status = 'expired';
      await user.save();
      return res.status(403).json({ error: 'Subscription expired' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};