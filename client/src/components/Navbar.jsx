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

        {isAuthenticated && (
          <div className="navbar-nav-links">
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/orders" className="nav-link">My Orders</Link>
          </div>
        )}

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
