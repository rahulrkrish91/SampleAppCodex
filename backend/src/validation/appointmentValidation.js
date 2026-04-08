import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  doctorId: Joi.number().integer().positive().required(),
  clinicId: Joi.number().integer().positive().required(),
  treatmentId: Joi.number().integer().positive().required(),
  appointmentTime: Joi.date().iso().required(),
});

export const virtualConsultationSchema = Joi.object({
  appointmentId: Joi.number().integer().positive().required(),
  patientNotes: Joi.string().max(2000).allow('', null),
});
