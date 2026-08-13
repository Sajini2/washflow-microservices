import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Droplets, Shirt, Package, MessageSquare, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Services', path: '/services', icon: Shirt },
    { label: 'My Orders', path: '/orders', icon: Package },
    { label: 'Reviews', path: '/reviews', icon: MessageSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        {/* Left: WashFlow Brand Logo */}
        <NavLink to="/services" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <Droplets size={20} color="#ffffff" />
          </div>
          <span className="logo-wordmark">WashFlow</span>
        </NavLink>

        {/* Center: Desktop Nav Links */}
        <nav className="desktop-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/orders' && location.pathname.startsWith('/orders'));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`top-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: User Profile & Logout */}
        <div className="navbar-right-user">
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="user-display-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
          </div>

          <button onClick={handleLogout} className="btn-navbar-logout" title="Sign Out" aria-label="Sign Out">
            <LogOut size={18} />
          </button>

          {/* Mobile Hamburger */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Panel */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <nav className="mobile-panel-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === '/orders' && location.pathname.startsWith('/orders'));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`mobile-panel-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button onClick={handleLogout} className="mobile-panel-logout">
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
