import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For detail modal

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phoneNumber.includes(term)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  // Handle Delete Action
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
      try {
        await api.deleteCustomer(id);
        // Refresh local list
        setCustomers((prev) => prev.filter((c) => c._id !== id));
        if (selectedCustomer?._id === id) {
          setSelectedCustomer(null);
        }
      } catch (err) {
        alert(err.message || 'Failed to delete customer');
      }
    }
  };

  // Handle Send Reset Email Action
  const handleSendResetEmail = async (id, name, email) => {
    if (window.confirm(`Are you sure you want to send a password reset link to customer "${name}" (${email})?`)) {
      try {
        const response = await api.adminSendResetLink(id);
        
        // Log Ethereal preview to developer console locally for testing convenience
        if (response.previewUrl) {
          console.log('\n========================================');
          console.log(`✉️  RESET EMAIL FOR: ${email}`);
          console.log(`Preview URL: ${response.previewUrl}`);
          console.log('========================================\n');
        }

        alert(response.message || `Password reset link successfully sent to ${email}!`);
      } catch (err) {
        alert(err.message || 'Failed to send reset link.');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">View, search, edit, and delete customer profiles</p>
        </div>
        <input
          type="text"
          className="search-box"
          placeholder="Search by name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Retrieving customers records...</div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No customer records match your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <strong>{customer.fullName}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {customer.address}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-icon"
                          title="View Details"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          👁️
                        </button>
                        <button
                          className="btn-icon"
                          title="Send Reset Email"
                          onClick={() => handleSendResetEmail(customer._id, customer.fullName, customer.email)}
                        >
                          ✉️
                        </button>
                        <Link
                          to={`/admin/customers/update/${customer._id}`}
                          className="btn-icon"
                          title="Edit Customer"
                          style={{ textDecoration: 'none' }}
                        >
                          ✏️
                        </Link>
                        <button
                          className="btn-icon"
                          title="Delete Customer"
                          style={{ hover: { color: 'red' } }}
                          onClick={() => handleDelete(customer._id, customer.fullName)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail Glassmorphic Modal */}
      {selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(5, 2, 12, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '540px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            
            <h2 className="card-title">Customer Profile Details</h2>
            
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">Unique ID</span>
                <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {selectedCustomer._id}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{selectedCustomer.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{selectedCustomer.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">{selectedCustomer.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{selectedCustomer.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Database Role</span>
                <span className="detail-value">{selectedCustomer.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {new Date(selectedCustomer.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
              <Link
                to={`/admin/customers/update/${selectedCustomer._id}`}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Edit Details
              </Link>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
