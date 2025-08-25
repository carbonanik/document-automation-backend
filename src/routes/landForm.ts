import express from 'express';
import {
  createLandForm,
  getLandFormById,
  getLandFormByUserId,
  updateLandForm,
  deleteLandForm,
  getAllLandForms,
  payAndCreateForm,
  payAndUpdateLandForm,
} from '../controllers/landForm';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticate, createLandForm);
router.get('/', authenticate, getAllLandForms);
//
router.post('/with-pay', authenticate, payAndCreateForm);
// get by the user take id from auth token 
router.get('/user', authenticate, getLandFormByUserId);
router.get('/:id', getLandFormById);
router.put('/:id', authenticate, updateLandForm);
router.put('/with-pay/:id', authenticate, payAndUpdateLandForm);
router.delete('/:id', authenticate, deleteLandForm);

export default router;
