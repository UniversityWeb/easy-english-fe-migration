import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { RiDeleteBinFill } from 'react-icons/ri';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';
import { PiPencilSimpleFill } from 'react-icons/pi'; // Importing pencil icon
import faqService from '~/services/faqService'; // Import the FAQ service
import useCustomToast from '~/hooks/useCustomToast';

function Faq({ courseId }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { successToast, errorToast } = useCustomToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch FAQs from API on component load
  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      const faqData = await faqService.fetchFAQByCourse({ courseId });
      if (faqData) {
        const faqList = faqData.map((item) => ({
          ...item,
          isOpen: false,
          isEditing: false,
          isHovered: false,
        }));
        setQuestions(faqList);
      }
      setLoading(false);
    };

    fetchFAQs();
  }, [courseId]);

  const handleAddQuestion = async () => {
    try {
      if (!newQuestion.trim()) {
        errorToast('Question cannot be empty');
        return;
      }
      if (!newAnswer.trim()) {
        errorToast('Answer cannot be empty');
        return;
      }

      const newFaq = await faqService.createFAQ({
        question: newQuestion,
        answer: newAnswer,
        courseId,
      });
      if (newFaq) {
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          { ...newFaq, isOpen: false, isEditing: false, isHovered: false },
        ]);
        setNewQuestion('');
        setNewAnswer('');
        setIsAdding(false);
        successToast('Question added successfully');
      }
    } catch (error) {
      errorToast('Error adding question');
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      const faqToDelete = questions[index];
      const success = await faqService.deleteFAQ({ id: faqToDelete.id });
      if (success) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((_, i) => i !== index),
        );
      }
      successToast('Question deleted successfully');
    } catch (error) {
      errorToast('Error deleting question');
    }
  };

  const toggleQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item,
      ),
    );
  };

  const handleEdit = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isEditing: true, isOpen: true } : item,
      ),
    );
  };

  const handleUpdateQuestion = async (
    index,
    updatedQuestion,
    updatedAnswer,
  ) => {
    try {
      if (!updatedQuestion.trim()) {
        errorToast('Question cannot be empty');
        return;
      }
      if (!updatedAnswer.trim()) {
        errorToast('Answer cannot be empty');
        return;
      }

      const faqToUpdate = questions[index];
      const updatedFaq = await faqService.updateFAQ({
        id: faqToUpdate.id,
        question: updatedQuestion,
        answer: updatedAnswer,
      });

      if (updatedFaq) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((item, i) =>
            i === index
              ? {
                  ...item,
                  question: updatedFaq.question,
                  answer: updatedFaq.answer,
                  isEditing: false,
                }
              : item,
          ),
        );
        successToast('Question updated successfully');
      }
    } catch (error) {
      errorToast('Error updating question');
    }
  };
  const toggleHover = (index, isHovered) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isHovered } : item,
      ),
    );
  };

  const promptDelete = (index) => {
    setIsConfirmOpen(true);
    setItemToDelete(index);
  };

  const onDeleteFAQ = () => {
    handleDeleteQuestion(itemToDelete);
    setIsConfirmOpen(false);
  };

  const DeleteConfirmationModal = () => (
    <Modal
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold" color="red.600">
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          <Text fontSize="md" color="gray.700" mb={4}>
            Are you sure you want to delete this FAQ ?
          </Text>
          <HStack spacing={4} justify="flex-end" mb={2}>
            <Button colorScheme="red" onClick={onDeleteFAQ} size="md">
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmOpen(false)}
              size="md"
            >
              Cancel
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
  return (
    <HStack spacing={5} align="start" h="full" justify="center">
      <Box
        w="50%"
        p={5}
        rounded="md"
        display="flex"
        flexDirection="column"
        h="100%"
      >
        <Box flex="1" overflowY="auto" pr={2}>
          {/* Show spinner while loading */}
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <VStack spacing={5} align="start" w="full">
              {questions.map((item, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  w="full"
                  bg="gray.50"
                  onMouseEnter={() => toggleHover(index, true)}
                  onMouseLeave={() => toggleHover(index, false)}
                >
                  <HStack justify="space-between" mb={3}>
                    <HStack>
                      <Text fontSize="lg" fontWeight="bold">
                        Question {index + 1}
                      </Text>
                      {item.isHovered && (
                        <IconButton
                          icon={<PiPencilSimpleFill />}
                          backgroundColor="transparent"
                          color="gray.500"
                          aria-label="Edit question"
                          onClick={() => handleEdit(index)}
                          size="sm"
                        />
                      )}
                    </HStack>
                    <HStack>
                      {item.isHovered && (
                        <IconButton
                          icon={<RiDeleteBinFill />}
                          backgroundColor="transparent"
                          color="gray.500"
                          aria-label="Delete question"
                          onClick={() => promptDelete(index)}
                          size="sm"
                        />
                      )}
                      <IconButton
                        icon={
                          item.isOpen ? <RxTriangleUp /> : <RxTriangleDown />
                        }
                        aria-label="Toggle question"
                        onClick={() => toggleQuestion(index)}
                        size="sm"
                        color="gray.500"
                      />
                    </HStack>
                  </HStack>

                  <Text fontWeight="bold">{item.question}</Text>

                  <Collapse in={item.isOpen} animateOpacity>
                    <VStack spacing={3} align="start" mt={3}>
                      <Text fontWeight="bold">Question</Text>
                      <Input
                        value={item.question}
                        isReadOnly={!item.isEditing}
                        onChange={(e) => {
                          const updatedQuestion = e.target.value;
                          setQuestions((prevQuestions) =>
                            prevQuestions.map((q, i) =>
                              i === index
                                ? { ...q, question: updatedQuestion }
                                : q,
                            ),
                          );
                        }}
                      />
                      <Text fontWeight="bold">Answer</Text>
                      <Textarea
                        value={item.answer}
                        isReadOnly={!item.isEditing}
                        onChange={(e) => {
                          const updatedAnswer = e.target.value;
                          setQuestions((prevQuestions) =>
                            prevQuestions.map((q, i) =>
                              i === index ? { ...q, answer: updatedAnswer } : q,
                            ),
                          );
                        }}
                      />
                      {item.isEditing && (
                        <Button
                          mt={2}
                          colorScheme="blue"
                          onClick={() =>
                            handleUpdateQuestion(
                              index,
                              item.question,
                              item.answer,
                            )
                          }
                        >
                          Update Question
                        </Button>
                      )}
                    </VStack>
                  </Collapse>
                </Box>
              ))}

              {/* New question form */}
              {isAdding && (
                <Box
                  w="full"
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <VStack spacing={3} align="start" w="full">
                    <Text fontWeight="bold">Question</Text>
                    <Input
                      placeholder="Enter your question"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <Text fontWeight="bold">Answer</Text>
                    <Textarea
                      placeholder="Enter the answer"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                    />

                    {/* Buttons for saving or canceling */}
                    <HStack justify="flex-end" w="full" mt={4}>
                      <Button
                        colorScheme="gray"
                        onClick={() => setIsAdding(false)}
                      >
                        Cancel
                      </Button>
                      <Button colorScheme="blue" onClick={handleAddQuestion}>
                        Save Question
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          )}
          {!isAdding && (
            <Box
              position="sticky"
              bottom="0"
              bg="white"
              p={0}
              zIndex={10}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => setIsAdding(true)}
              >
                Add new question
              </Button>
            </Box>
          )}
        </Box>
        {/* Button to toggle the Add new question form */}
      </Box>
      <DeleteConfirmationModal />
    </HStack>
  );
}

export default React.memo(Faq);
