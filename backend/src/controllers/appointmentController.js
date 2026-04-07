import asyncHandler from '../middleware/asyncHandler.js';
import {
  createAppointment,
  getClinicAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  getPatientPrescriptions,
  requestVirtualConsultation,
} from '../services/appointmentService.js';

export const scheduleAppointment = asyncHandler(async (req, res) => {
  const appointment = await createAppointment(req.body);
  res.status(201).json({ message: 'Appointment scheduled.', appointment });
});

export const patientDashboard = asyncHandler(async (req, res) => {
  const requestedId = Number(req.params.patientId || req.user.id);
  if (req.user.role === 'patient' && req.user.id !== requestedId) {
    return res.status(403).json({ message: 'Patients can only view their own dashboard.' });
  }

  const [appointments, prescriptions] = await Promise.all([
    getPatientAppointments(requestedId),
    getPatientPrescriptions(requestedId),
  ]);

  return res.status(200).json({ appointments, prescriptions });
});

export const doctorDashboard = asyncHandler(async (req, res) => {
  const appointments = await getDoctorAppointments(req.user.id);
  res.status(200).json({ appointments });
});

export const clinicDashboard = asyncHandler(async (req, res) => {
  const appointments = await getClinicAppointments(req.user.id);
  res.status(200).json({ appointments });
});

export const virtualConsultationRequest = asyncHandler(async (req, res) => {
  const result = await requestVirtualConsultation(req.body, req.user.id);
  res.status(200).json({ message: 'Virtual consultation requested.', ...result });
});
