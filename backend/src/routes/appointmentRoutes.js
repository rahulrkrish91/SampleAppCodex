import { Router } from 'express';
import {
  clinicDashboard,
  doctorDashboard,
  patientDashboard,
  scheduleAppointment,
  virtualConsultationRequest,
} from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createAppointmentSchema, virtualConsultationSchema } from '../validation/appointmentValidation.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('patient', 'clinic'), validate(createAppointmentSchema), scheduleAppointment);
router.get('/patient/:patientId', authorize('patient', 'doctor', 'clinic'), patientDashboard);
router.get('/doctor/me', authorize('doctor'), doctorDashboard);
router.get('/clinic/me', authorize('clinic'), clinicDashboard);
router.post('/virtual-consultation', authorize('patient'), validate(virtualConsultationSchema), virtualConsultationRequest);

export default router;
