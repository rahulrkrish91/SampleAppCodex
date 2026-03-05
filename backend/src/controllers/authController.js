import { loginUser, registerUser } from '../services/authService.js';

export async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({ message: 'Registration successful.', user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}
