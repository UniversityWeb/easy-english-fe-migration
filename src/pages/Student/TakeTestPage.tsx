import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import TakeTestHeader from '~/components/Test/TakeTest/TakeTestHeader';
import TakeTestFooter from '~/components/Test/TakeTest/TakeTestFooter';
import TakeTestPart from '~/components/Test/TakeTest/TakeTestPart';
import { getTest, saveQuestionState, saveTest } from '~/utils/testUtils';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate for navigation
import testService from '~/services/testService';
import config from '~/config';

const TakeTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [test, setTest] = useState({});
  const [selectedPartId, setSelectedPartId] = useState(0);
  const [scrollToQuestion, setScrollToQuestion] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetCountDownTime, setResetCountDownTime] = useState(0);
  const [isSplitLayout, setIsSplitLayout] = useState(true);

  // 💡 New state to track user answers
  const [userAnswers, setUserAnswers] = useState([]);

  // Refresh state to trigger re-render of footer
  const [refreshFooterContent, setRefreshFooterContent] = useState(0);

  useEffect(() => {
    if (testId) {
      const savedTest = getTest(testId);
      if (savedTest) {
        onOpen();
      } else {
        checkIfTestIsEmpty(); // Call the function to check if the test is empty
      }

      try {
        setSelectedPartId(test?.parts[0]?.id || 0);
        setUserAnswers(savedTest?.userAnswers || []); // Set initial user answers from saved test
      } catch (e) {
        console.error(e);
      }
    }
  }, [testId, onOpen]);

  const checkIfTestIsEmpty = async () => {
    try {
      const isEmpty = await testService.isEmptyTest(testId);

      if (isEmpty) {
        return navigate(config.routes.search);
      } else {
        fetchTest();
      }
    } catch (e) {
      console.error('Error checking if test is empty:', e);
    }
  };

  const fetchTest = async () => {
    try {
      let test = await testService.getById(testId);
      if (test) {
        test = { ...test, startedAt: new Date().toISOString() };
        saveTest(testId, test);
        setTest(test);
      }
      setResetCountDownTime((prev) => prev + 1);
    } catch (e) {
      console.error('Failed to fetch test:', e);
    }
  };

  const loadTestFromLocalStorage = () => {
    const savedTest = getTest(testId);
    if (savedTest) {
      setTest(savedTest);
      setUserAnswers(savedTest?.userAnswers || []); // Load saved user answers
    }
    setResetCountDownTime((prev) => prev + 1);
  };

  const handleLoadFromLocal = (loadLocal) => {
    if (loadLocal) {
      loadTestFromLocalStorage();
    } else {
      fetchTest();
    }

    try {
      setSelectedPartId(test?.parts[0]?.id || 0);
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handlePartClick = useCallback(
    (partId) => {
      setSelectedPartId(partId);
    },
    [setSelectedPartId],
  );

  const handleScrollToQuestion = useCallback(
    (questionId) => {
      setScrollToQuestion(questionId);
    },
    [setScrollToQuestion],
  );

  // 💡 Update userAnswers when a question is answered
  const handleAnswerQuestion = useCallback(
    (testQuestionId, answers) => {
      if (
        Array.isArray(answers) &&
        answers.every((answer) => typeof answer === 'string')
      ) {
        saveQuestionState(testId, testQuestionId, answers);

        // Update local userAnswers state
        const updatedAnswers = [...userAnswers];
        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.testQuestionId === testQuestionId,
        );

        if (existingAnswerIndex !== -1) {
          updatedAnswers[existingAnswerIndex] = { testQuestionId, answers };
        } else {
          updatedAnswers.push({ testQuestionId, answers });
        }

        setUserAnswers(updatedAnswers); // Update the state with the new answers

        // Trigger a refresh of the footer
        setRefreshFooterContent((prev) => prev + 1);
      } else {
        console.error('Invalid answers: must be an array of strings');
      }
    },
    [userAnswers, testId],
  );

  const toggleLayout = () => {
    setIsSplitLayout((prev) => !prev);
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column" overflow="hidden">
      {/* Header */}
      <Box position="sticky" top="0" zIndex="100" bg="white" boxShadow="md">
        <TakeTestHeader
          testId={testId}
          resetCountDown={resetCountDownTime}
          audioPath={test?.audioPath}
          isSplitLayout={isSplitLayout}
          onToggleLayout={toggleLayout}
        />
      </Box>

      {/* Test Part (Scrollable Content) */}
      <Box flex="1" overflowY="auto" px={4}>
        <TakeTestPart
          testId={testId}
          partId={selectedPartId}
          scrollToQuestion={scrollToQuestion}
          onQuestionAnswered={handleAnswerQuestion} // Pass down answer handler
          isSplitLayout={isSplitLayout} // Pass layout mode to TakeTestPart
          setIsSplitLayout={setIsSplitLayout}
        />
      </Box>

      {/* Footer */}
      {test?.parts?.length > 0 && (
        <Box
          position="sticky"
          bottom="0"
          left="0"
          right="0"
          zIndex="100"
          bg="white"
          boxShadow="lg"
          p={4}
        >
          <TakeTestFooter
            testId={test?.id}
            selectedPartId={selectedPartId}
            onPartClick={handlePartClick}
            onScrollToQuestion={handleScrollToQuestion}
            isRefresh={refreshFooterContent} // Pass refresh trigger
            userAnswers={userAnswers} // Pass updated user answers
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load Saved Test?</ModalHeader>
          <ModalBody>
            A saved version of this test was found. Would you like to continue
            where you left off or start fresh?
          </ModalBody>
          <ModalFooter>
            <Button
              textColor="white"
              colorScheme="teal"
              mr={3}
              onClick={() => handleLoadFromLocal(true)}
            >
              Yes, Load Saved Test
            </Button>
            <Button variant="ghost" onClick={() => handleLoadFromLocal(false)}>
              No, Fetch New Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TakeTestPage;
