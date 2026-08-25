import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Badge,
  VStack,
  HStack,
  Textarea,
  List,
  ListItem,
  Divider,
  Spinner,
  Fade,
  ScaleFade,
} from '@chakra-ui/react';
import { CheckIcon, ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import writingResultService from '~/services/writingResultService';

const SupportWriting = ({ infoWriting }) => {
  const [activeTab, setActiveTab] = useState('original');
  const [data, setData] = useState(null);
  const [textSubmit, setTextSubmit] = useState('');
  const [writingList, setWritingList] = useState([]);
  const [selectedWriting, setSelectedWriting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const submitWriting = async () => {
    const writingRequest = {
      submittedText: textSubmit,
    };

    setIsLoading(true);
    try {
      const response =
        await writingResultService.supportWriting(writingRequest);
      setData(response);
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedBack = async () => {
    const writingRequest = {
      id: selectedWriting.id,
      submittedText: selectedWriting.submittedText,
      writingTaskId: selectedWriting.writingTaskId,
      feedback: JSON.stringify(data),
      status: 'FEEDBACK_PROVIDED',
    };

    setIsLoading(true);
    try {
      await writingResultService.updateWritingResult(
        writingRequest.id,
        writingRequest,
      );

      setSelectedWriting(null);
      setData(null);
      setTextSubmit('');
      await fetchWritingList(true);
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWritingList = async (isReloadAction = false) => {
    if (!writingList.length || isReloadAction) {
      isReloadAction ? setIsReloading(true) : setIsLoadingList(true);
    }

    try {
      const writingRequest = {
        writingTaskId: infoWriting.id,
        ownerUsername: '',
        status: 'SUBMITTED',
        pageNumber: 0,
        size: 8,
      };

      if (infoWriting?.id) {
        const writingListResponse =
          await writingResultService.getWritingResult(writingRequest);
        if (isReloadAction) await new Promise((res) => setTimeout(res, 300));
        setWritingList(writingListResponse.content);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
    } finally {
      setIsLoadingList(false);
      setIsReloading(false);
    }
  };

  const handleReloadList = async () => await fetchWritingList(true);

  useEffect(() => {
    fetchWritingList();
  }, [infoWriting]);

  const handleSelectWriting = (writing) => {
    setSelectedWriting(writing);
    setTextSubmit(writing.submittedText || '');
    setData(writing.feedback ? JSON.parse(writing.feedback) : null);
    setActiveTab('original');
  };

  const handleBack = () => {
    setSelectedWriting(null);
    setData(null);
    setTextSubmit('');
  };

  const renderWritingList = () => {
    if (isLoadingList && !writingList.length) {
      return (
        <Fade in={true}>
          <Flex justify="center" p={8}>
            <VStack spacing={3}>
              <Spinner size="lg" color="blue.500" thickness="4px" />
              <Text color="gray.600">Loading essays...</Text>
            </VStack>
          </Flex>
        </Fade>
      );
    }

    return (
      <Box position="relative">
        {isReloading && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="white"
            opacity="0.8"
            zIndex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
          >
            <VStack spacing={2}>
              <Spinner size="md" color="blue.500" thickness="3px" />
              <Text fontSize="sm" color="gray.600">
                Refreshing...
              </Text>
            </VStack>
          </Box>
        )}

        <Fade in={!isReloading} transition={{ duration: 0.3 }}>
          <List spacing={2}>
            {writingList.map((item, index) => (
              <ScaleFade
                key={item.id || index}
                in={!isReloading}
                initialScale={0.95}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ListItem
                  p={3}
                  borderRadius="md"
                  bg="gray.50"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: 'orange.100',
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm',
                  }}
                  onClick={() => !isReloading && handleSelectWriting(item)}
                  opacity={isReloading ? 0.6 : 1}
                >
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">{item.ownerUsername}</Text>
                    <Badge
                      colorScheme={
                        item.status === 'SUBMITTED' ? 'yellow' : 'green'
                      }
                    >
                      {item.status}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Submitted{' '}
                    {new Date(item.createdAt).toLocaleDateString() ||
                      'Recently'}
                  </Text>
                </ListItem>
                {index < writingList.length - 1 && <Divider />}
              </ScaleFade>
            ))}
          </List>
        </Fade>
      </Box>
    );
  };

  return (
    <Container maxW="container.xl" bg="#FAE6D8" p={4} borderRadius="md">
      {!selectedWriting && (
        <Fade in={true}>
          <Box bg="white" p={4} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" fontSize="lg">
                Submitted Essays
              </Text>
              <Button
                leftIcon={isReloading ? <Spinner size="xs" /> : <RepeatIcon />}
                colorScheme="blue"
                size="sm"
                onClick={handleReloadList}
                isLoading={isReloading}
                loadingText="Refreshing..."
                disabled={isReloading}
                transition="all 0.2s ease"
                _hover={{
                  transform: !isReloading ? 'scale(1.05)' : 'none',
                }}
              >
                {isReloading ? 'Refreshing...' : 'Reload'}
              </Button>
            </Flex>

            {renderWritingList()}

            {!isLoadingList && !isReloading && writingList.length === 0 && (
              <Fade in={true}>
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No essays submitted yet</Text>
                </Box>
              </Fade>
            )}
          </Box>
        </Fade>
      )}

      {selectedWriting && (
        <Fade in={true}>
          <Button
            leftIcon={<ArrowBackIcon />}
            mb={4}
            colorScheme="gray"
            onClick={handleBack}
            transition="all 0.2s ease"
            _hover={{ transform: 'translateX(-2px)' }}
          >
            Back to List
          </Button>

          <Flex gap={3} mb={4}>
            {['original', 'highlight', 'upgrade', 'sample'].map((tab) => (
              <Button
                key={tab}
                colorScheme={activeTab === tab ? 'orange' : 'gray'}
                fontWeight={activeTab === tab ? 'bold' : 'normal'}
                onClick={() => setActiveTab(tab)}
                transition="all 0.2s ease"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm',
                }}
              >
                {tab === 'original'
                  ? 'Original Essay'
                  : tab === 'highlight'
                    ? 'AI Edits'
                    : tab === 'upgrade'
                      ? 'Upgrade Suggestions'
                      : 'Sample from AI'}
              </Button>
            ))}
          </Flex>

          <Flex gap={4} align="start">
            <Box flex="2" bg="white" p={6} borderRadius="md" boxShadow="md">
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
                {infoWriting?.instructions || 'No title'}
              </Box>

              {activeTab === 'original' && (
                <Fade in={activeTab === 'original'}>
                  <HStack spacing={4} my={4}>
                    {selectedWriting?.status === 'SUBMITTED' && (
                      <>
                        <Button
                          leftIcon={
                            isLoading ? <Spinner size="sm" /> : <CheckIcon />
                          }
                          colorScheme="green"
                          onClick={submitWriting}
                          isLoading={isLoading}
                          loadingText="Grading..."
                          disabled={isLoading}
                        >
                          {isLoading ? 'Grading...' : 'AI grading'}
                        </Button>
                        <Button
                          colorScheme="green"
                          onClick={handleFeedBack}
                          disabled={isLoading}
                        >
                          Feedback
                        </Button>
                      </>
                    )}
                  </HStack>
                  <Textarea
                    value={textSubmit}
                    height={500}
                    onChange={(e) => setTextSubmit(e.target.value)}
                    isDisabled={isLoading}
                  />
                </Fade>
              )}

              {activeTab === 'highlight' && (
                <Fade in={activeTab === 'highlight'}>
                  <div
                    className="fix-by-ai"
                    dangerouslySetInnerHTML={{ __html: data?.fixByAI }}
                  />
                </Fade>
              )}
              {activeTab === 'upgrade' && (
                <Fade in={activeTab === 'upgrade'}>
                  <div
                    className="upgrade-by-ai"
                    dangerouslySetInnerHTML={{ __html: data?.upgradeByAI }}
                  />
                </Fade>
              )}
              {activeTab === 'sample' && (
                <Fade in={activeTab === 'sample'}>
                  <div dangerouslySetInnerHTML={{ __html: data?.sampleByAI }} />
                </Fade>
              )}
            </Box>

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

                {isLoading ? (
                  <Fade in={isLoading}>
                    <Flex justify="center" w="100%" p={4}>
                      <VStack spacing={3}>
                        <Spinner size="lg" color="orange.500" thickness="4px" />
                        <Text color="gray.600">Analyzing the essay...</Text>
                      </VStack>
                    </Flex>
                  </Fade>
                ) : (
                  <Fade in={!isLoading}>
                    <VStack spacing={2} w="100%">
                      {data?.errorGrammarAndVocabulary?.map((item, index) => (
                        <ScaleFade
                          key={index}
                          in={!isLoading}
                          initialScale={0.95}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Flex
                            align="center"
                            justify="space-between"
                            bg="gray.100"
                            p={3}
                            borderRadius="md"
                            w="100%"
                            gap={2}
                            _hover={{
                              bg: 'gray.200',
                              transform: 'translateX(2px)',
                            }}
                          >
                            <Textarea
                              value={item.error}
                              onChange={(e) => {
                                const newErrors = [
                                  ...data.errorGrammarAndVocabulary,
                                ];
                                newErrors[index].error = e.target.value;
                                setData({
                                  ...data,
                                  errorGrammarAndVocabulary: newErrors,
                                });
                              }}
                              size="sm"
                              resize="none"
                              flex="1"
                            />
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => {
                                const newErrors =
                                  data.errorGrammarAndVocabulary.filter(
                                    (_, i) => i !== index,
                                  );
                                setData({
                                  ...data,
                                  errorGrammarAndVocabulary: newErrors,
                                });
                              }}
                            >
                              X
                            </Button>
                          </Flex>
                        </ScaleFade>
                      ))}

                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                          const newErrors = [
                            ...(data?.errorGrammarAndVocabulary || []),
                            { error: '' },
                          ];
                          setData({
                            ...data,
                            errorGrammarAndVocabulary: newErrors,
                          });
                        }}
                        alignSelf="start"
                      >
                        + Add Error
                      </Button>
                    </VStack>
                  </Fade>
                )}
              </VStack>
            </Box>
          </Flex>
        </Fade>
      )}
    </Container>
  );
};

export default SupportWriting;
