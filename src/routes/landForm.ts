import express from 'express';
import {
  createLandForm,
  getLandFormById,
  updateLandForm,
  deleteLandForm,
  getAllLandForms,
} from '../controllers/landForm';

const router = express.Router();

router.post('/', createLandForm);
router.get('/', getAllLandForms);
router.get('/:id', getLandFormById);
router.put('/:id', updateLandForm);
router.delete('/:id', deleteLandForm);

export default router;
