import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ToastProvider } from './components/Toast';
import { FeedbackProvider } from './feedback/FeedbackContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ProfilePage from './auth/ProfilePage';
import ServicesPage from './services/ServicesPage';
import CreateOrderPage from './orders/CreateOrderPage';
import OrdersListPage from './orders/OrdersListPage';
import OrderTrackingPage from './orders/OrderTrackingPage';
import RateOrderPage from './feedback/RateOrderPage';
import ReviewsPage from './reviews/ReviewsPage';
import './App.css';

// Home route redirect component
const HomeRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="public-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="spinner"></span>
          <span>Loading WashFlow...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/services" replace /> : <Navigate to="/login" replace />;
};

// Layout Container Shell
const LayoutShell = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <FeedbackProvider>
          <Router>
            <LayoutShell>
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute>
                      <ServicesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/new"
                  element={
                    <ProtectedRoute>
                      <CreateOrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId/feedback"
                  element={
                    <ProtectedRoute>
                      <RateOrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute>
                      <ReviewsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LayoutShell>
          </Router>
        </FeedbackProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
