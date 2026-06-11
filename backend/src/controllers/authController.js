import asyncHandler from '../middleware/asyncHandler.js';
import { loginUser, refreshAccessToken, registerUser, revokeRefreshToken } from '../services/authService.js';

const isProd = process.env.NODE_ENV === 'production';

function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ message: 'Registration successful.', user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await refreshAccessToken(token);
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  await revokeRefreshToken(token);
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully.' });
});
