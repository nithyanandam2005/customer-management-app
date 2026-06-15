import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customers = await api.getAllCustomers();
        setStats({
          totalCustomers: customers.length,
          loading: false,
          error: ''
        });
      } catch (err) {
        setStats({
          totalCustomers: 0,
          loading: false,
          error: err.message || 'Failed to fetch admin stats'
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Console</h1>
          <p className="page-subtitle">Manage customer records and monitor platform statistics</p>
        </div>
        <Link to="/admin/customers" className="btn btn-primary">
          Manage Customers
        </Link>
      </div>

      {stats.error && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span> {stats.error}
        </div>
      )}

      <div className="grid grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <div className="stats-card">
          <div className="stats-number">
            {stats.loading ? '...' : stats.totalCustomers}
          </div>
          <div className="stats-label">Total Customers</div>
        </div>
        
        <div className="stats-card">
          <div className="stats-number">Active</div>
          <div className="stats-label">Database Status</div>
        </div>

        <div className="stats-card">
          <div className="stats-number">v1.0.0</div>
          <div className="stats-label">Platform Version</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 className="card-title">Quick Administration Actions</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            As a system administrator, you have complete administrative authority to list, view, update, and remove customer profiles.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/customers" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              👥 View Customer Directory
            </Link>
            <div className="btn btn-secondary" style={{ justifyContent: 'flex-start', cursor: 'default', opacity: 0.6 }}>
              ⚙️ Platform System Settings (Read-Only)
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Security & Logging</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            All administrative actions are tracked for audit compliance. Do not disclose your predefined administrator credentials.
          </p>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-hover)', textTransform: 'uppercase' }}>
              System Logs
            </span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
              [INFO] Admin logged in successfully.<br />
              [INFO] Database connection active on port 27017.<br />
              [INFO] Token verification middleware initialized.<br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
