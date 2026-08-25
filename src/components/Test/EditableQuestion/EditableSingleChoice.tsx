import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const EditableSingleChoice = React.memo(({ question, onUpdateQuestionField }) => {
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState('');

  // State to manage inline editing for the title and options
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question?.title || '');
  const [editedOptions, setEditedOptions] = useState([]);

  useEffect(() => {
    setOptions(question?.options || []);
    setCorrectAnswer(
      Array.isArray(question?.correctAnswers) && question.correctAnswers.length > 0
        ? question.correctAnswers[0]
        : ''
    );
    setEditedOptions(question?.options || []);
  }, [question]);

  // Add a new option
  const addOption = async () => {
    const trimmedNewOption = newOption.trim();
    if (options.includes(trimmedNewOption)) {
      setError('This option already exists.');
      return;
    }

    if (trimmedNewOption) {
      const updatedOptions = [...options, trimmedNewOption];
      setOptions(updatedOptions);
      setEditedOptions(updatedOptions);
      setNewOption('');

      onUpdateQuestionField('options', updatedOptions);
      setError('');
    }
  };

  // Remove an option
  const removeOption = async (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
    setEditedOptions(updatedOptions);

    onUpdateQuestionField('options', updatedOptions);
  };

  // Handle option editing
  const handleOptionChange = (index, value) => {
    const updatedOptions = editedOptions.map((opt, i) => (i === index ? value : opt));
    setEditedOptions(updatedOptions);
  };

  // Handle blur (when input loses focus) for options
  const handleOptionBlur = (index) => {
    const updatedOptions = options.map((opt, i) => (i === index ? editedOptions[i] : opt));
    setOptions(updatedOptions);

    onUpdateQuestionField('options', updatedOptions);
  };

  // Handle selecting the correct answer
  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
    onUpdateQuestionField('correctAnswers', [value]);
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
    if (editedTitle !== question.title) {
      await onUpdateQuestionField('title', editedTitle);
    }
  };

  const handleTitleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      {/* Inline editing for the question title */}
      <Flex align="center" mb={4}>
        <Box flex="1" textAlign="left" fontWeight="bold" display="flex" alignItems="center">
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
      </Flex>

      {/* Options List */}
      <RadioGroup value={correctAnswer} onChange={handleCorrectAnswerChange}>
        {options.map((option, index) => (
          <Flex
            key={index}
            justify="space-between"
            align="center"
            bg="white"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            mb={2}
          >
            <Flex align="center" flexGrow={1}>
              {/* Input field for each option */}
              <Input
                value={editedOptions[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                onBlur={() => handleOptionBlur(index)}
                size="sm"
              />
            </Flex>
            <Box flexShrink={0} mr={2} ms={2}>
              <Radio value={option}>Correct</Radio>
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              ms={2}
              size="sm"
              aria-label="Delete option"
              colorScheme="red"
              onClick={() => removeOption(index)}
            />
          </Flex>
        ))}
      </RadioGroup>

      {/* Add new option */}
      <Flex mt={4} align="center">
        <Input
          placeholder="Add new option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <Button ml={2} colorScheme="blue" leftIcon={<AddIcon />} onClick={addOption}>
          Add
        </Button>
      </Flex>

      {/* Error message if duplicate option is added */}
      {error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
    </Box>
  );
});

export default EditableSingleChoice;