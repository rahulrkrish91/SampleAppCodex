import { Router } from 'express';
import {
  addTreatment,
  deleteTreatment,
  editTreatment,
  getActiveTreatments,
  getAllTreatments,
} from '../controllers/treatmentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createTreatmentSchema, updateTreatmentSchema } from '../validation/treatmentValidation.js';

const router = Router();

router.get('/', authenticate, getActiveTreatments);
router.get('/admin', authenticate, authorize('clinic'), getAllTreatments);
router.post('/', authenticate, authorize('clinic'), validate(createTreatmentSchema), addTreatment);
router.put('/:treatmentId', authenticate, authorize('clinic'), validate(updateTreatmentSchema), editTreatment);
router.delete('/:treatmentId', authenticate, authorize('clinic'), deleteTreatment);

export default router;
