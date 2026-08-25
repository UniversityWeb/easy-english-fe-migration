import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import {
  Avatar,
  Badge,
  Box,
  Image,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { getUsername, isLoggedIn } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForStudent from '~/components/Drawers/RightSidebarForStudent';
import { FiBell, FiShoppingCart, FiAperture } from 'react-icons/fi';
import { Icon } from '@chakra-ui/icons';
import CartService from '~/services/cartService';
import NotificationService from '~/services/notificationService';
import { websocketConstants } from '~/utils/websocketConstants';
import WebSocketService from '~/services/websocketService';

const NavbarForStudent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [countedCartItems, setCountedCartItems] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchUser = async () => {
    try {
      const user = await AuthService.getCurUser();
      setUser(user);
    } catch (e) {
      console.log(e?.message);
    }
  };

  const fetchCartItems = async () => {
    try {
      const count = await CartService.countCartItems();
      setCountedCartItems(count);
    } catch (e) {
      console.error('Failed to fetch cart items:', e.message);
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

      // Subscribe to cart item updates
      wsService.subscribe(
        websocketConstants.cartItemCountTopic(username),
        async (numberOfCartItems) => {
          setCountedCartItems(numberOfCartItems);
        },
      );

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
    fetchCartItems();
    fetchNotifications();
    initializeWebsocket();

    return () => {
      const username = getUsername();
      WebSocketService.getIns().then((wsService) => {
        wsService.unsubscribe(websocketConstants.cartItemCountTopic(username));
        wsService.unsubscribe(
          websocketConstants.notificationCountTopic(username),
        );
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
        onClick={() => navigate(config.routes.homepage)}
      />
      <div className="navbar--list">
        <div className="navbar--list__gap20" align="center">
          <Button
            id="courses"
            light
            onClick={() => navigate(config.routes.search)}
          >
            Courses
          </Button>

          <Box display="flex" alignItems="center" gap={10}>
            {/* ChatAI Icon */}
            <Box
              position="relative"
              cursor="pointer"
              onClick={() => navigate(config.routes.chat_ai)}
              _hover={{
                transform: 'scale(1.1)',
                transition: '0.2s ease-in-out',
              }}
            >
              <Icon as={FiAperture} boxSize={6} />
            </Box>
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

            {/* Cart Icon */}
            <Box
              position="relative"
              cursor="pointer"
              onClick={() => navigate(config.routes.cart)}
              _hover={{
                transform: 'scale(1.1)',
                transition: '0.2s ease-in-out',
              }}
            >
              <Icon as={FiShoppingCart} boxSize={6} />
              {countedCartItems > 0 && (
                <Badge
                  position="absolute"
                  top="-4"
                  right="-4"
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                >
                  {countedCartItems}
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
              <RightSidebarForStudent
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
};

export default NavbarForStudent;
