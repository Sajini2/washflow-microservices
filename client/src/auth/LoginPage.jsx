import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, ArrowRight } from 'lucide-react';
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
      <div className="auth-card-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(79, 209, 197, 0.12)',
                border: '1px solid var(--border)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                marginBottom: '0.75rem',
              }}
            >
              <Droplets size={26} />
            </div>
            <h2>Sign In to WashFlow</h2>
            <p className="auth-subtitle">Enter your credentials to access your laundry dashboard</p>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
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
              <label htmlFor="password">Password</label>
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

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
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

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
