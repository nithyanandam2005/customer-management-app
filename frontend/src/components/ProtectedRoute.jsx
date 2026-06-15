import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
  allowedRoles
}) => {

  const { user } = useAuth();


  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // WRONG ROLE
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    return (
      <Navigate
        to={
          user.role === 'admin'
            ? '/admin/dashboard'
            : '/customer/dashboard'
        }
        replace
      />
    );
  }
  // ALLOW ACCESS
  return children;
};


export default ProtectedRoute;
