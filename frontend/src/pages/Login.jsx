import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Login = () => {

  const [loginMode, setLoginMode] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();

  const navigate = useNavigate();


  // CHANGE LOGIN TAB
  const handleTabChange = (mode) => {
    setLoginMode(mode);
    setError('');
    setEmail('');
    setPassword('');
  };


  // LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const data = await api.login(
        email.trim(),
        password
      );

      // CHECK ROLE
      if (
        loginMode === 'admin' &&
        data.role !== 'admin'
      ) {
        throw new Error(
          'This account does not have administrator privileges. Please use the Customer tab.'
        );
      }

      if (
        loginMode === 'customer' &&
        data.role === 'admin'
      ) {
        throw new Error(
          'This is an administrator account. Please use the Admin tab to log in.'
        );
      }

      // SAVE USER
      loginUser(data);

      // REDIRECT
      navigate(
        data.role === 'admin'
          ? '/admin/dashboard'
          : '/customer/dashboard'
      );

    } catch (err) {

      setError(
        err.message ||
        'Failed to login. Please check your credentials.'
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Access your CustSphere portal</p>
      </div>

      <div className="card">
        {/* Toggle Login Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${loginMode === 'customer' ? 'active' : ''}`}
            onClick={() => handleTabChange('customer')}
          >
            Customer Login
          </button>
          <button
            type="button"
            className={`login-tab-btn ${loginMode === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin Login
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert" style={{ marginTop: '1rem' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={loginMode === 'admin' ? 'admin@customermanagement.com' : 'e.g. nithya@gmail.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginMode === 'customer' && (
              <div style={{ textAlign: 'right', marginTop: '0.35rem' }}>
                <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }} className="hover-underline">
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>

          {loginMode === 'admin' && (
            <div 
              style={{ 
                background: 'rgba(139, 92, 246, 0.08)', 
                border: '1px dashed rgba(139, 92, 246, 0.3)', 
                borderRadius: '8px', 
                padding: '0.75rem', 
                fontSize: '0.8rem', 
                marginBottom: '1rem',
                color: '#c084fc'
              }}
            >
              <div className=" alert-danger ">
  <strong>Admin Access Only:</strong>
  This panel is restricted to authorized administrators only.
</div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign In as ${loginMode === 'admin' ? 'Admin' : 'Customer'}`}
          </button>
        </form>
      </div>

      {loginMode === 'customer' && (
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create Customer Account</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
