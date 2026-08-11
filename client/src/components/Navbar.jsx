import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🧺</span> WashFlow
        </Link>

        {/* TEAMMATE FEATURE PLACEHOLDER: Future Services and Orders links will go here */}
        {/*
        <div className="navbar-nav-links">
          <Link to="/services">Services</Link>
          <Link to="/orders">Orders</Link>
        </div>
        */}

        <div className="navbar-user-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="user-name">
                👤 {user?.name || user?.email}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
