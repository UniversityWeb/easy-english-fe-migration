import React, { useEffect, useRef, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  VStack,
  HStack,
  extendTheme,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import writingResultService from '~/services/writingResultService';
import ReactMarkdown from 'react-markdown';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const messagesEndRef = useRef(null);

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
    <RoleBasedPageLayout>
      <ChakraProvider theme={theme}>
        <VStack h="80vh" justify="center" align="center" p={4}>
          <Box
            w="100%"
            maxW="800px"
            h="100%"
            maxH="90vh"
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
          >
            <Box
              flex="1"
              overflowY="auto"
              p={4}
              sx={{ '&::-webkit-scrollbar': { display: 'none' } }}
            >
              <VStack spacing={4} align="stretch">
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    alignSelf={
                      msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }
                    bg={msg.sender === 'user' ? 'blue.100' : 'gray.200'}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxW="75%"
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Box>
                ))}
                {loading && (
                  <Box alignSelf="flex-start" px={4} py={2}>
                    <Spinner size="sm" />
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>

            <Box p={3} borderTop="1px solid #eee">
              <HStack>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  bg="gray.50"
                  _focus={{ bg: 'white' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleSend}
                  isLoading={loading}
                >
                  Gửi
                </Button>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </ChakraProvider>
    </RoleBasedPageLayout>
  );
}

export default App;
