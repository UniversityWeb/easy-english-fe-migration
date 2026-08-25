import React, { useEffect, useState } from 'react';
import NavbarForTeacher from './NavbarForTeacher';
import AuthService from '~/services/authService';
import { useNavigate } from 'react-router-dom';
import useCustomToast from '~/hooks/useCustomToast';
import { USER_ROLES } from '~/utils/constants';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import config from '~/config';
import NavbarForAdmin from '~/components/Navbars/NavbarForAdmin';
import { Skeleton } from '@chakra-ui/react';

function RoleBasedNavbar() {
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await AuthService.getCurUser();
        setUserRole(user?.role); // Assume the role field is 'role' in user data
      } catch (error) {
        errorToast('Unable to fetch user role. Please try again.'); // User-friendly error
        navigate(config.routes.login); // Redirect to login if there's an error
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUserRole();
  }, [navigate, errorToast]);

  if (loading) {
    return <Skeleton height="70px" mb={4} />;
  }

  switch (userRole) {
    case USER_ROLES.ADMIN:
      return <NavbarForAdmin />;
    case USER_ROLES.STUDENT:
      return <NavbarForStudent />;
    case USER_ROLES.TEACHER:
      return <NavbarForTeacher />;
    default:
      return <div>Access Denied</div>;
  }
}

export default RoleBasedNavbar;
