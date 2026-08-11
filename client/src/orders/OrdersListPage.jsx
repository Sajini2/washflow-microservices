import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../auth/AuthContext';

const OrdersListPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all orders from backend via API Gateway
      const response = await axiosClient.get('/orders');

      // Client-side filtering for logged in user's orders
      const myOrders = response.data.filter((order) => order.userId === user?.id);
      setOrders(myOrders);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch orders.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: '1px solid rgba(34, 197, 94, 0.4)' };
      case 'OUT_FOR_DELIVERY':
      case 'READY_FOR_DELIVERY':
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' };
      case 'WASHING':
      case 'PICKED_UP':
        return { background: 'rgba(234, 179, 8, 0.2)', color: '#fef08a', border: '1px solid rgba(234, 179, 8, 0.4)' };
      case 'PICKUP_SCHEDULED':
      case 'ORDER_PLACED':
      default:
        return { background: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.4)' };
    }
  };

  return (
    <div className="profile-container" style={{ maxWidth: '800px' }}>
      <div className="profile-card">
        <div className="profile-header">
          <h2>📦 My Laundry Orders</h2>
          <Link to="/orders/new" className="btn btn-primary">
            + New Order
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-container">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="auth-subtitle" style={{ fontSize: '1.1rem' }}>
              You don't have any laundry orders yet.
            </p>
            <Link to="/orders/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Schedule Your First Pickup
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{order.serviceName}</h3>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        ...getStatusBadgeStyle(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Weight: <strong>{order.weightKg} kg</strong></span> •{' '}
                    <span>Pickup Date: <strong>{order.pickupDate}</strong></span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Address: {order.address}
                  </div>
                </div>

                <div>
                  <Link to={`/orders/${order.id}`} className="btn btn-outline">
                    Track Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersListPage;
