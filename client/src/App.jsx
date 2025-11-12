import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Layouts and Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Participant Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Admin Dashboard
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// A custom component to protect routes
const ProtectedRoute = ({ children, role }) => {
  // 1. Get the new context variables
  const { isLoggedIn, user } = useAppContext();

  // 2. Check if the app is still fetching the user
  // (This 'user' object comes from the /api/auth/profile call in your context)
  if (user === null) {
    // We are still loading, so wait.
    // You can show a loading spinner here.
    return <div className="text-center p-10">Loading...</div>;
  }
  
  // 3. Check if logged in (now 'user' is loaded or still null)
  if (!isLoggedIn) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // 4. Check if the role is correct (using 'user.role')
  if (role && user.role !== role) {
    // If logged in but wrong role, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // If logged in and correct role (or no role specified), show the page
  return children;
};

export default function App() {
  const { modal, closeModal }= useAppContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Modal message={modal.message} type={modal.type} onClose={closeModal} />
      <Navbar />
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Participant Protected Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute role="user">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Protected Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route (redirects to home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}