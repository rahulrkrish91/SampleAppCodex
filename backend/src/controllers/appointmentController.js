import {
  createAppointment,
  getPatientAppointments,
  requestVirtualConsultation,
} from '../services/appointmentService.js';

export async function scheduleAppointment(req, res) {
  try {
    const appointment = await createAppointment(req.body);
    return res.status(201).json({ message: 'Appointment scheduled.', appointment });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function patientDashboard(req, res) {
  try {
    const patientId = Number(req.params.patientId || req.user.id);
    const appointments = await getPatientAppointments(patientId);
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function virtualConsultationRequest(req, res) {
  try {
    const result = await requestVirtualConsultation(req.body);
    return res.status(200).json({ message: 'Virtual consultation requested.', ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
