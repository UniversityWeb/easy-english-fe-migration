import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import testQuestionService from '~/services/testQuestionService';
import useCustomToast from '~/hooks/useCustomToast';
import { QUESTION_TYPES } from '~/utils/constants';
import EditableSingleChoice from '~/components/Test/EditableQuestion/EditableSingleChoice';
import EditableMultipleChoice from '~/components/Test/EditableQuestion/EditableMultipleChoice';
import EditableMatching from '~/components/Test/EditableQuestion/EditableMatching';
import EditableTrueFalse from '~/components/Test/EditableQuestion/EditableTrueFalse';
import EditableFillBlank from '~/components/Test/EditableQuestion/EditableFillBlank';
import { QUESTION_TEMPLATES_TO_ADD } from '~/utils/testDemoData';

const QuestionItem = ({ index, question, onRemoveQuestion, onReloadQuestions }) => {
  const [questionState, setQuestionState] = useState(question);
  const { successToast, errorToast } = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newType, setNewType] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionState({
        id: question?.id,
        type: question?.type || 'SINGLE_CHOICE', // Default type if not provided
        title: question?.title || '',
        description: question?.description || '',
        options: question?.options || [],
        correctAnswers: question?.correctAnswers || [],
        questionGroupId: question?.questionGroupId || 0,
      });
    }
  }, [question]);

  const updateQuestion = async (id, updatedData) => {
    try {
      const updatedResponse = await testQuestionService.update(id, updatedData);
      setQuestionState((prev) => ({
        ...prev,
        ...updatedResponse,
      }));
      successToast('Question updated successfully.');
    } catch (error) {
      console.error('Error updating question:', error);
      errorToast('Error updating question.');
    }
  };

  const updateQuestionField = useCallback(
    async (fieldOrFields, value) => {
      const updatedFields =
        typeof fieldOrFields === 'object'
          ? fieldOrFields
          : { [fieldOrFields]: value };

      // Update the question with the modified state
      await updateQuestion(questionState?.id, {
        ...questionState,
        ...updatedFields,
      });
    },
    [questionState]
  );

  const handleTypeChange = async (e) => {
    const selectedType = e.target.value;
    setNewType(selectedType);
    onOpen(); // Open confirmation dialog
  };

  const confirmChangeType = async () => {
    const questionId = questionState?.id;
    const newQuestionTemplate = createNewQuestionTemplate(newType);
    if (newQuestionTemplate) {
      await updateQuestion(questionId, {
        ...newQuestionTemplate,
        questionGroupId: questionState?.questionGroupId,
      });

      onClose(); // Close the dialog
    }
  };

  const createNewQuestionTemplate = (type) => {
    const templates = {
      [QUESTION_TYPES.SINGLE_CHOICE]: QUESTION_TEMPLATES_TO_ADD.SINGLE_CHOICE,
      [QUESTION_TYPES.MULTI_CHOICE]: QUESTION_TEMPLATES_TO_ADD.MULTI_CHOICE,
      [QUESTION_TYPES.TRUE_FALSE]: QUESTION_TEMPLATES_TO_ADD.TRUE_FALSE,
      [QUESTION_TYPES.MATCHING]: QUESTION_TEMPLATES_TO_ADD.MATCHING,
      [QUESTION_TYPES.FILL_BLANK]: QUESTION_TEMPLATES_TO_ADD.FILL_BLANK,
    };

    return templates[type] || { ...questionState, type, options: [], correctAnswers: [] };
  };

  const renderQuestion = () => {
    const commonProps = {
      key: question?.id,
      question: questionState,
      onUpdateQuestionField: updateQuestionField,
    };

    switch (questionState?.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <EditableSingleChoice {...commonProps} />;
      case QUESTION_TYPES.MULTI_CHOICE:
        return <EditableMultipleChoice {...commonProps} />;
      case QUESTION_TYPES.TRUE_FALSE:
        return <EditableTrueFalse {...commonProps} />;
      case QUESTION_TYPES.MATCHING:
        return <EditableMatching {...commonProps} />;
      case QUESTION_TYPES.FILL_BLANK:
        return <EditableFillBlank {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Box p={4} bg="gray.100" mb={4} borderRadius="lg" borderWidth="1px">
      <Flex justify="space-between" mb={4} align="center">
        <Flex align="center" justify="space-between">
          <Text mr={1}>Question {index + 1}</Text>
        </Flex>

        <Flex align="center">
          <Select
            w="200px"
            mr={2}
            value={questionState?.type}
            onChange={handleTypeChange}
          >
            {Object.values(QUESTION_TYPES).map((type) => (
              <option key={type} value={type}>
                {type
                  .replace('_', ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </Select>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete question"
            colorScheme="red"
            onClick={() => onRemoveQuestion(questionState?.id)}
          />
        </Flex>
      </Flex>
      {renderQuestion()}

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Change</ModalHeader>
          <ModalBody>
            <Text>
              This action will permanently delete the old content. Are you sure
              you want to proceed?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={confirmChangeType}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuestionItem;
