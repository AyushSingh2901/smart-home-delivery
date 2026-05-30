import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/order', protect, authorize('customer'), createPaymentOrder);
router.post('/verify', protect, authorize('customer'), verifyPayment);

export default router;

