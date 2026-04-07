import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ClinicDashboardPage from './pages/ClinicDashboardPage';
import { useAuth } from './context/AuthContext';
import M3Button from './components/M3Button';
import SlideInContainer from './components/SlideInContainer';

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
    <SlideInContainer className="mx-auto min-h-screen max-w-5xl px-6 py-8">
      <nav className="mb-8 flex flex-wrap items-center gap-3">
        <Link to="/register"><M3Button variant="outlined">Register</M3Button></Link>
        <Link to="/login"><M3Button variant="outlined">Login</M3Button></Link>
        {user && (
          <>
            <Link to="/dashboard"><M3Button>Dashboard</M3Button></Link>
            <M3Button variant="outlined" onClick={logout}>Logout</M3Button>
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
    </SlideInContainer>
  );
}
