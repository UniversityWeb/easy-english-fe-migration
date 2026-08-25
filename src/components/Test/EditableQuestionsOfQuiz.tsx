import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, List, ListItem } from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import EditableQuestionItem from '~/components/Test/EditableQuestion/EditableQuestionItem';
import { AddIcon } from '@chakra-ui/icons';
import testQuestionService from '~/services/testQuestionService';
import { QUESTION_TEMPLATES_TO_ADD } from '~/utils/testDemoData';
import { TEST_TYPES } from '~/utils/constants';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const EditableQuestionsOfQuiz = ({ test }) => {
  const [questions, setQuestions] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  const fetchQuestionsForQuiz = useCallback(async () => {
    if (!test?.id || test?.type !== TEST_TYPES.QUIZ) return;

    try {
      const loadedQuestions =
        await testQuestionService.getAllQuestionsForQuizType(test?.id);
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [test?.id, test?.type]);

  useEffect(() => {
    fetchQuestionsForQuiz();
  }, [fetchQuestionsForQuiz, test?.type]);

  const reloadQuestions = useCallback(async () => {
    await fetchQuestionsForQuiz();
  }, [fetchQuestionsForQuiz]);

  const addNewQuestionForQuiz = async () => {
    const newQuestion = {
      ...QUESTION_TEMPLATES_TO_ADD.SINGLE_CHOICE,
      ordinalNumber: questions?.length + 1 || 1,
      testId: test?.id,
    };

    try {
      const addedQuestion =
        await testQuestionService.createNewQuestionForQuizType(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      successToast('Question added successfully.');
    } catch (error) {
      console.error('Error adding question:', error);
      errorToast('Error adding question.');
    }
  };

  const removeQuestion = useCallback(
    async (id) => {
      try {
        await testQuestionService.remove(id);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== id),
        );
        successToast('Question removed successfully.');
      } catch (error) {
        console.error('Error removing question:', error);
        errorToast('Error removing question.');
      }
    },
    [errorToast, successToast],
  );

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If there's no destination, return
    if (!destination) return;

    // If the item was dropped in the same position, return
    if (source.index === destination.index) return;

    // Reorder the questions in the local state
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, removed);

    setQuestions(reorderedQuestions);

    // Optionally, call an API to persist the new order (if needed)
    try {
      const questionId1 = questions[source.index].id;
      const questionId2 = questions[destination.index].id;

      await testQuestionService.swapQuestions(questionId1, questionId2);
      successToast('Questions reordered successfully.');
    } catch (error) {
      console.error('Error reordering questions:', error);
      errorToast('Error reordering questions.');
    }
  };

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px" width="100%">
      {/* Question List */}
      <Heading size="md" mt={10} mb={5}>
        Questions
      </Heading>

      {/* Drag and Drop Context for questions */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="quiz-questions" type="question">
          {(provided) => (
            <List
              spacing={4}
              w="100%"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={`question-${question.id}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      key={question?.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <EditableQuestionItem
                        index={index}
                        key={question.id}
                        question={question}
                        onRemoveQuestion={removeQuestion}
                        onReloadQuestions={reloadQuestions}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <Flex justify="end" mb={10}>
        <Button
          colorScheme="green"
          onClick={addNewQuestionForQuiz}
          leftIcon={<AddIcon />}
        >
          Add Question
        </Button>
      </Flex>
    </Box>
  );
};

export default EditableQuestionsOfQuiz;
