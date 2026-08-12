import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, ArrowRight, User, Lock, Mail } from 'lucide-react';
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

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { level: 0, label: '', color: 'transparent' };
    if (pwd.length < 6) return { level: 1, label: 'Weak', color: 'var(--danger)' };
    if (pwd.length < 10) return { level: 2, label: 'Fair', color: 'var(--warning)' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return { level: 4, label: 'Strong', color: 'var(--success)' };
    return { level: 3, label: 'Good', color: 'var(--accent)' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="public-container">
      {/* Animated Mesh Background */}
      <div className="auth-mesh-bg">
        <div className="mesh-orb mesh-orb-1"></div>
        <div className="mesh-orb mesh-orb-2"></div>
        <div className="mesh-orb mesh-orb-3"></div>
      </div>

      <div className="auth-card-container" style={{ maxWidth: '440px' }}>
        <div className="auth-card-shimmer">
          <div className="auth-card" style={{ padding: '2.25rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="auth-brand-icon">
                <Droplets size={28} />
              </div>
              <h2>Join WashFlow</h2>
              <p className="auth-subtitle">Create your account to schedule laundry orders</p>
            </div>

            {serverError && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{serverError}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="name" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--text-muted)" />
                  <span>Full Name</span>
                </label>
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
                <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--text-muted)" />
                  <span>Email Address</span>
                </label>
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
                <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--text-muted)" />
                  <span>Password</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'var(--surface-raised)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(strength.level / 4) * 100}%`,
                        height: '100%',
                        borderRadius: '2px',
                        background: strength.color,
                        transition: 'width 0.3s ease, background 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: strength.color, fontWeight: 600, minWidth: '40px' }}>
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--text-muted)" />
                  <span>Confirm Password</span>
                </label>
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

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.5rem' }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-footer" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
