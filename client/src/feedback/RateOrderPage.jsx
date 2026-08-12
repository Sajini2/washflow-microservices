import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useFeedback } from './FeedbackContext';
import { useAuth } from '../auth/AuthContext';

const RateOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addFeedback } = useFeedback();
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showToast('Please select a star rating.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit real-time feedback to shared FeedbackContext & localStorage store
      addFeedback({
        userId: user?.id || 'user-current',
        userName: user?.name || user?.email?.split('@')[0] || 'Customer',
        rating,
        comment,
        serviceName: 'Standard Laundry & Care Service',
        orderId,
      });

      // Simulate async network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      showToast('Thank you! Your feedback has been broadcast in real-time.', 'success');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      showToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStarCount = hoverRating || rating;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={`/orders/${orderId}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Order Tracking</span>
        </Link>
      </div>

      <div className="card" style={{ padding: '2.25rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(79, 209, 197, 0.12)',
              border: '1px solid var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', margin: '0 0 0.4rem 0' }}>Rate Your Laundry Order</h1>
          <p className="page-description">
            Share your feedback for Order <code className="font-mono" style={{ color: 'var(--accent)' }}>{orderId}</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Star Rating Group */}
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Overall Quality & Service</label>
            <div className="star-rating-group">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= currentStarCount;

                return (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${isFilled ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star size={36} fill={isFilled ? 'var(--accent)' : 'none'} color={isFilled ? 'var(--accent)' : 'var(--text-faint)'} />
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', height: '1.25rem' }}>
              {currentStarCount === 5 && '🌟 Excellent — Perfect Service'}
              {currentStarCount === 4 && '👍 Very Good — Met Expectations'}
              {currentStarCount === 3 && '😐 Average — Room for Improvement'}
              {currentStarCount === 2 && '👎 Below Expectations'}
              {currentStarCount === 1 && '⚠️ Poor Experience'}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="comment">Additional Comments / Feedback (Optional)</label>
            <textarea
              id="comment"
              rows={4}
              placeholder="Tell us what you loved or how we can improve our wash & fold service..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Real-Time Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RateOrderPage;
