import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { DashboardLayout } from './components/Layout';
import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import ReportItem from './pages/ReportItem';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';
import Team from './pages/Team';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageItems from './pages/ManageItems';
import PendingReports from './pages/PendingReports';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'student' | 'admin' }> = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/report-lost" element={<ProtectedRoute><ReportItem type="lost" /></ProtectedRoute>} />
          <Route path="/report-found" element={<ProtectedRoute><ReportItem type="found" /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseItems /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/items" element={<ProtectedRoute role="admin"><ManageItems /></ProtectedRoute>} />
          <Route path="/admin/pending" element={<ProtectedRoute role="admin"><PendingReports /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
