import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import M3Button from '../components/M3Button';
import M3Card from '../components/M3Card';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <M3Card className="mx-auto max-w-xl">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input placeholder="Full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })} defaultValue="patient">
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="clinic">Clinic</option>
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <M3Button type="submit">Create account</M3Button>
      </form>
      <p className="mt-3">Already have an account? <Link className="text-m3Primary" to="/login">Login</Link></p>
    </M3Card>
  );
}
