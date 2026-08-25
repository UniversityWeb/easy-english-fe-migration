import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import EditableQuestionItem from '~/components/Test/EditableQuestion/EditableQuestionItem';
import testQuestionService from '~/services/testQuestionService';
import useCustomToast from '~/hooks/useCustomToast';
import questionGroupService from '~/services/questionGroupService';
import { QUESTION_TEMPLATES_TO_ADD } from '~/utils/testDemoData';
import CustomReactQuill from '~/components/CustomReactQuill';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const EditableQuestionGroup = React.memo(
  ({ index, group, onRemoveGroup, onReloadGroups }) => {
    const [groupState, setGroupState] = useState(group);
    const [questions, setQuestions] = useState([]);
    const { successToast, errorToast } = useCustomToast();
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch questions from the server
    const fetchQuestions = async () => {
      if (!group) return;

      try {
        const loadedQuestions = await testQuestionService.getByQuestionGroup(
          group?.id,
        );
        setQuestions(loadedQuestions);
      } catch (error) {
        errorToast('Error fetching questions.');
        console.error('Error fetching questions:', error);
      }
    };

    // Reload questions (to be passed to EditableQuestionItem)
    const reloadQuestions = useCallback(() => {
      fetchQuestions();
    }, [group]);

    useEffect(() => {
      setGroupState({
        requirement: group?.requirement || '',
        testPartId: group?.testPartId || '',
      });

      fetchQuestions();
    }, [group]);

    const handleUpdateGroup = async (e) => {
      e?.preventDefault();
      setIsUpdating(true);
      try {
        await questionGroupService.update(group?.id, groupState);
        successToast('Question group updated successfully!');
      } catch (error) {
        console.error('Error updating question group:', error);
        errorToast('Failed to update question group.');
      } finally {
        setIsUpdating(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setGroupState((prev) => ({ ...prev, [name]: value }));
    };

    const addNewQuestion = async () => {
      const newQuestion = {
        ...QUESTION_TEMPLATES_TO_ADD.SINGLE_CHOICE,
        ordinalNumber: questions.length + 1,
        questionGroupId: group?.id,
      };

      try {
        const addedQuestion = await testQuestionService.create(newQuestion);
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
      [questions.length],
    );

    // Handle drag end event to reorder questions
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

      // Call the swapQuestions API to persist the new order
      try {
        const questionId1 = questions[source.index].id;
        const questionId2 = questions[destination.index].id;

        await testQuestionService.swapQuestions(questionId1, questionId2);
        successToast('Questions reordered successfully.');
      } catch (error) {
        console.error('Error swapping questions:', error);
        errorToast('Error reordering questions.');
      }
    };

    return (
      <Box p={4} bg="gray.50" mb={4} borderRadius="lg" borderWidth="1px">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold" fontSize="md">
            {`Group ${index + 1}`}
          </Text>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete question group"
            colorScheme="red"
            onClick={() => onRemoveGroup(group.id)}
          />
        </Flex>

        <Accordion allowMultiple>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton>
                    {isExpanded ? (
                      <>
                        <Box as="span" flex="1" textAlign="left">
                          Hide
                        </Box>
                        <MinusIcon fontSize="12px" />
                      </>
                    ) : (
                      <>
                        <Box as="span" flex="1" textAlign="left">
                          Show
                        </Box>
                        <AddIcon fontSize="12px" />
                      </>
                    )}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Tabs>
                    <TabList>
                      <Tab>Group Info</Tab>
                      <Tab>Questions</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        {/* Additional fields */}
                        <FormControl mb={10}>
                          <FormLabel>Requirement</FormLabel>
                          <CustomReactQuill
                            value={groupState?.requirement}
                            onChange={(requirement) =>
                              setGroupState((prev) => ({
                                ...prev,
                                requirement,
                              }))
                            }
                            placeholder={'Enter requirement'}
                          />
                        </FormControl>

                        <Flex justify="space-between" mb={4}>
                          <Button
                            colorScheme="blue"
                            onClick={handleUpdateGroup}
                            isLoading={isUpdating}
                          >
                            Update Group
                          </Button>
                        </Flex>
                      </TabPanel>

                      <TabPanel>
                        <Heading size="md" mb={5}>
                          Questions
                        </Heading>

                        {/* Drag and Drop Context for questions */}
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable
                            droppableId={`group-${group.id}`}
                            type="question"
                          >
                            {(provided) => (
                              <Box
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
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        mb={4}
                                      >
                                        <EditableQuestionItem
                                          index={index}
                                          key={question.id}
                                          question={question}
                                          onRemoveQuestion={removeQuestion}
                                          onReloadQuestions={reloadQuestions}
                                        />
                                      </Box>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </Box>
                            )}
                          </Droppable>
                        </DragDropContext>

                        <Flex justify="space-between" mb={4}>
                          <Button
                            colorScheme="green"
                            onClick={addNewQuestion}
                            leftIcon={<AddIcon />}
                          >
                            Add Question
                          </Button>
                        </Flex>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Box>
    );
  },
);

export default EditableQuestionGroup;
