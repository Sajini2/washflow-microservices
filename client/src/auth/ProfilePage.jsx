import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axiosClient from '../api/axiosClient';

const ProfilePage = () => {
  const { user, logout, updateUserState } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
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
      // Synchronize AuthContext state with fresh backend data
      updateUserState({ name: response.data.name, email: response.data.email });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

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
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString();
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {loading ? (
          <div className="loading-spinner">Loading user details...</div>
        ) : profileData ? (
          <div className="profile-body">
            {!isEditing ? (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">User ID:</span>
                  <span className="detail-value">{profileData.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{profileData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address:</span>
                  <span className="detail-value">{profileData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Created:</span>
                  <span className="detail-value">{formatDate(profileData.createdAt)}</span>
                </div>

                <div className="profile-actions">
                  <button onClick={handleEditToggle} className="btn btn-secondary">
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
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

                <div className="profile-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleEditToggle} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
