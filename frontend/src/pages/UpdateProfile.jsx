import React, {
  useState,
  useEffect
} from 'react';

import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';

import { useAuth } from '../context/AuthContext';


const UpdateProfile = () => {

  const navigate = useNavigate();

  const { updateCurrentUser } = useAuth();


  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });


  // STATES
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');



  // FETCH PROFILE
  useEffect(() => {

    const getProfile = async () => {

      try {

        const user = await api.getProfile();

        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          password: '',
          confirmPassword: ''
        });

      } catch (err) {

        setError('Failed to load profile');

      } finally {

        setLoading(false);
      }
    };

    getProfile();

  }, []);




  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };




  // SUBMIT FORM
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');


    // CHECK PASSWORD
    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      return setError('Passwords do not match');
    }


    setUpdating(true);

    try {

      const updatedData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      };


      // ADD PASSWORD IF ENTERED
      if (formData.password) {
        updatedData.password = formData.password;
      }


      // UPDATE PROFILE
      const updatedUser = await api.updateProfile(updatedData);


      // UPDATE CONTEXT
      updateCurrentUser({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address
      });


      setSuccess('Profile updated successfully');


      // CLEAR PASSWORD
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });


      // REDIRECT
      setTimeout(() => {
        navigate('/customer/profile');
      }, 1500);

    } catch (err) {

      setError('Update Failed');

    } finally {

      setUpdating(false);
    }
  };




  // LOADING SCREEN
  if (loading) {

    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem'
      }}>
        Loading...
      </div>
    );
  }




  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto'
    }}>

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Update Profile
          </h1>

          <p className="page-subtitle">
            Modify your details
          </p>

        </div>

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




        <form onSubmit={handleSubmit}>


          {/* FULL NAME */}
          <div className="form-group">

            <label className="form-label">
              Full Name
            </label>

            <input
              type="text"
              id="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

          </div>




          {/* EMAIL */}
          <div className="form-group">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>




          {/* PHONE */}
          <div className="form-group">

            <label className="form-label">
              Phone Number
            </label>

            <input
              type="text"
              id="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

          </div>




          {/* ADDRESS */}
          <div className="form-group">

            <label className="form-label">
              Address
            </label>

            <textarea
              id="address"
              className="form-control"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
            />

          </div>




          {/* PASSWORD SECTION */}
          <div style={{
            marginTop: '1rem',
            borderTop: '1px solid gray',
            paddingTop: '1rem'
          }}>

            <h3>
              Change Password
            </h3>


            <div
              className="grid grid-cols-2"
              style={{ gap: '1rem' }}
            >

              <div className="form-group">

                <label className="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />

              </div>




              <div className="form-group">

                <label className="form-label">
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

              </div>

            </div>
          </div>




          {/* BUTTONS */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Profile'}
            </button>



            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() =>
                navigate('/customer/profile')
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default UpdateProfile;
