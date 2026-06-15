import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        CustSphere
      </Link>

      <ul className="nav-links">
        {!user ? (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Register
              </NavLink>
            </li>
          </>
        ) : user.role === 'admin' ? (
          <>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Customer List
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/customer/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/customer/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                My Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/customer/profile/update" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Update Profile
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {user && (
        <div className="nav-user-info">
          <span className="user-badge">{user.role.toUpperCase()}</span>
          <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500 }}>
            {user.fullName}
          </span>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
