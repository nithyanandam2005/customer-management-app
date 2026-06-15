import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading profile details...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your registered customer account details</p>
        </div>
        <Link to="/customer/profile/update" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {profile && (
        <div className="card">
          <h2 className="card-title">Account Information</h2>
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{profile.fullName}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{profile.email}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{profile.phoneNumber}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Street Address</span>
              <span className="detail-value">{profile.address}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Account Role</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                {profile.role}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Joined Date</span>
              <span className="detail-value">
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
