import React from 'react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { FiImage, FiSend } from 'react-icons/fi';
import messageService from '~/services/messageService';
import WebSocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';
import PriceDisplay from '~/components/PriceDisplay';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import debounce from 'lodash.debounce';
import ImagePreview from '~/components/ImagePreview';

// Define message types as constants
const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  COURSE_INFO: 'COURSE_INFO',
};

const BASE_URL = 'http://localhost:9000/easy-english';

// Helper function to fix image URLs
const getFullImageUrl = (url) => {
  if (!url) return url;
  // If URL starts with '/', add base URL
  if (url.startsWith('/')) {
    return BASE_URL + url;
  }
  // If URL already has protocol or is base64, return as is
  return url;
};

const getMessageSuggestions = (input) => {
  const predefinedSuggestions = [
    'Hello, how can I help you?',
    'Can you provide more details?',
    'I"m available for a chat.',
    'Let me know if you have any questions.',
    'I would love to assist you!',
  ];

  return predefinedSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(input.toLowerCase()),
  );
};

const CourseCard = ({ courseData }) => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" mt={4}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        maxW="fit-content"
        bg="white"
        boxShadow="sm"
        width="100%"
        _hover={{
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease',
          backgroundColor: '#f8f8f8',
          cursor: 'pointer',
        }}
        onClick={() =>
          navigate(
            config.routes.course_view_detail.replace(
              ':courseId',
              courseData?.id,
            ),
          )
        }
      >
        <Text fontSize="sm" color="gray.600" mb={3} textAlign="center">
          Are you discussing this product with the seller?
        </Text>

        <Flex align="center" flexWrap="wrap">
          <Image
            src={getFullImageUrl(courseData.imagePreview)}
            alt={courseData.title}
            borderRadius="md"
            mr={3}
            maxW="80px"
            maxH="80px"
          />
          <Box flex="1" minW="200px">
            <Text fontSize="sm" fontWeight="bold">
              {courseData.title}
            </Text>
            <PriceDisplay
              priceResponse={courseData?.price}
              primaryColor={'red.500'}
              fontWeight={'regular'}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

const Chat = ({ recipient, courseData, setCourseData }) => {
  const curUsername = getUsername();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isViewerImageOpen, setViewerImageOpen] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { infoToast } = useCustomToast();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!recipient?.username) return;

    try {
      const response = await messageService.getAllMessages(
        curUsername,
        recipient?.username,
        0,
        1000,
      );
      setMessages(response.content || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [curUsername, recipient?.username]);

  useEffect(() => {
    if (recipient) {
      fetchMessages();
    }
  }, [fetchMessages, recipient]);

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.messageTopic(curUsername),
          (message) => {
            const recipientUsername = recipient?.username;
            if (
              recipientUsername === message?.recipientUsername ||
              recipientUsername === message?.senderUsername
            ) {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
          },
        );
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    };

    initializeWebsocket();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.messageTopic(curUsername));
      }
    };
  }, [curUsername, recipient?.username]);

  const sendMessage = async (type = MESSAGE_TYPES.TEXT, content = '') => {
    if (type === MESSAGE_TYPES.TEXT && content.trim() === '' && !selectedImage)
      return;

    if (type === MESSAGE_TYPES.IMAGE) {
      content = await convertToBase64(selectedImage);
      console.log(`image base64 Str: ${content}`);
    }

    const message = {
      type,
      content: content,
      senderUsername: curUsername,
      recipientUsername: recipient?.username,
      sendingTime: new Date().toISOString(),
    };

    if (courseData) {
      const course = {
        id: courseData.id,
        title: courseData.title,
        imagePreview: courseData.imagePreview,
        price: courseData.price,
        owner: courseData.owner,
        createdAt: courseData.createdAt,
        updatedAt: courseData.updatedAt,
        status: courseData.status,
        countStudent: courseData.countStudent,
        rating: courseData.rating,
        ratingCount: courseData.ratingCount,
        topic: courseData.topic,
        level: courseData.level,
        categories: courseData.categories,
      };

      const courseInfo = {
        type: MESSAGE_TYPES.COURSE_INFO,
        content: JSON.stringify(course),
        senderUsername: curUsername,
        recipientUsername: recipient?.username,
        sendingTime: new Date().toISOString(),
      };
      messageService.send(courseInfo);
      setCourseData(null);
    }

    messageService.send(message);
    setMessageContent('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      infoToast('Image selected.');
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${day}-${month}-${year} ${time}`;
  };

  const showPreviewImage = (imageUrl) => {
    setViewerImageOpen(true);
    setImageViewerUrl(getFullImageUrl(imageUrl));
  };

  const debouncedSetSuggestions = useMemo(
    () =>
      debounce((input) => {
        if (input) {
          setSuggestions(getMessageSuggestions(input));
        } else {
          setSuggestions([]);
        }
      }, 300),
    [],
  );

  const handleInputChange = (e) => {
    const newMessageContent = e.target.value;
    setMessageContent(newMessageContent);
    debouncedSetSuggestions(newMessageContent);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessageContent(suggestion); // Insert suggestion into input
    setSuggestions([]); // Clear suggestions
  };

  const SENSITIVE_WORDS = [
    // English
    'fuck',
    'shit',
    'bitch',
    'asshole',
    'bastard',
    'damn',
    'crap',
    'dumb',
    'stupid',
    'hell',
    'slut',
    'whore',
    'nigger',
    'faggot',
    'cunt',
    'dick',
    'cock',
    'pussy',
    'motherfucker',
    'son of a bitch',
    'bullshit',
    'retard',
    'idiot',
    'moron',

    // Vietnamese
    'cấm',
    'chửi',
    'địt',
    'cặc',
    'lồn',
    'buồi',
    'đụ',
    'chó',
    'mẹ kiếp',
    'con mẹ mày',
    'đĩ',
    'đểu',
    'ngu',
    'đần',
    'dốt',
    'khốn nạn',
    'chó chết',
    'vãi',
    'vl',
    'bố láo',
    'vkl',
    'cc',
    'dm',
    'đm',
    'đjt',
    'dkm',
    'mẹ mày',
    'ngu như bò',
    'ngu như chó',
    'mặt lồn',
  ];

  const filterSensitiveContent = (text) => {
    if (!text || typeof text !== 'string') return text;
    const regex = new RegExp(SENSITIVE_WORDS.join('|'), 'gi');
    return text.replace(regex, '***');
  };

  return (
    <Flex h="100%" direction="column">
      <HStack
        bg="white"
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <HStack>
          <Avatar size="md" name={recipient?.username || 'User'} />
          <Text fontSize="lg" fontWeight="bold">
            {recipient?.fullName || recipient?.username}
          </Text>
        </HStack>
      </HStack>

      <Box flex="1" overflowY="auto" p={4} bg="white" ref={scrollRef}>
        <>
          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const showTimeGap =
              prevMsg &&
              new Date(msg.sendingTime) - new Date(prevMsg.sendingTime) >
                24 * 60 * 60 * 1000; // 1 day in milliseconds

            return (
              <React.Fragment key={index}>
                {showTimeGap && (
                  <Text
                    textAlign="center"
                    color="gray.500"
                    my={4}
                    fontSize="sm"
                  >
                    {formatDateTime(msg.sendingTime)}
                  </Text>
                )}

                <HStack
                  justify={
                    msg.senderUsername === curUsername
                      ? 'flex-end'
                      : 'flex-start'
                  }
                  mb={2}
                >
                  {msg.senderUsername !== curUsername && (
                    <Avatar size="sm" name={msg.senderUsername || 'User'} />
                  )}

                  {msg.type === MESSAGE_TYPES.COURSE_INFO ? (
                    <CourseCard courseData={JSON.parse(msg.content)} />
                  ) : (
                    <Box
                      p={3}
                      bg={
                        msg.senderUsername === curUsername
                          ? 'blue.100'
                          : 'gray.200'
                      }
                      borderRadius="md"
                      maxWidth="70%"
                    >
                      {msg.type === MESSAGE_TYPES.IMAGE && msg.content ? (
                        <Image
                          src={getFullImageUrl(msg.content)}
                          alt="Image"
                          maxH="400px"
                          onClick={() => showPreviewImage(msg.content)}
                        />
                      ) : (
                        <Text>{filterSensitiveContent(msg.content)}</Text>
                      )}
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {formatDateTime(msg?.sendingTime)}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </React.Fragment>
            );
          })}

          {courseData && <CourseCard courseData={courseData} />}
        </>
      </Box>

      {imagePreview && (
        <Box p={4} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="sm" mb={2}>
            Image Preview:
          </Text>
          <Image src={imagePreview} alt="Preview" maxH="200px" mb={2} />
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => {
              setSelectedImage(null);
              setImagePreview(null); // Clear the preview
            }}
          >
            Remove Image
          </Button>
        </Box>
      )}

      {/* Suggestion Box */}
      {suggestions.length > 0 && (
        <Box
          bg="gray.50"
          borderTop="1px solid"
          borderColor="gray.200"
          px={4}
          py={2}
        >
          <Text mb={2} fontWeight="medium" color="gray.600">
            Quick Replies
          </Text>
          <Flex wrap="wrap" gap={2}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                leftIcon={<FiSend />}
                onClick={() => handleSuggestionClick(suggestion)}
                _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                colorScheme="blue"
              >
                {suggestion}
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      <HStack
        p={4}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        spacing={2}
      >
        <Input
          disabled={selectedImage}
          placeholder="Type a message..."
          value={messageContent}
          onChange={handleInputChange}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              setMessageContent(messageContent.trim());
              if (selectedImage) {
                await sendMessage(MESSAGE_TYPES.IMAGE);
              } else {
                await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
              }
            }
          }}
          borderRadius="full"
          bg="gray.50"
          _focus={{ bg: 'white', borderColor: 'blue.300' }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <IconButton
            as="span"
            icon={<FiImage />}
            colorScheme="teal"
            variant="ghost"
            borderRadius="full"
            aria-label="Upload image"
          />
        </label>

        <IconButton
          icon={<FiSend />}
          colorScheme="blue"
          onClick={async () => {
            setMessageContent(messageContent.trim());
            if (selectedImage) {
              await sendMessage(MESSAGE_TYPES.IMAGE);
            } else {
              await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
            }
          }}
          borderRadius="full"
          aria-label="Send message"
        />

        <ImagePreview
          isOpen={isViewerImageOpen}
          onClose={setViewerImageOpen}
          imageUrl={imageViewerUrl}
        />
      </HStack>
    </Flex>
  );
};

export default Chat;
