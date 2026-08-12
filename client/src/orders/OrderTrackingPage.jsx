import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Star, Clock, MapPin, CheckCircle2, Droplets, Package, Sparkles } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const ORDER_STAGES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', num: '1' },
  { key: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', num: '2' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', num: '3' },
  { key: 'PICKED_UP', label: 'Picked Up', num: '4' },
  { key: 'WASHING', label: 'Washing', num: '5' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Delivery', num: '6' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', num: '7' },
  { key: 'DELIVERED', label: 'Delivered', num: '8' },
];

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      const errMsg =
        err.response?.status === 404
          ? 'Order not found.'
          : err.response?.data?.message || err.message || 'Failed to load order tracking.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);


  const getStageIndex = (status) => {
    if (!status) return 0;
    const idx = ORDER_STAGES.findIndex((stage) => stage.key === status);
    return idx >= 0 ? idx : 0;
  };

  const activeIndex = order ? getStageIndex(order.status) : 0;
  const progressPercent = Math.min(100, Math.max(0, (activeIndex / (ORDER_STAGES.length - 1)) * 100));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/orders" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <ArrowLeft size={14} />
            <span>Back to My Orders</span>
          </Link>
          <h1 className="page-title">Order Status & Tracking</h1>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Order ID: <code className="font-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>{orderId}</code>
          </div>
        </div>

        <button onClick={fetchOrderDetails} className="btn btn-outline" style={{ padding: '0.5rem 0.9rem' }}>
          <RefreshCw size={14} />
          <span>Refresh Status</span>
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <span className="spinner" style={{ width: '28px', height: '28px', marginBottom: '1rem' }}></span>
          <p style={{ color: 'var(--text-muted)' }}>Fetching live laundry order status...</p>
        </div>
      ) : order ? (
        <div>
          {/* BANNER PROMPT: If status is Delivered, show "Rate this order" banner linking to Rate Order screen */}
          {order.status === 'DELIVERED' && (
            <div
              className="alert alert-info"
              style={{
                marginBottom: '1.5rem',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(79, 209, 197, 0.12)',
                border: '1px solid var(--accent)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Sparkles size={24} color="var(--accent)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Order Delivered! How was your experience?</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Help us improve WashFlow by rating your laundry service.</div>
                </div>
              </div>

              <Link to={`/orders/${orderId}/feedback`} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Star size={16} />
                <span>Rate This Order</span>
              </Link>
            </div>
          )}

          {/* SIGNATURE ELEMENT: 8-Stage Liquid Fill Stepper */}
          <div className="liquid-stepper-container">
            <div className="stepper-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={20} color="var(--accent)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Live Order Progression</h3>
              </div>
              <span className="badge badge-accent font-mono">
                Stage {activeIndex + 1} of 8 — {ORDER_STAGES[activeIndex]?.label}
              </span>
            </div>

            <div className="stepper-track-wrapper">
              {/* Progress Rail behind nodes */}
              <div className="liquid-rail">
                <div
                  className="liquid-rail-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* 8 Stage Nodes */}
              <div className="stepper-stages-grid">
                {ORDER_STAGES.map((stage, idx) => {
                  const isCompleted = idx < activeIndex;
                  const isActive = idx === activeIndex;

                  return (
                    <div
                      key={stage.key}
                      className={`stepper-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                      <div className="node-bubble">
                        <div className="node-bubble-fill"></div>
                        <div className="node-icon-content">
                          {isCompleted ? <CheckCircle2 size={18} /> : stage.num}
                        </div>
                      </div>
                      <span className="node-label">{stage.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Grid: Order Info & Delivery Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Card 1: Order Details */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="var(--accent)" />
                <span>Order Summary</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Service</span>
                  <span style={{ fontWeight: 600 }}>{order.serviceName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Status</span>
                  <span className="badge badge-warning">{order.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Weight</span>
                  <span className="font-mono">{order.weightKg} kg</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Payment Method</span>
                  <span className="badge badge-accent">Cash on Delivery</span>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Pickup Address:</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                    <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{order.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: NEW Delivery Details Panel */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--accent)" />
                <span>Delivery Details</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pickup Date</span>
                  <span className="font-mono">{order.pickupDate || 'Scheduled'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Estimated Delivery</span>
                  <span className="font-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {order.pickupDate ? new Date(new Date(order.pickupDate).getTime() + 86400000 * 2).toISOString().split('T')[0] : 'Pending'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Delivery Time Slot</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Morning (8:00 AM - 12:00 PM)</span>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Special Instructions / Notes:</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                    Standard laundry care requested. Handle with care.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderTrackingPage;
