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
import { MdAdd, MdChat, MdDashboard, MdLogout } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import AuthService from '~/services/authService';
import { IoBarChartOutline } from 'react-icons/io5';
import { FaBoxOpen } from 'react-icons/fa';
import { PiWarningCircleBold } from 'react-icons/pi';

const menuItems = [
  {
    label: 'Dashboard',
    icon: MdDashboard,
    route: config.routes.course_management_for_teacher,
  },
  { label: 'Add Course', icon: MdAdd, route: config.routes.maincourse },
  {
    label: 'Bundles',
    icon: FaBoxOpen,
    route: config.routes.bundle,
  },
  {
    label: 'Add Bundle',
    icon: FaBoxOpen,
    route: config.routes.bundle_add,
  },
  { label: 'Chat', icon: MdChat, route: config.routes.chat },
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
  {
    label: 'Dropout Risk',
    icon: PiWarningCircleBold,
    route: config.routes.student_drop,
  },
  // {
  //   label: 'Analyst Reviews',
  //   icon: FaRegStar,
  //   route: config.routes.analytics_reviews,
  // },
];

function RightSidebarForTeacher({ isOpen, onClose, user, isUserLoading }) {
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
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent backgroundColor="white" maxWidth={'230px'} width="auto">
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
            <Avatar
              size="md"
              cursor="pointer"
              name={user?.fullName}
              src={user?.avatarPath}
            />
            {!isLoggedIn() || isUserLoading ? (
              <Skeleton height="20px" width="100%" />
            ) : (
              <Text fontSize="lg">{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px">
            {menuItems.map((item, index) => (
              <SidebarItem
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
}

export default React.memo(RightSidebarForTeacher);
