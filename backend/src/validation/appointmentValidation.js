import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  patientId: Joi.number().integer().positive().required(),
  doctorId: Joi.number().integer().positive().required(),
  clinicId: Joi.number().integer().positive().required(),
  appointmentTime: Joi.date().iso().required(),
  reason: Joi.string().max(1000).allow('', null),
});

export const virtualConsultationSchema = Joi.object({
  appointmentId: Joi.number().integer().positive().required(),
  patientNotes: Joi.string().max(2000).allow('', null),
});
