import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import { Avatar, Badge, Box, Image, Spacer, useDisclosure } from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { getUsername, isLoggedIn } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForAdmin from '~/components/Drawers/RightSidebarForAdmin';
import { FiBell } from 'react-icons/fi';
import { Icon } from '@chakra-ui/icons';
import NotificationService from '~/services/notificationService';
import WebSocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';

const NavbarForAdmin = React.memo((props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchUser = async () => {
    try {
      const user = await AuthService.getCurUser();
      setUser(user);
    } catch (e) {
      console.log(e?.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const count = await NotificationService.countUnreadNotifications();
      setNotificationCount(count);
    } catch (e) {
      console.error('Failed to fetch notifications:', e.message);
    }
  };

  const initializeWebsocket = async () => {
    const username = getUsername();
    try {
      const wsService = await WebSocketService.getIns();

      // Subscribe to notification updates
      wsService.subscribe(
        websocketConstants.notificationCountTopic(username),
        async (numberOfUnreadNotifications) => {
          setNotificationCount(numberOfUnreadNotifications);
        },
      );
    } catch (error) {
      console.error('WebSocket initialization failed:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotifications();
    initializeWebsocket();

    return () => {
      const username = getUsername();
      WebSocketService.getIns().then((wsService) => {
        wsService.unsubscribe(websocketConstants.notificationCountTopic(username));
      });
    };
  }, []);

  return (
    <div className="navbar">
      <Image
        src={TransientAppLogo}
        alt="Logo"
        style={{ width: '100px', height: '100px' }}
        ms={5}
      />
      <div className="navbar--list">
        <div className="navbar--list__gap20" align="center">
          <Button
            id="courses"
            light
            onClick={() => navigate(config.routes.search)}
          >
            Search
          </Button>

          <Spacer />
          <Box display="flex" alignItems="center" gap={4}>
            {/* Notification Icon */}
            <Box
              position="relative"
              cursor="pointer"
              onClick={() => navigate(config.routes.notifications)}
              _hover={{
                transform: 'scale(1.1)',
                transition: '0.2s ease-in-out',
              }}
            >
              <Icon as={FiBell} boxSize={6} />
              {notificationCount > 0 && (
                <Badge
                  position="absolute"
                  top="-4"
                  right="-4"
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                >
                  {notificationCount}
                </Badge>
              )}
            </Box>
          </Box>
          <Spacer />
          {isLoggedIn() ? (
            <>
              <div className="navbar__group">
                <Avatar
                  size="md"
                  cursor="pointer"
                  name={user?.fullName}
                  onClick={onOpen}
                  src={user?.avatarPath}
                />
              </div>
              <RightSidebarForAdmin
                user={user}
                isUserLoading={user === null || user === undefined}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          ) : (
            <Button
              id="login"
              light
              onClick={() => navigate(config.routes.login)}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default NavbarForAdmin;
