import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, IconButton, Input, Switch } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import EditableQuestionGroup from '~/components/Test/EditableQuestionGroup';
import questionGroupService from '~/services/questionGroupService';
import useCustomToast from '~/hooks/useCustomToast';
import testPartService from '~/services/testPartService';
import CustomReactQuill from '~/components/CustomReactQuill';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const EditableTestPart = React.memo(({ part, onRemovePart }) => {
  const [questionGroups, setQuestionGroups] = useState([]);
  const [showReadingPassage, setShowReadingPassage] = useState(false);
  const [readingPassage, setReadingPassage] = useState('');
  const { successToast, errorToast } = useCustomToast();

  // State to manage inline editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(part?.title || '');

  const fetchQuestionGroups = useCallback(async () => {
    if (!part) return;

    setReadingPassage(part?.readingPassage);
    setShowReadingPassage(part?.readingPassage || false);
    try {
      const groups = await questionGroupService.getByTestPart(part.id);
      setQuestionGroups(groups);
    } catch (error) {
      console.error('Error fetching question groups:', error);
    }
  }, [part]);

  useEffect(() => {
    fetchQuestionGroups();
  }, [fetchQuestionGroups]);

  const updateTestPart = async (id, updatedPart) => {
    if (!id || !updatedPart) return;

    try {
      await testPartService.update(id, updatedPart);
      successToast('Test part updated successfully!');
    } catch (error) {
      console.error('Error updating test part:', error);
      errorToast('Failed to update test part.');
    }
  };

  const handleRemoveGroup = useCallback(
    async (groupId) => {
      try {
        await questionGroupService.remove(groupId);
        setQuestionGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId),
        );
        successToast('Question group removed successfully!');
      } catch (error) {
        console.error('Error removing question group:', error);
        errorToast('Failed to remove question group.');
      }
    },
    [errorToast, successToast],
  );

  const handleAddGroup = async () => {
    const newGroup = {
      title: 'Question 1 - 10',
      ordinalNumber: questionGroups.length + 1 || 1,
      requirement: '',
      testPartId: part?.id,
      imagePath: '',
    };

    try {
      const createdGroup = await questionGroupService.create(newGroup);
      setQuestionGroups((prevGroups) => [...prevGroups, createdGroup]);
      successToast('Question group added successfully!');
    } catch (error) {
      console.error('Error adding question group:', error);
      errorToast('Failed to add question group.');
    }
  };

  // Handle drag end event to reorder question groups
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    const reorderedGroups = Array.from(questionGroups);
    const [removed] = reorderedGroups.splice(source.index, 1);
    reorderedGroups.splice(destination.index, 0, removed);

    setQuestionGroups(reorderedGroups);

    const groupId1 = questionGroups[source.index]?.id;
    const groupId2 = questionGroups[destination.index]?.id;

    try {
      if (groupId1 && groupId2) {
        await questionGroupService.swapTestPart(groupId1, groupId2);
        successToast('Question groups swapped successfully!');
      }
    } catch (error) {
      console.error('Error swapping question groups:', error);
      errorToast('Failed to swap question groups.');
    }
  };

  // Handle title editing
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (editedTitle !== part.title) {
      await updateTestPart(part.id, { ...part, title: editedTitle });
    }
  };

  const handleTitleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      if (editedTitle !== part.title) {
        await updateTestPart(part.id, { ...part, title: editedTitle });
      }
    }
  };

  return (
    <Box
      p={4}
      bg="white"
      mb={4}
      borderRadius="lg"
      borderWidth="1px"
      width="100%"
    >
      <Flex justify="space-between" align="center">
        {/* Inline editing for the part title */}
        <Box
          flex="1"
          textAlign="left"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          {isEditingTitle ? (
            <Input
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              size="sm"
              width="auto"
            />
          ) : (
            <Box onClick={handleTitleClick} cursor="pointer">
              {editedTitle || 'Untitled'}
            </Box>
          )}
        </Box>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete part"
          colorScheme="red"
          onClick={() => onRemovePart(part.id)}
        />
      </Flex>

      {/* Switch to toggle visibility */}
      <FormControl display="flex" alignItems="center" mb={4}>
        <FormLabel htmlFor="toggleReadingPassage" mb="0">
          Show Reading Passage
        </FormLabel>
        <Switch
          id="toggleReadingPassage"
          isChecked={showReadingPassage}
          onChange={() => setShowReadingPassage(!showReadingPassage)}
        />
      </FormControl>

      {showReadingPassage && (
        <FormControl mb={10}>
          <FormLabel>Reading Passage</FormLabel>
          <CustomReactQuill
            value={readingPassage}
            onChange={(readingPassage) => setReadingPassage(readingPassage)}
            placeholder="Enter lesson content"
          />

          <Button
            mt={10}
            colorScheme="blue"
            onClick={(e) =>
              updateTestPart(part.id, { ...part, readingPassage })
            }
          >
            Update Part
          </Button>
        </FormControl>
      )}

      {/* Drag and Drop Context for question groups */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`testPart-${part.id}`} type="group">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {questionGroups.map((group, index) => (
                <Draggable
                  key={group?.id}
                  draggableId={`group-${group.id}`}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      mb={4}
                    >
                      <EditableQuestionGroup
                        index={index}
                        group={group}
                        onRemoveGroup={handleRemoveGroup}
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

      <Flex justify="flex-end" mb={4}>
        <Button
          colorScheme="green"
          onClick={handleAddGroup}
          leftIcon={<AddIcon />}
        >
          Add Question Group
        </Button>
      </Flex>
    </Box>
  );
});

export default EditableTestPart;
