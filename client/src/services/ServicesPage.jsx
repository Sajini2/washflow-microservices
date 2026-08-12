import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, Shirt, ArrowRight, Sparkles, Search } from 'lucide-react';
import axiosClient from '../api/axiosClient';

// 22+ Comprehensive Service Plans Dataset (Prices in LKR)
const CATALOG_SERVICES = [
  { id: 'srv-001', name: 'Standard Wash & Fold', price: 450, estimatedMinutes: 60, category: 'Everyday Wash', description: 'Complete wash, tumble dry, and neat folding for your daily wardrobe essentials.' },
  { id: 'srv-002', name: 'Premium Delicate Wash', price: 650, estimatedMinutes: 90, category: 'Everyday Wash', description: 'Gentle temperature wash with fabric softener and hypoallergenic detergent for delicate cottons.' },
  { id: 'srv-003', name: 'Express Same-Day Wash', price: 850, estimatedMinutes: 45, category: 'Express & Commercial', description: 'Priority fast-track laundering delivered within 6 hours for urgent requests.' },
  { id: 'srv-004', name: 'Suit & Tuxedo Pressing', price: 1500, estimatedMinutes: 120, category: 'Dry Cleaning', description: 'Professional eco dry cleaning and steam pressing for business suits and formal attire.' },
  { id: 'srv-005', name: 'Silk & Satin Garment Care', price: 1850, estimatedMinutes: 150, category: 'Dry Cleaning', description: 'Specialized low-moisture cleaning for delicate silk dresses, blouses, and neckties.' },
  { id: 'srv-006', name: 'Leather & Suede Restoration', price: 3500, estimatedMinutes: 240, category: 'Specialized Care', description: 'Deep conditioning, stain extraction, and color restoration for leather and suede jackets.' },
  { id: 'srv-007', name: 'Heavy Bedding & Comforters', price: 2200, estimatedMinutes: 180, category: 'Everyday Wash', description: 'Deep thermal washing and tumble sanitization for duvets, blankets, and bulky comforters.' },
  { id: 'srv-008', name: 'Wedding Gown Preservation', price: 6500, estimatedMinutes: 300, category: 'Specialized Care', description: 'Hand inspection, stain treatment, museum-grade cleaning, and acid-free archival storage box.' },
  { id: 'srv-009', name: 'Sneaker & Leather Shoe Refresh', price: 1950, estimatedMinutes: 120, category: 'Specialized Care', description: 'Deep exterior scrubbing, lace cleaning, sole whitening, and interior odor removal.' },
  { id: 'srv-010', name: 'Lingerie & Lace Care', price: 750, estimatedMinutes: 60, category: 'Everyday Wash', description: 'Mesh bag protected cold wash with mild organic detergent for lace and intimates.' },
  { id: 'srv-011', name: 'Curtains & Drapery Refresh', price: 2800, estimatedMinutes: 210, category: 'Dry Cleaning', description: 'In-house dry cleaning for heavy drapes, velvet curtains, and blackout window shades.' },
  { id: 'srv-012', name: 'Denim & Heavy Cotton Wash', price: 550, estimatedMinutes: 75, category: 'Everyday Wash', description: 'Color-preserving wash technique for jeans, denim jackets, and heavy canvas workwear.' },
  { id: 'srv-013', name: 'Eco Organic Green Wash', price: 700, estimatedMinutes: 90, category: 'Everyday Wash', description: '100% biodegradable organic non-toxic wash powered by solar micro-energy.' },
  { id: 'srv-014', name: 'Baby Garment Sterilization', price: 600, estimatedMinutes: 80, category: 'Everyday Wash', description: 'Dermatologist tested, dye-free, ultra-soft thermal steam wash for infant clothing.' },
  { id: 'srv-015', name: 'Wool & Cashmere Care', price: 2100, estimatedMinutes: 160, category: 'Dry Cleaning', description: 'Specialized anti-shrink hand wash and flat dry shaping for premium cashmere sweaters.' },
  { id: 'srv-016', name: 'Crisp Shirt Ironing & Hanging', price: 350, estimatedMinutes: 30, category: 'Dry Cleaning', description: 'Precision steam ironing, collar crisping, and hanger packaging for formal dress shirts.' },
  { id: 'srv-017', name: 'Sports Gear & Gym Sterilize', price: 650, estimatedMinutes: 60, category: 'Everyday Wash', description: 'Activewear odor-elimination treatment targeting synthetic moisture-wicking fabrics.' },
  { id: 'srv-018', name: 'Hotel & Restaurant Linen', price: 400, estimatedMinutes: 120, category: 'Express & Commercial', description: 'Commercial bulk laundering for bed sheets, pillowcases, tablecloths, and napkins.' },
  { id: 'srv-019', name: 'Commercial Uniform Wash', price: 500, estimatedMinutes: 90, category: 'Express & Commercial', description: 'Industrial stain washing for medical scrubs, corporate aprons, and industrial overalls.' },
  { id: 'srv-020', name: 'Anti-Allergen Dust Mite Clean', price: 2900, estimatedMinutes: 180, category: 'Specialized Care', description: '60°C thermal sanitization treatment destroying 99.9% of dust mites and pet dander.' },
  { id: 'srv-021', name: 'Deep Stain Removal Specialist', price: 1400, estimatedMinutes: 90, category: 'Specialized Care', description: 'Targeted enzyme pre-treatment for tough oil, wine, ink, and coffee stains.' },
  { id: 'srv-022', name: 'Winter Coat & Down Jacket Wash', price: 2600, estimatedMinutes: 200, category: 'Dry Cleaning', description: 'Feather fluffed down jacket wash with water-repellent coating re-application.' },
];

const CATEGORIES = ['All Plans', 'Everyday Wash', 'Dry Cleaning', 'Specialized Care', 'Express & Commercial'];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Plans');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/services');
      const apiServices = response.data || [];
      
      if (apiServices.length > 0) {
        const mergedMap = new Map();
        CATALOG_SERVICES.forEach((s) => mergedMap.set(s.name.toLowerCase(), s));
        apiServices.forEach((s) => mergedMap.set(s.name.toLowerCase(), { ...s, category: s.category || 'Everyday Wash' }));
        setServices(Array.from(mergedMap.values()));
      } else {
        setServices(CATALOG_SERVICES);
      }
    } catch (err) {
      console.warn('API connection failed, falling back to full catalog:', err);
      setServices(CATALOG_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = selectedCategory === 'All Plans' || s.category === selectedCategory;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleSelectService = (service) => {
    navigate('/orders/new', {
      state: {
        service: {
          id: service.id,
          name: service.name,
          price: service.price,
          description: service.description,
        },
      },
    });
  };

  const formatLKR = (amount) => {
    return `LKR ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          <Sparkles size={16} />
          <span>Catalog & Care Packages</span>
        </div>
        <h1 className="page-title">Browse Laundry & Care Services</h1>
        <p className="page-description">
          Choose from over {services.length} specialized wash, dry cleaning, pressing, and restoration plans
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by service name or garment type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Error loading backend catalog:</strong> Showing local catalog fallback.
          </div>
          <button onClick={fetchServices} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} />
            <span>Retry Sync</span>
          </button>
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <div className="services-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="service-card" style={{ height: '240px' }}>
              <div>
                <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '80%' }}></div>
              </div>
              <div>
                <div className="skeleton" style={{ height: '36px', width: '100%', marginTop: '1.5rem' }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <div className="empty-box">
          <Shirt className="empty-box-icon" />
          <h3>No Matching Service Plans Found</h3>
          <p>Try searching for a different keyword or select another category filter.</p>
          <button onClick={() => { setSelectedCategory('All Plans'); setSearchQuery(''); }} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Reset Search & Filters
          </button>
        </div>
      )}

      {/* Services Grid (3 cols desktop, 1 col mobile) */}
      {!loading && filteredServices.length > 0 && (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div>
                <div className="service-card-header">
                  <div>
                    <span className="badge badge-accent" style={{ fontSize: '0.7rem', marginBottom: '0.35rem', display: 'inline-block' }}>
                      {service.category || 'Everyday Wash'}
                    </span>
                    <h3 className="service-title">{service.name}</h3>
                  </div>
                  <span className="service-price" style={{ fontSize: '1.1rem' }}>
                    {formatLKR(service.price)}
                  </span>
                </div>
                <p className="service-description">
                  {service.description || 'Professional wash & care tailored for your everyday clothes.'}
                </p>
              </div>

              <div className="service-card-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="badge badge-accent" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    <Clock size={12} />
                    <span>{service.estimatedMinutes || 60} mins estimated</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectService(service)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <span>Select Plan</span>
                  <ArrowRight size={16} />
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
