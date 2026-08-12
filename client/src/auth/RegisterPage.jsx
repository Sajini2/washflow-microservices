import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      await register(formData.name, formData.email, formData.password);
      showToast('Account created successfully!', 'success');
      navigate('/services');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setServerError('This email is already registered.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Registration failed. Please try again.');
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
            <h2>Create an Account</h2>
            <p className="auth-subtitle">Sign up to schedule and track your laundry orders</p>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@washflow.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
