import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Register = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: ''
  });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();

  const navigate = useNavigate();


  // HANDLE INPUT
  const handleChange = ({ target }) => {

    setFormData({
      ...formData,
      [target.id]: target.value
    });
  };


  // REGISTER
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    const {
      fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      address
    } = formData;


    // PASSWORD CHECK
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError(
        'Password must be at least 6 characters long'
      );
    }


    setLoading(true);

    try {

      const data = await api.register(
        fullName.trim(),
        email.trim().toLowerCase(),
        password,
        phoneNumber.trim(),
        address.trim()
      );

      // SAVE USER
      loginUser(data);

      // REDIRECT
      navigate('/customer/dashboard');

    } catch (err) {

      setError(
        err.message ||
        'Registration failed. Please try again.'
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-wrapper" style={{ maxWidth: '540px' }}>
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Register as a new customer to access our services</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-danger" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              placeholder="e.g. Nithya"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="e.g. nithya@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem', margin: 0 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-control"
              placeholder="e.g. 9865598524"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <textarea
              id="address"
              className="form-control"
              placeholder="Enter your street name, city, state, pin code"
              rows="2"
              style={{ resize: 'none', fontFamily: 'inherit' }}
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
