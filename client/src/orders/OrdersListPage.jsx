import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, ArrowRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../auth/AuthContext';

const OrdersListPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.get('/orders');
      const myOrders = (response.data || []).filter((order) => order.userId === user?.id);
      setOrders(myOrders);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch orders list.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  const getStatusBadge = (status) => {
    const isDelivered = status === 'DELIVERED';
    return (
      <span className={`badge ${isDelivered ? 'badge-success' : 'badge-warning'}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-description">View, track, and manage all your active and past laundry requests</p>
        </div>

        <Link to="/orders/new" className="btn btn-primary">
          <Plus size={18} />
          <span>New Laundry Order</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Skeleton Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card" style={{ height: '120px' }}>
              <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '0.75rem' }}></div>
              <div className="skeleton" style={{ height: '16px', width: '70%' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-box">
          <Package className="empty-box-icon" />
          <h3>No Orders Placed Yet</h3>
          <p>You haven't requested any laundry pickups. Explore our services to get started!</p>
          <Link to="/services" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <span>Browse Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Orders Cards List */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{order.serviceName}</h3>
                    {getStatusBadge(order.status)}
                    <span className="badge badge-accent">Cash on Delivery</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Order ID: <code className="font-mono" style={{ color: 'var(--text-primary)' }}>{order.id}</code>
                  </div>
                </div>

                <Link to={`/orders/${order.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                  <span>Track Order</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Weight: </span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{order.weightKg} kg</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Pickup Date: </span>
                  <span className="font-mono">{order.pickupDate}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Address: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{order.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersListPage;
