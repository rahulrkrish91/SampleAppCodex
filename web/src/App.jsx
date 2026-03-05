import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ClinicDashboardPage from './pages/ClinicDashboardPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  if (user?.role === 'doctor') return <DoctorDashboardPage />;
  if (user?.role === 'clinic') return <ClinicDashboardPage />;
  return <DashboardPage />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        {user && (
          <>
            {' '}
            | <Link to="/dashboard">Dashboard</Link> | <button type="button" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </main>
  );
}
