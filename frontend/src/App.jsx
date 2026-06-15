import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';
import UpdateProfile from './pages/UpdateProfile';
import AdminDashboard from './pages/AdminDashboard';
import CustomerList from './pages/CustomerList';
import CustomerUpdate from './pages/CustomerUpdate';

// Helper component to redirect root URL depending on authentication state
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/customer/dashboard" replace />
  );
};

const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          {/* Root & Public Routes */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Customer Secure Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile/update"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Secure Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers/update/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerUpdate />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
