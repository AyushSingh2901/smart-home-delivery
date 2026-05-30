import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:bookingId', protect, getMessages);
router.post('/:bookingId', protect, sendMessage);

export default router;

