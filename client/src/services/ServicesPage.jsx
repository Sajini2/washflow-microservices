import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls Gateway (http://localhost:8080/services), routed to Laundry Service (8082)
      const response = await axiosClient.get('/services');
      setServices(response.data || []);
    } catch (err) {
      console.error('Failed to fetch laundry services:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Unable to load laundry services. Please verify the service is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSelectService = (service) => {
    navigate('/orders/new', { state: { service: { id: service.id, name: service.name } } });
  };

  if (loading) {
    return (
      <div className="services-page-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading available laundry services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page-container">
      <div className="services-header">
        <h2>Laundry Services & Pricing</h2>
        <p className="services-subtitle">
          Select from our available wash, dry, fold, and pressing options
        </p>
      </div>

      {error && (
        <div className="alert alert-error error-box">
          <p><strong>Error loading services:</strong> {error}</p>
          <button onClick={fetchServices} className="btn btn-secondary retry-btn">
            Retry
          </button>
        </div>
      )}

      {!error && services.length === 0 && (
        <div className="empty-box">
          <span className="empty-icon">🧺</span>
          <h3>No Laundry Services Found</h3>
          <p>There are currently no active laundry service catalog items available.</p>
        </div>
      )}

      {!error && services.length > 0 && (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-header">
                <h3 className="service-name">{service.name}</h3>
                <span className="service-price">${Number(service.price).toFixed(2)}</span>
              </div>
              <p className="service-description">{service.description || 'No description provided.'}</p>
              <div className="service-card-footer">
                <span className="service-badge">
                  ⏱️ {service.estimatedMinutes} mins estimated
                </span>
                <button
                  onClick={() => handleSelectService(service)}
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}
                >
                  Order Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
