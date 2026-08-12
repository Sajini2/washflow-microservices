import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Wallet, Clock, ArrowRight, ShieldCheck, Shirt } from 'lucide-react';
import axiosClient from '../api/axiosClient';

import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'WALLET', label: 'Digital Wallet', icon: Wallet },
];

const CreateOrderPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initialService = location.state?.service || {
    id: 'srv-001',
    name: 'Standard Wash & Fold',
    price: 450.00,
  };

  const [serviceId] = useState(initialService.id);
  const [serviceName] = useState(initialService.name);
  const [unitPrice] = useState(initialService.price || 450.00);


  const [weightKg, setWeightKg] = useState('3.5');
  const [address, setAddress] = useState('');

  // Pickup fields
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('09:00'); // New field with local state

  // Payment Method card selection (New field)
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Delivery fields (New fields)
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Morning 8-12');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate delivery date is after pickup date
  const isDeliveryDateValid = useMemo(() => {
    if (!pickupDate || !deliveryDate) return true;
    return new Date(deliveryDate) > new Date(pickupDate);
  }, [pickupDate, deliveryDate]);

  // Calculate estimated total price
  const estimatedTotal = useMemo(() => {
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) return 0;
    return (weight * unitPrice).toFixed(2);
  }, [weightKg, unitPrice]);

  const validateForm = () => {
    const newErrors = {};

    if (!weightKg || parseFloat(weightKg) <= 0) {
      newErrors.weightKg = 'Please enter a valid weight in Kg.';
    }

    if (!address.trim()) {
      newErrors.address = 'Pickup address is required.';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required.';
    }

    if (!deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required.';
    } else if (!isDeliveryDateValid) {
      newErrors.deliveryDate = 'Delivery date must be after the pickup date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!user || !user.id) {
      setServerError('You must be logged in to place an order.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Submits existing payload shape to POST /orders via Gateway
      // New v2 local state fields (pickupTime, paymentMethod, deliveryDate, deliverySlot, deliveryNotes)
      // are retained for v2 client state and logging
      const response = await axiosClient.post('/orders', {
        serviceId,
        serviceName,
        weightKg: parseFloat(weightKg),
        pickupDate,
        address,
        userId: user.id,
      });

      showToast('Laundry order placed successfully!', 'success');
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to create order. Please check backend connection.';
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    weightKg &&
    parseFloat(weightKg) > 0 &&
    address.trim() &&
    pickupDate &&
    deliveryDate &&
    isDeliveryDateValid;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Schedule Laundry Pickup</h1>
        <p className="page-description">Fill in your pickup schedule, delivery details, and payment options</p>
      </div>

      {/* Selected Service Read-Only Summary Card */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(79, 209, 197, 0.15)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shirt size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Service</div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{serviceName}</h3>
          </div>
        </div>
        <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent)' }}>
          LKR {Number(unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })} / kg
        </div>
      </div>

      {serverError && <div className="alert alert-error">{serverError}</div>}

      <div className="create-order-layout">
        {/* Main Form Area */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Section 1: Order Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shirt size={18} color="var(--accent)" />
              <span>1. Order & Pickup Details</span>
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="weight">Estimated Laundry Weight (Kg)</label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={errors.weightKg ? 'input-error' : ''}
                />
                {errors.weightKg && <span className="field-error">{errors.weightKg}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Pickup Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="e.g. 123 Flower Road, Colombo 07"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="pickupDate">Pickup Date</label>
                  <input
                    id="pickupDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={errors.pickupDate ? 'input-error' : ''}
                  />
                  {errors.pickupDate && <span className="field-error">{errors.pickupDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pickupTime">Pickup Time Slot</label>
                  <input
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Selectable Cards */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--accent)" />
              <span>2. Payment Method</span>
            </h3>

            <div className="payment-methods-grid">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <div
                    key={method.id}
                    className={`payment-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <Icon size={24} className="payment-card-icon" />
                    <span className="payment-card-label">{method.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Delivery Details */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent)" />
              <span>3. Delivery Scheduling</span>
            </h3>

            <div className="form-grid">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="deliveryDate">Delivery Date</label>
                  <input
                    id="deliveryDate"
                    type="date"
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className={errors.deliveryDate ? 'input-error' : ''}
                  />
                  {errors.deliveryDate && <span className="field-error">{errors.deliveryDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="deliverySlot">Delivery Time Slot</label>
                  <select
                    id="deliverySlot"
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                  >
                    <option value="Morning 8-12">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="Afternoon 12-4">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening 4-8">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
                <textarea
                  id="deliveryNotes"
                  rows={2}
                  placeholder="Gate code, drop-off instructions, or delicate fabric notes..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Right Side Summary Panel */}
        <div className="sticky-summary">
          <h3 style={{ fontSize: '1.15rem', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div className="summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Service</span>
            <span style={{ fontWeight: 600 }}>{serviceName}</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Weight</span>
            <span className="font-mono">{weightKg} kg</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Pickup Date</span>
            <span className="font-mono">{pickupDate || 'Not set'}</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Delivery Date</span>
            <span className="font-mono">{deliveryDate || 'Not set'}</span>
          </div>

          <div className="summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Payment</span>
            <span className="badge badge-accent">
              {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod}
            </span>
          </div>

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span className="font-mono" style={{ color: 'var(--accent)' }}>
              LKR {Number(estimatedTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1.5rem' }}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} />
            <span>Encrypted & secure order dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
