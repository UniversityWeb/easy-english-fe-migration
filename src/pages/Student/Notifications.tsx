import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Container, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Import motion
import notificationService from '~/services/notificationService';
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';
import { formatDate } from '~/utils/methods';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { websocketConstants } from '~/utils/websocketConstants';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import WebSocketService from '~/services/websocketService';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const Notifications = () => {
  const username = getUsername();
  const { successToast, errorToast, infoToast } = useCustomToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.notificationTopic(username),
          (notification) => {
            console.log(`Received message: ${JSON.stringify(notification)}`);
            setNotifications((prev) => [notification, ...prev]);
            infoToast('You have a new message');
          },
        );
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    };

    initializeWebsocket();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.notificationTopic(username));
      }
    };
  }, []);

  useEffect(() => {
    fetchNotifications(page).catch((error) => {
      console.error('Error fetching notifications:', error);
    });
  }, [page, username]);

  const fetchNotifications = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotificationsByUsername(
        username,
        pageNumber,
        10,
      );
      const notifications = response.content;
      console.log(`data: ${notifications}`);
      setNotifications(notifications || []);
      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      console.log(error?.message);
      errorToast('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  const handleNotificationClick = async (id, url) => {
    handleMarkAsRead(id);
    if (url) {
      try {
        navigate(url);
      } catch (error) {
        console.log(error?.message);
        errorToast('Error marking notification as read');
      }
    } else {
      errorToast("Cannot find target page");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      successToast('Notification marked as read');
      await fetchNotifications(page);
    } catch (error) {
      console.log(error?.message);
      errorToast('Error marking notification as read');
    }
  };

  return (
    <RoleBasedPageLayout>
      <Container maxW="80%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Notifications
        </Text>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Stack spacing={4} mt={6} px={6}>
            {notifications.length === 0 ? (
              <Text fontSize="xl" color="gray.500" textAlign="center">
                No notifications available.
              </Text>
            ) : (
              notifications.map((notification) => (
                <MotionBox
                  key={notification?.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  shadow="md"
                  backgroundColor={notification?.read ? 'gray.100' : 'white'}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  cursor="pointer"
                  _hover={{
                    backgroundColor: notification?.read ? 'white' : 'blue.50',
                    boxShadow: notification?.read ? 'none' : 'lg',
                  }}
                  initial={{ opacity: 0, x: 50 }} // Initial state (invisible, offset)
                  animate={{ opacity: 1, x: 0 }} // Animate to this state (visible, no offset)
                  transition={{ duration: 0.5 }} // Animation duration
                >
                  <Flex
                    flex="1"
                    direction="row"
                    onClick={() => handleNotificationClick(notification?.id, notification?.url)}
                    mr={5}
                  >
                    <Image
                      src={notification?.previewImage}
                      alt="Notification"
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                      mr={5}
                    />
                    <Box>
                      <Text>{notification?.message}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(notification?.createdDate)}
                      </Text>
                      {!notification?.read && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main notification click
                            handleMarkAsRead(notification?.id);
                          }}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </Box>
                  </Flex>
                  <Flex alignItems="center" gap={4}>
                    <Badge colorScheme={notification?.read ? 'green' : 'red'}>
                      {notification?.read ? 'READ' : 'UNREAD'}
                    </Badge>
                  </Flex>
                </MotionBox>
              ))
            )}
            <Flex justify="center" align="center" mt={6} mb={50} gap={10}>
              <Button
                onClick={handlePreviousPage}
                disabled={page === 0}
                colorScheme={page === 0 ? 'gray' : 'blue'}
                size="md"
                variant="outline"
                leftIcon={page > 0 ? <FaArrowLeft /> : null}
                _hover={{
                  bg: page > 0 ? 'blue.500' : '',
                  color: page > 0 ? 'white' : '',
                }}
              >
                Prev
              </Button>

              <Text fontSize="sm" color="gray.600">
                Page {page + 1} of {totalPages}
              </Text>

              <Button
                onClick={handleNextPage}
                disabled={page === totalPages - 1}
                colorScheme={page === totalPages - 1 ? 'gray' : 'blue'}
                size="md"
                variant="outline"
                rightIcon={page < totalPages - 1 ? <FaArrowRight /> : null}
                _hover={{
                  bg: page < totalPages - 1 ? 'blue.500' : '',
                  color: page < totalPages - 1 ? 'white' : '',
                }}
              >
                Next
              </Button>
            </Flex>
          </Stack>
        )}
      </Container>
    </RoleBasedPageLayout>
  );
};

export default Notifications;
