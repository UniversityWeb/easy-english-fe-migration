import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CheckboxGroup, Flex, IconButton, Input, Text, Textarea } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const EditableMultipleChoice = React.memo(({ question, onUpdateQuestionField }) => {
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState("");
  const [editedTitle, setEditedTitle] = useState(question?.title || "");
  const [editedOptions, setEditedOptions] = useState([]);

  useEffect(() => {
    setOptions(question?.options || []);
    setCorrectAnswers(question?.correctAnswers || []);
    setEditedOptions(question?.options || []);
  }, [question]);

  // Add a new option
  const addOption = async () => {
    const trimmedNewOption = newOption?.trim();
    if (options.includes(trimmedNewOption)) {
      setError("This option already exists.");
      return;
    }

    if (trimmedNewOption) {
      const updatedOptions = [...options, trimmedNewOption];
      setOptions(updatedOptions);
      setEditedOptions(updatedOptions);
      setNewOption("");

      onUpdateQuestionField('options', updatedOptions);
      setError("");
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
    const updatedOptions = editedOptions.map((opt, i) =>
      i === index ? value : opt
    );
    setEditedOptions(updatedOptions);
  };

  // Handle blur (when input loses focus) for options
  const handleOptionBlur = (index) => {
    const updatedOptions = options.map((opt, i) =>
      i === index ? editedOptions[i] : opt
    );
    setOptions(updatedOptions);
    onUpdateQuestionField('options', updatedOptions);
  };

  // Handle selecting the correct answers
  const handleCorrectAnswerChange = (value) => {
    const updatedCorrectAnswers = correctAnswers.includes(value)
      ? correctAnswers.filter((answer) => answer !== value)
      : [...correctAnswers, value];

    setCorrectAnswers(updatedCorrectAnswers);
    onUpdateQuestionField('correctAnswers', updatedCorrectAnswers);
  };

  // Handle title change and blur
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle !== question.title) {
      onUpdateQuestionField('title', editedTitle);
    }
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      <Flex align="center" mb={4}>
        <Textarea
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          placeholder="Enter question title"
          resize="vertical"
          size="sm"
        />
      </Flex>

      {/* Options section */}
      <CheckboxGroup value={correctAnswers} onChange={setCorrectAnswers}>
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
              <Input
                value={editedOptions[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                onBlur={() => handleOptionBlur(index)}
                size="sm"
              />
            </Flex>
            <Checkbox
              value={option}
              onChange={() => handleCorrectAnswerChange(option)}
              ms={2}
            >
              Correct
            </Checkbox>
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
      </CheckboxGroup>

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

export default EditableMultipleChoice;