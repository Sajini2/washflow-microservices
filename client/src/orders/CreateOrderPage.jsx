import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../auth/AuthContext';

const CreateOrderPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected service passed via navigate state from ServicesPage or default
  const initialService = location.state?.service || {
    id: 'srv-001',
    name: 'Standard Wash & Fold',
  };

  const [serviceId, setServiceId] = useState(initialService.id);
  const [serviceName, setServiceName] = useState(initialService.name);
  const [weightKg, setWeightKg] = useState('3.5');
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user || !user.id) {
      setError('You must be logged in to place an order.');
      return;
    }

    if (!serviceId || !serviceName || !weightKg || !pickupDate || !address) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosClient.post('/orders', {
        serviceId,
        serviceName,
        weightKg: parseFloat(weightKg),
        pickupDate,
        address,
        userId: user.id,
      });

      // On success, navigate to order tracking page
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to create order. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>🧺 Schedule Laundry Pickup</h2>
        </div>
        <p className="auth-subtitle">
          Fill in your order details to schedule a pickup.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Standard Wash & Fold"
              required
            />
          </div>

          <div className="form-group">
            <label>Service ID</label>
            <input
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              placeholder="e.g. srv-001"
              required
            />
          </div>

          <div className="form-group">
            <label>Estimated Weight (Kg)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 3.5"
              required
            />
          </div>

          <div className="form-group">
            <label>Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Pickup Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Main Street, Colombo"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting Order...' : 'Submit Order'}
            </button>
            <Link to="/orders" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
