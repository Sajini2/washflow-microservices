import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ORDER_STAGES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', icon: '📝' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', icon: '📅' },
  { key: 'PICKED_UP', label: 'Picked Up', icon: '🧺' },
  { key: 'WASHING', label: 'Washing', icon: '🧼' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Delivery', icon: '✨' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚚' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🏠' },
];

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      const errMsg =
        err.response?.status === 404
          ? 'Order not found.'
          : err.response?.data?.message || err.message || 'Failed to load order details.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status) => {
    return ORDER_STAGES.findIndex((stage) => stage.key === status);
  };

  const activeIndex = order ? getStageIndex(order.status) : -1;

  return (
    <div className="profile-container" style={{ maxWidth: '850px' }}>
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h2>📍 Order Status & Tracking</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Order ID: <code style={{ color: '#818cf8' }}>{orderId}</code>
            </div>
          </div>
          <button onClick={fetchOrderDetails} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
            🔄 Refresh Status
          </button>
        </div>

        {error && (
          <div>
            <div className="alert alert-error">{error}</div>
            <Link to="/orders" className="btn btn-secondary">
              ← Back to My Orders
            </Link>
          </div>
        )}

        {loading ? (
          <div className="loading-container">Loading order tracking status...</div>
        ) : order ? (
          <div>
            {/* Status Stepper */}
            <div style={{ margin: '2rem 0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '0.5rem',
                  alignItems: 'start',
                }}
              >
                {ORDER_STAGES.map((stage, idx) => {
                  const isCompleted = idx < activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div
                      key={stage.key}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        background: isCurrent
                          ? 'rgba(99, 102, 241, 0.25)'
                          : isCompleted
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(15, 23, 42, 0.4)',
                        border: isCurrent
                          ? '1px solid #6366f1'
                          : isCompleted
                          ? '1px solid rgba(34, 197, 94, 0.4)'
                          : '1px solid var(--card-border)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          background: isCurrent
                            ? '#4f46e5'
                            : isCompleted
                            ? '#16a34a'
                            : '#334155',
                          color: '#ffffff',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {isCompleted ? '✓' : stage.icon}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: isCurrent ? '700' : '500',
                          color: isCurrent ? '#818cf8' : isCompleted ? '#86efac' : '#94a3b8',
                        }}
                      >
                        {stage.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Details */}
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Service</span>
                <span className="detail-value">{order.serviceName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Status</span>
                <span className="detail-value" style={{ color: '#818cf8', fontWeight: '700' }}>
                  {order.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight</span>
                <span className="detail-value">{order.weightKg} kg</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pickup Date</span>
                <span className="detail-value">{order.pickupDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{order.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer ID</span>
                <span className="detail-value">{order.userId}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <Link to="/orders" className="btn btn-secondary">
                ← Back to My Orders
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
