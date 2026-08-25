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
import { MdLogout } from 'react-icons/md';
import {
  IoBarChartOutline,
  IoBookOutline,
  IoListOutline,
} from 'react-icons/io5';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import { FaUserEdit } from 'react-icons/fa';
import AuthService from '~/services/authService';
import { BsGraphUpArrow } from 'react-icons/bs';

const menuItems = [
  {
    label: 'Courses',
    icon: IoBookOutline,
    route: config.routes.course_management_for_admin,
  },
  {
    label: 'Categories',
    icon: IoListOutline,
    route: config.routes.category_for_admin,
  },
  {
    label: 'Topics And Levels',
    icon: IoBarChartOutline,
    route: config.routes.topic_level_for_admin,
  },
  {
    label: 'Users Management',
    icon: FaUserEdit,
    route: config.routes.user_management,
  },
  {
    label: 'Analyst Courses',
    icon: IoBarChartOutline,
    route: config.routes.analytics_courses,
  },
  {
    label: 'Gradebook',
    icon: BsGraphUpArrow,
    route: config.routes.gradebook,
  },
];

const RightSidebarForAdmin = React.memo((props) => {
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
    <Drawer isOpen={props?.isOpen} placement="right" onClose={props.onClose}>
      <DrawerOverlay />
      <DrawerContent
        backgroundColor="var(--white)"
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
              <Skeleton height="20px" width="200px" />
            ) : (
              <Text className={styles.drawer__heading}>{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px" align="stretch" padding="8px">
            {/* Management Section */}
            <Box paddingTop="10px" paddingBottom="5px">
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="gray.500"
                paddingLeft="10px"
              >
                Management
              </Text>
            </Box>
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.label}
                handleClick={() => navigate(item.route)}
              />
            ))}

            {/* Account Section */}
            <Box paddingTop="10px" paddingBottom="5px">
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="gray.500"
                paddingLeft="10px"
              >
                Account
              </Text>
            </Box>
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
            <Image width="100%" objectFit="cover" alt="" />
            <Image width="100%" objectFit="cover" alt="" />
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

export default RightSidebarForAdmin;
