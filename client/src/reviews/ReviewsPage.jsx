import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, Sparkles, ThumbsUp, MessageSquare } from 'lucide-react';
import { useFeedback } from '../feedback/FeedbackContext';

const ReviewsPage = () => {
  const { reviews } = useFeedback();
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'ALL') return reviews;
    return reviews.filter((r) => r.rating === parseInt(selectedFilter, 10));
  }, [reviews, selectedFilter]);

  const ratingCounts = useMemo(() => {
    return {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };
  }, [reviews]);

  const averageScore = useMemo(() => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            <Sparkles size={16} />
            <span>Community Feedback & Live Reviews</span>
          </div>
          <h1 className="page-title">Customer Reviews & Ratings</h1>
          <p className="page-description">See verified live ratings and feedback from customers using WashFlow services</p>
        </div>

        <Link to="/orders" className="btn btn-primary">
          <Star size={16} />
          <span>Rate Your Recent Order</span>
        </Link>
      </div>

      {/* Review Metrics Overview Banner */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'center' }}>
          {/* Rating Score */}
          <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)', paddingRight: '1.5rem' }}>
            <div className="font-mono" style={{ fontSize: '3.2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
              {averageScore}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="var(--accent)" color="var(--accent)" />
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Based on {reviews.length} real-time feedback submissions
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars] || 0;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '45px', color: 'var(--text-muted)' }}>{stars} Star</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--surface-raised)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: 'var(--accent)', borderRadius: '4px' }}></div>
                  </div>
                  <span className="font-mono" style={{ width: '30px', color: 'var(--text-faint)', textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${selectedFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedFilter('ALL')}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          className={`btn ${selectedFilter === '5' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedFilter('5')}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
        >
          5 Stars ({ratingCounts[5]})
        </button>
        <button
          className={`btn ${selectedFilter === '4' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedFilter('4')}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
        >
          4 Stars ({ratingCounts[4]})
        </button>
      </div>

      {/* Reviews Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="empty-box">
          <MessageSquare className="empty-box-icon" />
          <h3>No Reviews For Selected Rating</h3>
          <p>Be the first customer to leave feedback for this rating tier!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                    {rev.userAvatar || 'U'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{rev.userName}</h3>
                      {rev.verified && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <CheckCircle2 size={13} />
                          <span>Verified Customer</span>
                        </span>
                      )}
                    </div>
                    <span className="badge badge-accent" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {rev.serviceName}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill={star <= rev.rating ? 'var(--accent)' : 'none'}
                        color={star <= rev.rating ? 'var(--accent)' : 'var(--text-faint)'}
                      />
                    ))}
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rev.date}
                  </span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <ThumbsUp size={12} />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                  WashFlow Live Real-Time Review
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
