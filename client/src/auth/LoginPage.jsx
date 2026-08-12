import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      showToast('Welcome back to WashFlow!', 'success');
      navigate('/services');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setServerError('Invalid email or password.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Failed to connect to authentication server. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-container">
      {/* Animated Mesh Background */}
      <div className="auth-mesh-bg">
        <div className="mesh-orb mesh-orb-1"></div>
        <div className="mesh-orb mesh-orb-2"></div>
        <div className="mesh-orb mesh-orb-3"></div>
      </div>

      <div className="auth-card-container">
        <div className="auth-card-shimmer">
          <div className="auth-card">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div className="auth-brand-icon">
                <Droplets size={28} />
              </div>
              <h2>Welcome Back</h2>
              <p className="auth-subtitle">Sign in to continue to your dashboard</p>
            </div>

            {serverError && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{serverError}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--text-muted)" />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane.doe@washflow.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--text-muted)" />
                  <span>Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.5rem' }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-footer" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
