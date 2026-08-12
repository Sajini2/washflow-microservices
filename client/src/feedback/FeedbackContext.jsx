import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext(null);

const DEFAULT_REVIEWS = [
  {
    id: 'rev-001',
    userId: 'user-001',
    userName: 'Samantha Perera',
    userAvatar: 'S',
    rating: 5,
    serviceName: 'Premium Delicate Wash',
    date: '2026-08-10',
    comment: 'The aqua-teal dark dashboard makes tracking so easy! My silk dresses came back spotlessly clean and fragrant.',
    helpfulCount: 14,
    verified: true,
  },
  {
    id: 'rev-002',
    userId: 'user-002',
    userName: 'Kavinda Fernando',
    userAvatar: 'K',
    rating: 5,
    serviceName: 'Suit & Tuxedo Pressing',
    date: '2026-08-08',
    comment: 'Crisp pressing on my tuxedo for a wedding. The pickup driver was right on time and updated status live on the liquid stepper.',
    helpfulCount: 9,
    verified: true,
  },
  {
    id: 'rev-003',
    userId: 'user-003',
    userName: 'Anuki Jayawardena',
    userAvatar: 'A',
    rating: 4,
    serviceName: 'Sneaker & Leather Shoe Refresh',
    date: '2026-08-05',
    comment: 'My white leather sneakers look practically brand new again. Super impressed with the sole restoration.',
    helpfulCount: 6,
    verified: true,
  },
  {
    id: 'rev-004',
    userId: 'user-004',
    userName: 'Dinesh Wickramasinghe',
    userAvatar: 'D',
    rating: 5,
    serviceName: 'Heavy Bedding & Comforters',
    date: '2026-08-02',
    comment: 'Washing giant king size duvets at home is impossible. WashFlow picked them up and returned them fresh in 24 hours.',
    helpfulCount: 11,
    verified: true,
  },
  {
    id: 'rev-005',
    userId: 'user-005',
    userName: 'Nipuni Ratnayake',
    userAvatar: 'N',
    rating: 5,
    serviceName: 'Eco Organic Green Wash',
    date: '2026-07-29',
    comment: 'Love that they use eco-friendly organic detergents. No harsh chemical smells and great for sensitive skin!',
    helpfulCount: 8,
    verified: true,
  },
];

export const FeedbackProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('washflow_reviews');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch (e) {
      return DEFAULT_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('washflow_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to persist reviews in localStorage', e);
    }
  }, [reviews]);

  const addFeedback = (newReview) => {
    const reviewObj = {
      id: `rev-${Date.now()}`,
      userId: newReview.userId || 'user-current',
      userName: newReview.userName || 'Jane Doe',
      userAvatar: (newReview.userName || 'J').charAt(0).toUpperCase(),
      rating: newReview.rating || 5,
      serviceName: newReview.serviceName || 'Standard Laundry Wash',
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment || 'Great service!',
      helpfulCount: 0,
      verified: true,
      orderId: newReview.orderId,
    };

    setReviews((prev) => [reviewObj, ...prev]);
    return reviewObj;
  };

  return (
    <FeedbackContext.Provider value={{ reviews, addFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    return {
      reviews: DEFAULT_REVIEWS,
      addFeedback: () => {},
    };
  }
  return context;
};
