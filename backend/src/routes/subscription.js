import express from 'express';
import Razorpay from 'razorpay';
import { auth } from '../middleware/auth.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 999,
      duration: 30,
      features: [
        'Access to Mining Plan Templates',
        'Basic Legal Document Access',
        'Email Support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 2999,
      duration: 30,
      features: [
        'All Basic Plan Features',
        'Priority Support',
        'Advanced Mining Tools',
        'Unlimited Document Access',
        'Expert Consultation'
      ]
    }
  ];
  res.json(plans);
});

// Create order for subscription
router.post('/create-order', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const options = {
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment and update subscription
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, planId } = req.body;
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create new subscription
    const subscription = new Subscription({
      user: req.user.id,
      plan: planId,
      amount: plan.price,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000)
    });

    await subscription.save();

    // Update user's subscription status
    await User.findByIdAndUpdate(req.user.id, {
      'subscription.type': planId,
      'subscription.startDate': subscription.startDate,
      'subscription.endDate': subscription.endDate,
      'subscription.status': 'active'
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;