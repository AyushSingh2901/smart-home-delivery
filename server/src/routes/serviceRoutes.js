import express from 'express';
import { createService, getServices } from '../controllers/serviceController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, authorize('admin'), createService);

export default router;

