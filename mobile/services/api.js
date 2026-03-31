import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function refreshWithToken(refreshToken) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  setToken(data.accessToken);
  return data;
}

export default api;
