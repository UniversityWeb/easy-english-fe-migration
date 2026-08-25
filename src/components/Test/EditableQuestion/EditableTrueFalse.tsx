import React, { useEffect, useState } from 'react';
import { Box, Flex, Input, Radio, RadioGroup } from '@chakra-ui/react';

const EditableTrueFalse = React.memo(({ question, onUpdateQuestionField }) => {
  const [correctAnswer, setCorrectAnswer] = useState("");

  // State to manage inline editing for the title and options
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question?.title || '');

  useEffect(() => {
    setCorrectAnswer(question?.correctAnswers[0] || "");
  }, [question]);

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

      {/* True/False options */}
      <RadioGroup value={correctAnswer} onChange={handleCorrectAnswerChange}>
        <Flex align="center" mb={2}>
          <Radio value="True">True</Radio>
          <Radio value="False" ml={4}>False</Radio>
        </Flex>
      </RadioGroup>
    </Box>
  );
});

export default EditableTrueFalse;
