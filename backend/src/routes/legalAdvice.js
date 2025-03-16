import express from 'express';
import { body, validationResult } from 'express-validator';
import LegalAdvice from '../models/LegalAdvice.js';
import { auth, checkSubscription, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Create legal advice request
router.post('/',
  auth,
  checkSubscription,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isIn(['environmental', 'licensing', 'safety', 'labor', 'other']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const legalAdvice = new LegalAdvice({
        ...req.body,
        user: req.user._id
      });

      await legalAdvice.save();
      res.status(201).json(legalAdvice);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get all legal advice requests for user
router.get('/', auth, async (req, res) => {
  try {
    const legalAdvices = await LegalAdvice.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(legalAdvices);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific legal advice request
router.get('/:id', auth, async (req, res) => {
  try {
    const legalAdvice = await LegalAdvice.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('responses.responder', 'name email');

    if (!legalAdvice) {
      return res.status(404).json({ error: 'Legal advice request not found' });
    }

    res.json(legalAdvice);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add response to legal advice request (admin only)
router.post('/:id/responses',
  auth,
  checkRole(['admin']),
  [
    body('content').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const legalAdvice = await LegalAdvice.findById(req.params.id);
      if (!legalAdvice) {
        return res.status(404).json({ error: 'Legal advice request not found' });
      }

      legalAdvice.responses.push({
        responder: req.user._id,
        content: req.body.content,
        attachments: req.body.attachments || []
      });

      if (req.body.status) {
        legalAdvice.status = req.body.status;
      }

      await legalAdvice.save();
      res.json(legalAdvice);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update legal advice request
router.patch('/:id',
  auth,
  checkSubscription,
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'category', 'priority'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const legalAdvice = await LegalAdvice.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!legalAdvice) {
        return res.status(404).json({ error: 'Legal advice request not found' });
      }

      updates.forEach(update => legalAdvice[update] = req.body[update]);
      await legalAdvice.save();

      res.json(legalAdvice);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete legal advice request
router.delete('/:id', auth, async (req, res) => {
  try {
    const legalAdvice = await LegalAdvice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!legalAdvice) {
      return res.status(404).json({ error: 'Legal advice request not found' });
    }

    res.json({ message: 'Legal advice request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;