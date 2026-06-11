import asyncHandler from '../middleware/asyncHandler.js';
import { getUsersByRole } from '../services/userService.js';

export const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await getUsersByRole('doctor');
  res.status(200).json({ doctors });
});

export const listClinics = asyncHandler(async (req, res) => {
  const clinics = await getUsersByRole('clinic');
  res.status(200).json({ clinics });
});
