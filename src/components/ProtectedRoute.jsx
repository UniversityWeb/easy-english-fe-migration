import React from 'react';
import { getCurrentUserRole } from '~/utils/authUtils';
import NotFound from './NotFound';

function ProtectedRoute({ children, allowedRoles }) {
  // Get user role from localStorage
  let userRole = 'ALL'; // default role if not logged in

  try {
    userRole = getCurrentUserRole();
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
  }

  // Check if the user's role is allowed
  if (!allowedRoles.includes(userRole) && !allowedRoles.includes('ALL')) {
    return <NotFound />;
  }

  return children;
}

export default ProtectedRoute;
