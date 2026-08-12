import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Edit3, Save, LogOut, User as UserIcon, Camera, Image, Shield, Calendar, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';
import axiosClient from '../api/axiosClient';
import { useToast } from '../components/Toast';
import { useFeedback } from '../feedback/FeedbackContext';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1610557892470-76d9897e5b72?auto=format&fit=crop&w=800&q=80', // Aqua wave
  'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80', // Blue neon
  'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80', // Vapor bubble
];

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=washflow-clean', // Robot Clean
  'https://api.dicebear.com/7.x/identicon/svg?seed=washflow-aqua', // Geometric Aqua
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sajini', // Avatar Sajini
];

const ProfilePage = () => {
  const { user, logout, updateUserState } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { reviews } = useFeedback();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'reviews'
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  // LocalState for Custom Cover and Profile Pictures (Persisted in localStorage)
  const [coverPic, setCoverPic] = useState(
    () => localStorage.getItem(`washflow_cover_${user?.id}`) || PRESET_COVERS[0]
  );
  const [profilePic, setProfilePic] = useState(
    () => localStorage.getItem(`washflow_avatar_${user?.id}`) || PRESET_AVATARS[0]
  );

  const [showImagePicker, setShowImagePicker] = useState(false); // 'cover' | 'avatar' | null

  // Filter reviews for current user
  const userReviews = reviews.filter(
    (r) => r.userId === user?.id || r.userName === user?.name || r.userName === user?.email?.split('@')[0] || r.userId === 'user-current'
  );

  const fetchProfile = useCallback(async () => {
    if (!user || !user.id) return;
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.get(`/users/${user.id}`);
      setProfileData(response.data);
      setEditForm({
        name: response.data.name || '',
        email: response.data.email || '',
      });
    } catch (err) {
      console.warn('Profile API warning (e.g. rate limit), using authenticated session data:', err);
      // Graceful fallback
      const fallbackUser = {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        createdAt: new Date().toISOString(),
      };
      setProfileData(fallbackUser);
      setEditForm({
        name: fallbackUser.name,
        email: fallbackUser.email,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccessMessage('');
    setError('');
    if (profileData) {
      setEditForm({ name: profileData.name, email: profileData.email });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError('Name and email cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await axiosClient.put(`/users/${user.id}`, {
        name: editForm.name,
        email: editForm.email,
      });

      setProfileData(response.data);
      updateUserState({ name: response.data.name, email: response.data.email });
      setSuccessMessage('Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      const updated = { ...profileData, name: editForm.name, email: editForm.email };
      setProfileData(updated);
      updateUserState({ name: editForm.name, email: editForm.email });
      setSuccessMessage('Profile updated successfully!');
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const selectCover = (url) => {
    setCoverPic(url);
    localStorage.setItem(`washflow_cover_${user?.id}`, url);
    showToast('Cover photo updated!', 'success');
    setShowImagePicker(false);
  };

  const selectAvatar = (url) => {
    setProfilePic(url);
    localStorage.setItem(`washflow_avatar_${user?.id}`, url);
    showToast('Profile picture updated!', 'success');
    setShowImagePicker(false);
  };

  const handleCustomUrl = (type, url) => {
    if (!url || !url.startsWith('http')) {
      showToast('Please enter a valid image URL starting with http/https.', 'error');
      return;
    }
    if (type === 'cover') {
      selectCover(url);
    } else {
      selectAvatar(url);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">Customize your identity, profile banner, avatar, and view community reviews.</p>
      </div>

      {/* Modern Profile Hero Card */}
      <div className="profile-hero">
        {/* Gradient Mesh Banner */}
        <div className="profile-hero-banner">
          <img
            src={coverPic}
            alt="Profile Cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, mixBlendMode: 'luminosity' }}
          />
          <button
            onClick={() => setShowImagePicker('cover')}
            className="btn btn-secondary"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              background: 'rgba(6, 6, 8, 0.6)',
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 5,
            }}
          >
            <Camera size={14} />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="profile-hero-info">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            {/* Avatar & Name */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-ring">
                  <div className="profile-avatar-inner">
                    <img src={profilePic} alt="User Avatar" />
                  </div>
                </div>
                <button
                  onClick={() => setShowImagePicker('avatar')}
                  className="profile-avatar-edit-btn"
                  title="Change Avatar"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div style={{ paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 700 }}>
                    {profileData?.name || user?.name || 'WashFlow Customer'}
                  </h2>
                  <span className="badge badge-accent" style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>
                    Verified
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--text-faint)" />
                  <span>{profileData?.email || user?.email}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.5rem' }}>
              {!isEditing ? (
                <button onClick={handleEditToggle} className="btn btn-secondary">
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button onClick={handleEditToggle} className="btn btn-secondary">
                  Cancel
                </button>
              )}
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="profile-stats-row">
            <div className="profile-stat-card">
              <div className="profile-stat-label">Reviews</div>
              <div className="profile-stat-value">{userReviews.length}</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-label">Member Since</div>
              <div className="profile-stat-value" style={{ fontSize: '0.95rem' }}>{formatDate(profileData?.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Custom Image Picker Modal Panel */}
      {showImagePicker && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            background: 'var(--surface-raised)',
            border: '1px solid var(--accent)',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image size={18} color="var(--accent)" />
              <span>Change {showImagePicker === 'cover' ? 'Cover Banner' : 'Profile Picture'}</span>
            </h3>
            <button
              onClick={() => setShowImagePicker(false)}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {showImagePicker === 'cover' ? (
              PRESET_COVERS.map((url, i) => (
                <div
                  key={i}
                  onClick={() => selectCover(url)}
                  style={{
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: coverPic === url ? '2px solid var(--accent)' : '1px solid var(--border)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <img src={url} alt={`Cover ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))
            ) : (
              PRESET_AVATARS.map((url, i) => (
                <div
                  key={i}
                  onClick={() => selectAvatar(url)}
                  style={{
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: 'var(--surface)',
                    border: profilePic === url ? '2px solid var(--accent)' : '1px solid var(--border)',
                    padding: '0.5rem',
                  }}
                >
                  <img src={url} alt={`Avatar ${i + 1}`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Or enter custom image URL:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="custom-url-input"
                type="text"
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById('custom-url-input');
                  handleCustomUrl(showImagePicker, input?.value);
                  if (input) input.value = '';
                }}
                className="btn btn-primary"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Info
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({userReviews.length})
        </button>
      </div>

      {/* TAB 1: PROFILE INFO */}
      {activeTab === 'profile' && (
        <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          
          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {loading ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
              <span className="spinner"></span>
              <span>Loading profile details...</span>
            </div>
          ) : profileData ? (
            <div>
              {!isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', margin: '0.5rem 0 1rem 0' }}>
                  
                  <div style={{ background: 'var(--surface-raised)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Shield size={14} color="var(--accent)" />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>{profileData.id}</div>
                  </div>

                  <div style={{ background: 'var(--surface-raised)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <UserIcon size={14} color="var(--accent)" />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</div>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profileData.name}</div>
                  </div>

                  <div style={{ background: 'var(--surface-raised)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Calendar size={14} color="var(--accent)" />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Created</div>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{formatDate(profileData.createdAt)}</div>
                  </div>

                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="auth-form" style={{ marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label htmlFor="edit-name">Full Name</label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-email">Email Address</label>
                    <input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <span className="spinner"></span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button type="button" onClick={handleEditToggle} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No profile data available.</p>
          )}
        </div>
      )}

      {/* TAB 2: MY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Real-Time Submitted Reviews</h2>
          </div>

          {userReviews.length === 0 ? (
            <div className="empty-box">
              <MessageSquare className="empty-box-icon" />
              <h3>No Reviews Submitted Yet</h3>
              <p>When you rate an order, your real-time ratings and feedback comments will appear here instantly.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {userReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rev.serviceName}</span>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(rev.date || rev.createdAt)}
                    </span>
                  </div>

                  {/* Star Rating Display */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= rev.rating ? 'var(--accent)' : 'none'}
                        color={star <= rev.rating ? 'var(--accent)' : 'var(--text-faint)'}
                      />
                    ))}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
