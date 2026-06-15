import React, { useState } from 'react';

import {
  useParams,
  useNavigate,
  Link
} from 'react-router-dom';

import { api } from '../services/api';


const ResetPassword = () => {

  const { token } = useParams();

  const navigate = useNavigate();


  // STATES
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // SUBMIT FORM
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');


    // CHECK PASSWORD MATCH
    if (password !== confirmPassword) {

      return setError('Passwords do not match');
    }


    setLoading(true);

    try {

      // RESET PASSWORD API
      await api.resetPassword(token, password);


      setSuccess(
        'Password reset successful'
      );


      // REDIRECT TO LOGIN
      setTimeout(() => {

        navigate('/login');

      }, 2000);

    } catch (err) {

      setError(
        'Reset password failed'
      );

    } finally {

      setLoading(false);
    }
  };




  return (
    <div
      className="auth-wrapper"
      style={{ maxWidth: '480px' }}
    >

      <div className="auth-header">

        <h1>
          Set New Password
        </h1>

        <p>
          Enter your new password
        </p>

      </div>




      <div className="card">


        {/* ERROR */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}


        {/* SUCCESS */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}




        {!success ? (

          <form onSubmit={handleSubmit}>


            {/* PASSWORD */}
            <div className="form-group">

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>




            {/* CONFIRM PASSWORD */}
            <div className="form-group">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </div>




            {/* BUTTON */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '1rem'
              }}
              disabled={loading}
            >

              {loading
                ? 'Updating...'
                : 'Reset Password'}

            </button>

          </form>

        ) : (

          <div style={{
            textAlign: 'center',
            padding: '1rem 0'
          }}>

            Redirecting to login...

          </div>
        )}

      </div>

    </div>
  );
};


export default ResetPassword;
