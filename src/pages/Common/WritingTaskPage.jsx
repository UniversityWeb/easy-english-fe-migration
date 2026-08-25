import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Tag,
  Badge,
  VStack,
  HStack,
  Textarea,
} from '@chakra-ui/react';
import { CheckIcon, ChatIcon } from '@chakra-ui/icons';
import './WritingTaskPage.scss';
import writingService from '~/services/writingService';
import writingResultService from '~/services/writingResultService';

const WritingTaskPage = ({ infoWriting }) => {
  const [activeTab, setActiveTab] = useState('original');
  const [data, setData] = useState(null);
  const [textSubmit, setTextSubmit] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading

  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await writingResultService.imageToText(formData);
      setTextSubmit(response);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const submitWriting = async () => {
    if (isSubmitting) return; // Tránh submit nhiều lần

    setIsSubmitting(true); // Bật loading

    const writingRequest = {
      submittedText: textSubmit,
      writingTaskId: infoWriting?.id,
      feedback: null,
      status: 'SUBMITTED',
    };

    try {
      await writingResultService.createWritingResult(writingRequest);
      setIsSubmit(true);
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    } finally {
      setIsSubmitting(false); // Tắt loading
    }
  };

  useEffect(() => {
    const fetchWriting = async () => {
      debugger;
      const writingRequest = {
        writingTaskId: infoWriting?.id,
      };
      try {
        const result =
          await writingResultService.getWritingResult(writingRequest);
        if (result) {
          const content = result?.content?.[0];
          if (result?.content?.length > 0) {
            setIsSubmit(true);
          } else {
            setIsSubmit(false);
          }
          setTextSubmit(content?.submittedText || '');
          const feedback = content?.feedback;
          if (feedback) {
            setData(JSON.parse(feedback));
            setHasFeedback(true);
          } else {
            setHasFeedback(false);
          }
        }
      } catch (error) {
        console.error(error?.message);
      }
    };

    fetchWriting();
  }, [infoWriting?.id]);

  console.log('isSubmit ' + isSubmit);
  return (
    <Container maxW="container.xl" bg="#FAE6D8" p={4} borderRadius="md">
      {/* Tabs */}
      <Flex gap={3} mb={4}>
        {hasFeedback && (
          <>
            <Button
              colorScheme={activeTab === 'original' ? 'orange' : 'gray'}
              fontWeight={activeTab === 'original' ? 'bold' : 'normal'}
              onClick={() => setActiveTab('original')}
            >
              Original Essay
            </Button>
            <Button
              colorScheme={activeTab === 'highlight' ? 'orange' : 'gray'}
              fontWeight={activeTab === 'highlight' ? 'bold' : 'normal'}
              onClick={() => setActiveTab('highlight')}
            >
              AI Edits
            </Button>
            <Button
              colorScheme={activeTab === 'upgrade' ? 'orange' : 'gray'}
              fontWeight={activeTab === 'upgrade' ? 'bold' : 'normal'}
              onClick={() => setActiveTab('upgrade')}
            >
              Upgrade Suggestions
            </Button>
            <Button
              colorScheme={activeTab === 'sample' ? 'orange' : 'gray'}
              fontWeight={activeTab === 'sample' ? 'bold' : 'normal'}
              onClick={() => setActiveTab('sample')}
            >
              Sample from AI
            </Button>
          </>
        )}
      </Flex>

      <Flex gap={4} align="start">
        {/* Nội dung chính */}
        <Box
          flex={hasFeedback ? '2' : '1'}
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="md"
          width={hasFeedback ? 'auto' : '100%'}
        >
          <Text fontWeight="bold">
            Word count: {textSubmit?.split(' ').length || 0}/250
          </Text>
          <Box
            border="1px solid #000"
            p={4}
            my={4}
            borderRadius="md"
            fontWeight="bold"
          >
            {infoWriting?.instructions}
          </Box>

          {/* Nếu là tab bài gốc */}
          {activeTab === 'original' && (
            <>
              {!isSubmit && (
                <HStack spacing={4} my={4}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Button
                    leftIcon={<ChatIcon />}
                    variant="outline"
                    onClick={handleImageClick}
                  >
                    Ảnh
                  </Button>
                  <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="green"
                    onClick={submitWriting}
                    isLoading={isSubmitting}
                    loadingText="Đang nộp..."
                    disabled={isSubmitting}
                  >
                    Nộp bài
                  </Button>
                </HStack>
              )}

              <Textarea
                value={textSubmit}
                height={500}
                onChange={(e) => setTextSubmit(e.target.value)}
              />
            </>
          )}

          {activeTab === 'highlight' && (
            <div
              className="fix-by-ai"
              dangerouslySetInnerHTML={{ __html: data?.fixByAI }}
            />
          )}

          {activeTab === 'upgrade' && (
            <div
              className="upgrade-by-ai"
              dangerouslySetInnerHTML={{ __html: data?.upgradeByAI }}
            />
          )}

          {activeTab === 'sample' && (
            <div dangerouslySetInnerHTML={{ __html: data?.sampleByAI }} />
          )}
        </Box>

        {/* Sidebar - chỉ hiển thị khi có feedback */}
        {hasFeedback && (
          <Box flex="1">
            <VStack
              align="start"
              spacing={3}
              bg="white"
              p={4}
              borderRadius="md"
              mt={4}
              boxShadow="md"
            >
              <HStack>
                <Badge colorScheme="yellow">Grammar</Badge>
                <Badge colorScheme="green">Vocabulary</Badge>
              </HStack>
              {data?.errorGrammarAndVocabulary?.map((item, index) => (
                <Text key={index} bg="gray.100" p={3} borderRadius="md">
                  {item.error}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default WritingTaskPage;
