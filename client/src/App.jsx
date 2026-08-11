import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ProfilePage from './auth/ProfilePage';
import ServicesPage from './services/ServicesPage';
import CreateOrderPage from './orders/CreateOrderPage';
import OrdersListPage from './orders/OrdersListPage';
import OrderTrackingPage from './orders/OrderTrackingPage';
import './App.css';

// Home route redirect component
const HomeRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/orders" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
