import { Router } from 'express';
import {
  patientDashboard,
  scheduleAppointment,
  virtualConsultationRequest,
} from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('patient', 'clinic'), scheduleAppointment);
router.get('/patient/:patientId', authorize('patient', 'doctor', 'clinic'), patientDashboard);
router.post('/virtual-consultation', authorize('patient'), virtualConsultationRequest);

export default router;
