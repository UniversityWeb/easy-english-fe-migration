import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Input,
  VStack,
  Flex,
  Text,
  HStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import writingResultService from '~/services/writingResultService'; // sửa path nếu cần
import ReactMarkdown from 'react-markdown';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) {
      toast({
        title: 'Vui lòng nhập nội dung câu hỏi.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Tạo chuỗi lịch sử hội thoại
      let conversationHistory = updatedMessages
        .map(
          (msg) =>
            `${msg.sender === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.text}`,
        )
        .join('\n');

      // Escape dấu ngoặc kép (") để tránh lỗi JSON
      conversationHistory = conversationHistory.replace(/\\/g, '\\\\'); // escape dấu \
      conversationHistory = conversationHistory.replace(/"/g, '\\"'); // escape dấu "

      const writingRequest = {
        submittedText: conversationHistory,
      };

      const response = await writingResultService.chatWithAI(writingRequest);

      // Nếu API trả về dạng object, lấy trường text, nếu trả về chuỗi thì dùng luôn
      let botReply =
        typeof response === 'string'
          ? response
          : response?.text || 'Xin lỗi, tôi chưa hiểu câu hỏi.';

      // Loại bỏ prefix "Trợ lý: " nếu có ở đầu botReply
      if (botReply.startsWith('Trợ lý:')) {
        botReply = botReply.replace(/^Trợ lý:\s*/, '');
      }

      const botMessage = { id: Date.now() + 1, sender: 'bot', text: botReply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra khi gửi câu hỏi.',
        description: error.message || error.toString(),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="1000">
      {isOpen ? (
        <Box
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="xl"
          p="3"
          width="300px"
          height="400px"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Flex justify="space-between" align="center" mb="2">
            <Text fontWeight="bold">Chat hỗ trợ</Text>
            <IconButton
              size="sm"
              icon={<CloseIcon />}
              aria-label="Đóng chat"
              onClick={toggleChat}
            />
          </Flex>

          {/* Messages */}
          <Box flex="1" overflowY="auto" mb="2" px="1">
            <VStack spacing={2} align="stretch">
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                  bg={msg.sender === 'user' ? 'blue.100' : 'gray.200'}
                  px="3"
                  py="2"
                  borderRadius="lg"
                  maxW="80%"
                  fontSize="sm"
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </Box>
              ))}
              {loading && (
                <Box alignSelf="flex-start" px="3" py="2">
                  <Spinner size="sm" />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Input */}
          <HStack spacing="2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              size="sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleSend}
              isLoading={loading}
            >
              Gửi
            </Button>
          </HStack>
        </Box>
      ) : (
        <IconButton
          icon={<ChatIcon />}
          isRound
          size="lg"
          colorScheme="teal"
          aria-label="Mở chat"
          onClick={toggleChat}
        />
      )}
    </Box>
  );
};

export default ChatBox;
