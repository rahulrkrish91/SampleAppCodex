import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db.js';
import { AppError } from '../middleware/errorMiddleware.js';

const validRoles = ['patient', 'doctor', 'clinic'];
const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: accessTokenExpiry }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user.id, tokenType: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    { expiresIn: refreshTokenExpiry }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function persistRefreshToken(userId, refreshToken) {
  const tokenHash = hashToken(refreshToken);
  await pool.query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))', [
    userId,
    tokenHash,
  ]);
}

export async function registerUser({ name, email, password, role }) {
  if (!validRoles.includes(role)) {
    throw new AppError('Invalid role provided. Use patient, doctor or clinic.', 400);
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('User already exists with this email.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );

  return { id: result.insertId, name, email, role };
}

export async function loginUser({ email, password }) {
  const [rows] = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    throw new AppError('Invalid email or password.', 401);
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new AppError('Invalid email or password.', 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await persistRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token required.', 401);
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret');
  } catch (error) {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const tokenHash = hashToken(refreshToken);
  const [tokens] = await pool.query(
    'SELECT id, revoked_at, expires_at FROM refresh_tokens WHERE user_id = ? AND token_hash = ? LIMIT 1',
    [payload.id, tokenHash]
  );

  if (tokens.length === 0 || tokens[0].revoked_at || new Date(tokens[0].expires_at) <= new Date()) {
    throw new AppError('Refresh token is revoked or expired.', 401);
  }

  const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [payload.id]);
  if (users.length === 0) {
    throw new AppError('User account not found.', 404);
  }

  return {
    accessToken: signAccessToken(users[0]),
    user: users[0],
  };
}

export async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [tokenHash]);
}
