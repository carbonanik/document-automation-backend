import express from 'express';
import {
  createLandForm,
  getLandFormById,
  getLandFormByUserId,
  updateLandForm,
  deleteLandForm,
  getAllLandForms,
} from '../controllers/landForm';

const router = express.Router();

router.post('/', createLandForm);
router.get('/', getAllLandForms);

// get by the user take id from auth token 
router.get('/user', getLandFormByUserId);
router.get('/:id', getLandFormById);
router.put('/:id', updateLandForm);
router.delete('/:id', deleteLandForm);

export default router;
