import express from 'express';
import { body, validationResult } from 'express-validator';
import MiningPlan from '../models/MiningPlan.js';
import { auth, checkSubscription } from '../middleware/auth.js';

const router = express.Router();

// Create mining plan
router.post('/',
  auth,
  checkSubscription,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('mineType').isIn(['opencast', 'underground', 'hybrid']),
    body('mineralType').trim().notEmpty(),
    body('estimatedProduction.value').isNumeric(),
    body('estimatedProduction.unit').isIn(['tons', 'kg']),
    body('timeline.startDate').isISO8601(),
    body('timeline.endDate').isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const miningPlan = new MiningPlan({
        ...req.body,
        user: req.user._id
      });

      await miningPlan.save();
      res.status(201).json(miningPlan);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get all mining plans for user
router.get('/', auth, async (req, res) => {
  try {
    const miningPlans = await MiningPlan.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(miningPlans);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific mining plan
router.get('/:id', auth, async (req, res) => {
  try {
    const miningPlan = await MiningPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!miningPlan) {
      return res.status(404).json({ error: 'Mining plan not found' });
    }

    res.json(miningPlan);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update mining plan
router.patch('/:id',
  auth,
  checkSubscription,
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'location', 'mineType',
        'mineralType', 'estimatedProduction', 'timeline', 'status'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const miningPlan = await MiningPlan.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!miningPlan) {
        return res.status(404).json({ error: 'Mining plan not found' });
      }

      updates.forEach(update => miningPlan[update] = req.body[update]);
      await miningPlan.save();

      res.json(miningPlan);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete mining plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const miningPlan = await MiningPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!miningPlan) {
      return res.status(404).json({ error: 'Mining plan not found' });
    }

    res.json({ message: 'Mining plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;