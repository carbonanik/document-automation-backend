import express from 'express';
import { getAppSetting, setAppSetting } from '../controllers/appSetting';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = express.Router();

// Public: Get setting by key
router.get('/:key', getAppSetting);

// Admin: Set setting by key
router.post('/:key', authenticate, isAdmin, setAppSetting);

export default router; 