import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>
          You are logged in to the CustSphere customer portal. Manage your information, explore features, and stay up to date.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/customer/profile" className="btn btn-primary">
            View My Profile
          </Link>
          <Link to="/customer/profile/update" className="btn btn-secondary">
            Edit Profile Details
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
          <h3 className="card-title" style={{ fontSize: '1.2rem', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Data Privacy
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Your records are protected with industry-standard encryption protocols. Only you and authorised administrators have access to your personal details.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <h3 className="card-title" style={{ fontSize: '1.2rem', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Instant Updates
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Modify your phone number, street address, and contact preferences anytime. Changes are broadcast to the system in real time.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
          <h3 className="card-title" style={{ fontSize: '1.2rem', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Next-Gen Tech
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Powered by React, MongoDB, Express, and Node, providing high-performance server replies and a frictionless user experience.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">About CustSphere</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          CustSphere is a state-of-the-art secure platform that helps customers manage their personal profiles, request services, and connect with their service providers seamlessly. We prioritize high-grade security, lightning-fast response times, and an intuitive user interface to deliver a satisfying experience.
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Whether you want to update your address details, verify your contact information, or check your registration status, CustSphere offers a seamless one-stop interface that works on both desktop and mobile devices.
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
