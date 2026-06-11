import Joi from 'joi';

export const createTreatmentSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  rate: Joi.number().precision(2).min(0).allow(null),
});

export const updateTreatmentSchema = Joi.object({
  name: Joi.string().min(2).max(150),
  rate: Joi.number().precision(2).min(0).allow(null),
  active: Joi.boolean(),
}).min(1);
