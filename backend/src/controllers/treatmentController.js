import asyncHandler from '../middleware/asyncHandler.js';
import {
  createTreatment,
  listActiveTreatments,
  listAllTreatments,
  removeTreatment,
  updateTreatment,
} from '../services/treatmentService.js';

export const getActiveTreatments = asyncHandler(async (req, res) => {
  const treatments = await listActiveTreatments();
  res.status(200).json({ treatments });
});

export const getAllTreatments = asyncHandler(async (req, res) => {
  const treatments = await listAllTreatments();
  res.status(200).json({ treatments });
});

export const addTreatment = asyncHandler(async (req, res) => {
  const treatment = await createTreatment(req.body);
  res.status(201).json({ message: 'Treatment created.', treatment });
});

export const editTreatment = asyncHandler(async (req, res) => {
  const treatment = await updateTreatment(Number(req.params.treatmentId), req.body);
  res.status(200).json({ message: 'Treatment updated.', treatment });
});

export const deleteTreatment = asyncHandler(async (req, res) => {
  const result = await removeTreatment(Number(req.params.treatmentId));
  res.status(200).json({ message: 'Treatment removed.', ...result });
});
