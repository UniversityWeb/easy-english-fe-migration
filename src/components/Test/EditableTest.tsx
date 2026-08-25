import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // Import drag-and-drop components
import EditableTestPart from './EditableTestPart';
import TestForm from './TestForm';
import testPartService from '~/services/testPartService';
import useCustomToast from '~/hooks/useCustomToast';
import testService from '~/services/testService';
import { TEST_TYPES } from '~/utils/constants';
import EditableQuestionsOfQuiz from '~/components/Test/EditableQuestionsOfQuiz';
import TestAudioUpload from '~/components/Test/TestAudioUpload';
import TestResultTable from '~/components/Test/Result/TestResultTable';

const EditableTest = ({
  courseId,
  sectionId,
  ordinalNumber,
  testId,
  isNew,
  onTestSaved,
}) => {
  const [testState, setTestState] = useState({
    title: 'Test Form',
    description: 'Make your description here',
    durationInMilis: 2700000, // Default duration (e.g., 45 minutes in milliseconds)
    passingGrade: 0.0,
    audioPath: '',
    type: 'CUSTOM',
    status: 'DISPLAY',
    createdAt: new Date().toISOString(),
    sectionId: sectionId,
  });
  const [testParts, setTestParts] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  const fetchTestById = useCallback(async () => {
    try {
      const data = await testService.getById(testId);
      if (data) {
        setTestState({
          id: data.id || 0,
          title: data.title || '',
          description: data.description || '',
          durationInMilis: data.durationInMilis || 0,
          startDate: data.startDate || new Date().toISOString().slice(0, 16),
          endDate:
            data.endDate ||
            new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16),
          type: data.type || 'CUSTOM',
          status: data.status || 'DISPLAY',
          audioPath: data?.audioPath,
          createdAt: data.createdAt || new Date().toISOString().slice(0, 16),
          sectionId: data.sectionId || 0,
          passingGrade: data?.passingGrade || 0,
        });
        successToast('Test data fetched successfully');
      }
    } catch (error) {
      console.error(error?.message);
      errorToast('Error fetching test data');
    }
  }, [errorToast, successToast, testId]);

  const fetchTestParts = useCallback(async () => {
    try {
      const parts = await testPartService.getTestPartsByTestId(testId);
      setTestParts(parts);
    } catch (error) {
      console.error('Error fetching test parts:', error);
      errorToast('Failed to fetch test parts.');
    }
  }, [errorToast, testId]);

  useEffect(() => {
    if (!isNew && testId) {
      fetchTestById();
      fetchTestParts();
    } else {
      setTestState({
        title: '',
        description: '',
        durationInMilis: 2700000,
        passingGrade: 0.0,
        audioPath: '',
        status: 'DISPLAY',
        createdAt: new Date().toISOString(),
      }); // Reset form
    }
  }, [fetchTestById, fetchTestParts, isNew, testId]);

  const removeTestPart = useCallback(async (id) => {
    try {
      await testPartService.remove(id);
      setTestParts((prevParts) => prevParts.filter((part) => part.id !== id));
      successToast('Test part removed successfully!');
    } catch (error) {
      console.error('Error removing test part:', error);
      errorToast('Failed to remove test part.');
    }
  }, [errorToast, successToast]);

  const addTestPart = async () => {
    const newPart = {
      title: 'New Test Part',
      readingPassage: '',
      ordinalNumber: testParts.length + 1 || 1,
      testId: testId,
    };

    try {
      const createdPart = await testPartService.create(newPart);
      setTestParts((prevParts) => [...prevParts, createdPart]);
      successToast('Test part added successfully!');
    } catch (error) {
      console.error('Error adding test part:', error);
      errorToast('Failed to add test part.');
    }
  };

  // Handle drag end event to reorder test parts
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If there's no destination, return
    if (!destination) return;

    // If the item was dropped in the same position, return
    if (source.index === destination.index) return;

    // Reorder the test parts in the local state
    const reorderedParts = Array.from(testParts);
    const [movedPart] = reorderedParts.splice(source.index, 1);
    reorderedParts.splice(destination.index, 0, movedPart);

    setTestParts(reorderedParts);

    // Extract part IDs for swapping
    const partId1 = testParts[source.index]?.id;
    const partId2 = testParts[destination.index]?.id;

    // Call the swap API
    try {
      if (partId1 && partId2) {
        await testPartService.swapPart(partId1, partId2);
        successToast('Test parts reordered successfully!');
      }
    } catch (error) {
      console.error('Error swapping test parts:', error);
      errorToast('Failed to reorder test parts.');
    }
  };

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px">
      {/* Tabs Layout */}
      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab>Test Form</Tab>
          <Tab>Submissions</Tab>
        </TabList>

        <TabPanels>
          {/* Tab 1: Original Content */}
          <TabPanel>
            <TestForm
              sectionId={sectionId}
              ordinalNumber={ordinalNumber}
              testState={testState}
              setTestState={setTestState}
              isNew={isNew}
              onTestSaved={onTestSaved}
            />

            {!isNew && testState?.type === TEST_TYPES.CUSTOM && (
              <TestAudioUpload
                testState={testState}
                setTestState={setTestState}
              />
            )}

            {!isNew && (
              <>
                {/* QUIZ test */}
                {testState?.type === TEST_TYPES.QUIZ ? (
                  <EditableQuestionsOfQuiz test={testState} />
                ) : (
                  <>
                    {/* CUSTOM test */}
                    <Heading size="lg" mt={10}>
                      Test parts
                    </Heading>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable
                        droppableId="droppable-test-parts"
                        type="test-part"
                      >
                        {(provided) => (
                          <VStack
                            spacing={4}
                            mt={4}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {testParts.map((part, index) => (
                              <Draggable
                                key={part.id}
                                draggableId={`part-${part.id}`}
                                index={index}
                              >
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    w="100%"
                                  >
                                    <EditableTestPart
                                      key={part.id}
                                      part={part}
                                      onRemovePart={removeTestPart}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </VStack>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <Button colorScheme="blue" onClick={addTestPart} mb={10}>
                      Add Test Part
                    </Button>
                  </>
                )}
              </>
            )}
          </TabPanel>

          {/* Tab 2: TestResultTable */}
          <TabPanel>
            <TestResultTable testId={testId} courseId={courseId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EditableTest;
