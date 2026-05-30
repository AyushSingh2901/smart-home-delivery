import express from 'express';
import { deactivateUser, getAdminPayments, getAdminProviders, getAnalytics, getUsers } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/providers', getAdminProviders);
router.get('/payments', getAdminPayments);
router.patch('/users/:id/deactivate', deactivateUser);

export default router;
