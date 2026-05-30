import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getBookings).post(authorize('customer'), createBooking);
router.patch('/:id/status', authorize('provider', 'admin'), updateBookingStatus);

export default router;

