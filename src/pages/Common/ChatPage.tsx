import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import servicesService from '~/services/messageService';
import { useLocation, useNavigate } from 'react-router-dom';
import Chat from '~/components/Chat';
import WebSocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import { getUsername } from '~/utils/authUtils';
import { Button } from 'antd';

const PAGE_SIZE = 10;

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { returnUrl, targetCourse } = location.state || {};
  const [courseData, setCourseData] = useState(targetCourse);
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const username = getUsername();

  const fetchRecentChats = useCallback(async () => {
    if (loading || isLastPage) return;

    setLoading(true);
    try {
      const response = await servicesService.getRecentChats(page, PAGE_SIZE);
      const content = response.content || [];

      setRecentUsers((prev) => [...prev, ...content]);
      setIsLastPage(response.last);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch recent chats:', error);
    } finally {
      setLoading(false);
    }
  }, [isLastPage, loading, page]);

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.recentChatsTopic(username),
          (message) => {
            const { senderUsername, recipientUsername, content, sendingTime } =
              message;

            const chatPartner =
              senderUsername === username ? recipientUsername : senderUsername;

            setRecentUsers((prevUsers) => {
              const existingUserIndex = prevUsers.findIndex(
                (user) => user.username === chatPartner,
              );

              if (existingUserIndex !== -1) {
                const updatedUser = {
                  ...prevUsers[existingUserIndex],
                  lastMessage: content,
                  lastMessageTime: sendingTime,
                };
                const updatedUsers = [...prevUsers];
                updatedUsers.splice(existingUserIndex, 1);
                return [updatedUser, ...updatedUsers];
              }

              return [
                {
                  username: chatPartner,
                  lastMessage: content,
                  lastMessageTime: sendingTime,
                  fullName: chatPartner,
                },
                ...prevUsers,
              ];
            });
          },
        );

        wsService.subscribe(
          websocketConstants.onlineUsersTopic,
          (onlineUsernames) => {
            setRecentUsers((prevUsers) =>
              prevUsers.map((user) => ({
                ...user,
                isOnline: onlineUsernames.includes(user.username),
              })),
            );
          },
        );
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    };

    initializeWebsocket();
    fetchRecentChats();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.recentChatsTopic(username));
        wsService.unsubscribe(websocketConstants.onlineUsersTopic);
      }
    };
  }, [fetchRecentChats, username]);

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
  };

  // Chỉ chạy khi có targetCourse và chưa được xử lý
  useEffect(() => {
    if (targetCourse?.ownerUsername || targetCourse?.owner?.username) {
      setSelectedRecipient({
        username: targetCourse.owner?.username || targetCourse.ownerUsername,
        fullName: targetCourse.owner?.fullName || targetCourse.ownerFullName,
      });
    }
  }, [targetCourse]); // Dependency vào targetCourse

  const handleBack = () => {
    setSelectedRecipient(null);
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <Flex h="100vh" w="100vw" bg="gray.100" overflow="hidden">
      <Box
        w="300px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
        p={4}
      >
        <HStack mb={4}>
          <Icon
            as={IoArrowBack}
            boxSize={5}
            color="gray.600"
            onClick={handleBack}
            cursor="pointer"
          />
          <Text fontSize="xl" fontWeight="bold">
            Recent Chats
          </Text>
        </HStack>
        <VStack align="stretch" spacing={3}>
          {recentUsers.map((user) => (
            <HStack
              key={user?.username}
              p={3}
              bg={
                selectedRecipient?.username === user?.username
                  ? 'blue.100'
                  : 'gray.50'
              }
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleRecipientSelect(user)}
            >
              <Flex position="relative" w="fit-content">
                <Avatar
                  size="sm"
                  name={user?.fullName || user?.username || 'User'}
                  src={user?.avatarPath || undefined}
                />
                {user?.isOnline && (
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg="green.400"
                    borderWidth="2px"
                    borderColor="white"
                    borderRadius="full"
                    width="12px"
                    height="12px"
                  />
                )}
              </Flex>
              <Box flex="1">
                <Text fontWeight="bold">
                  {user?.fullName || user?.username}
                </Text>
              </Box>
            </HStack>
          ))}
          {!isLastPage && (
            <div style={{ marginTop: '1rem' }}>
              <Button
                type="secondary"
                onClick={fetchRecentChats}
                loading={loading}
                disabled={loading}
                style={{
                  transition: 'transform 0.3s, background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#1890ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
          {loading && (
            <Flex justify="center" py={4}>
              <Spinner size="sm" />
            </Flex>
          )}
        </VStack>
      </Box>

      <Flex flex="1" direction="column" bg="gray.50">
        {selectedRecipient ? (
          <Chat
            recipient={selectedRecipient}
            courseData={courseData}
            setCourseData={setCourseData}
          />
        ) : (
          <Flex
            flex="1"
            align="center"
            justify="center"
            bg="white"
            borderRadius="md"
            shadow="md"
          >
            <Text fontSize="xl" color="gray.500">
              Select a conversation to start chatting.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatPage;
