import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.forgotPassword(email.trim());
      setSuccess('A password reset email has been sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ maxWidth: '480px' }}>
      <div className="auth-header">
        <h1>Reset Password</h1>
        <p>Enter your email to receive a password reset link</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-danger" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <span>✅</span> {success}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="e.g. nithya@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              We have dispatched a password reset link to your email address. Please inspect your inbox and click the link inside the email to configure a new password.
            </p>
            
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>

      {!success && (
        <div className="auth-footer">
          <p>
            Remembered your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
