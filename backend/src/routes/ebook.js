import express from 'express';
import { body, validationResult } from 'express-validator';
import Ebook from '../models/Ebook.js';
import { auth, checkSubscription } from '../middleware/auth.js';

const router = express.Router();

// Get all ebooks (filtered by access level)
router.get('/', auth, async (req, res) => {
  try {
    const query = {};
    if (req.user.subscription.type === 'free') {
      query.accessLevel = 'free';
    } else if (req.user.subscription.type === 'basic') {
      query.accessLevel = { $in: ['free', 'basic'] };
    }

    const ebooks = await Ebook.find(query)
      .select('-downloads')
      .sort({ publishDate: -1 });
    res.json(ebooks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific ebook
router.get('/:id', auth, async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ error: 'E-book not found' });
    }

    // Check access level
    if (ebook.accessLevel === 'premium' && req.user.subscription.type !== 'premium') {
      return res.status(403).json({ error: 'Premium subscription required' });
    }
    if (ebook.accessLevel === 'basic' && req.user.subscription.type === 'free') {
      return res.status(403).json({ error: 'Basic subscription required' });
    }

    res.json(ebook);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Download ebook
router.post('/:id/download', auth, async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ error: 'E-book not found' });
    }

    // Check access level
    if (ebook.accessLevel === 'premium' && req.user.subscription.type !== 'premium') {
      return res.status(403).json({ error: 'Premium subscription required' });
    }
    if (ebook.accessLevel === 'basic' && req.user.subscription.type === 'free') {
      return res.status(403).json({ error: 'Basic subscription required' });
    }

    // Record download
    ebook.downloads.push({
      user: req.user._id,
      downloadDate: new Date()
    });
    await ebook.save();

    res.json({ fileUrl: ebook.fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Rate and review ebook
router.post('/:id/rate',
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('review').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ebook = await Ebook.findById(req.params.id);
      if (!ebook) {
        return res.status(404).json({ error: 'E-book not found' });
      }

      // Remove existing rating if any
      const ratingIndex = ebook.ratings.findIndex(
        rating => rating.user.toString() === req.user._id.toString()
      );
      if (ratingIndex > -1) {
        ebook.ratings.splice(ratingIndex, 1);
      }

      // Add new rating
      ebook.ratings.push({
        user: req.user._id,
        rating: req.body.rating,
        review: req.body.review,
        date: new Date()
      });

      await ebook.save();
      res.json(ebook);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;