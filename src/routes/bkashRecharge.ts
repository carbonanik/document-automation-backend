import express from 'express';
import {
  createBkashRecharge,
  getAllBkashRecharges,
  getBkashRechargeById,
  updateBkashRecharge,
  deleteBkashRecharge,
  updateBkashRechargeStatus,
} from '../controllers/bkashRecharge';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = express.Router();

router.post('/', createBkashRecharge);
router.get('/', isAdmin,  getAllBkashRecharges);
router.get('/:id', isAdmin, getBkashRechargeById);
router.put('/:id', isAdmin, updateBkashRecharge);
router.delete('/:id', isAdmin, deleteBkashRecharge);
router.patch('/:id/status', isAdmin, updateBkashRechargeStatus);

export default router; 