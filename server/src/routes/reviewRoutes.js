import express from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderReviews);
router.post('/', protect, authorize('customer'), createReview);

export default router;

