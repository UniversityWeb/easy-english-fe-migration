import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import styles from './Drawer.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  MdLogout,
  MdOutlineShoppingBag,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { IoBookOutline, IoChatboxOutline } from 'react-icons/io5';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import { FaRegStar } from 'react-icons/fa';
import AuthService from '~/services/authService';

const menuItems = [
  {
    label: 'Enrolled Courses',
    icon: IoBookOutline,
    route: config.routes.enroll_course,
  },
  { label: 'My Cart', icon: MdOutlineShoppingCart, route: config.routes.cart },
  {
    label: 'My Orders',
    icon: MdOutlineShoppingBag,
    route: config.routes.orders,
  },
  { label: 'Wishlist', icon: FaRegStar, route: config.routes.favourite },
  { label: 'Chat', icon: IoChatboxOutline, route: config.routes.chat },
  {
    label: 'Writing Tasks',
    icon: IoChatboxOutline,
    route: config.routes.writing_task,
  },
];

const RightSidebarForStudent = (props) => {
  const user = props.user;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      removeLoginResponse();
      navigate(config.routes.login);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={props?.isOpen}
      placement="right"
      onClose={props.onClose}
      size={'sm'}
    >
      <DrawerOverlay />
      <DrawerContent
        backgroundColor={'var(--white)'}
        maxWidth={'230px'}
        width="auto"
      >
        <DrawerHeader borderBottomWidth="1px">
          <Box
            display="flex"
            alignItems="center"
            gap="4%"
            justifyContent="start"
            onClick={() => navigate(config.routes.user_profile_edit)}
            _hover={{
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
            }}
          >
            <Avatar size="md" name={user?.fullName} src={user?.avatarPath} />
            {!isLoggedIn() || props?.isUserLoading ? (
              <Skeleton height="20px" width="100vh" />
            ) : (
              <Text className={styles.drawer__heading}>{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.label}
                handleClick={() => navigate(item.route)}
              />
            ))}

            <SidebarItem
              icon={MdLogout}
              text="Logout"
              handleClick={handleLogout}
              isLoading={isLoading}
            />
          </VStack>
        </DrawerBody>

        <DrawerFooter padding={0}>
          <VStack>
            <Image width={'100%'} objectFit="cover" alt="" />
            <Image width={'100%'} objectFit="cover" alt="" />
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RightSidebarForStudent;
