import { Router } from 'express';
import { listClinics, listDoctors } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/doctors', authorize('patient', 'clinic', 'doctor'), listDoctors);
router.get('/clinics', authorize('patient', 'clinic', 'doctor'), listClinics);

export default router;
