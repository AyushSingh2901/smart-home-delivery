import express from 'express';
import { getProviders, updateProviderProfile, verifyProvider } from '../controllers/providerController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProviders);
router.patch('/me', protect, authorize('provider'), updateProviderProfile);
router.patch('/:id/verify', protect, authorize('admin'), verifyProvider);

export default router;

