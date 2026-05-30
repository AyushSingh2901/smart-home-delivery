import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(40);
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
});

export default router;

