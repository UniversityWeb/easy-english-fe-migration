import React from 'react';
import { Box, Checkbox, CheckboxGroup, Icon, Stack, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const MultipleChoiceQuestion = ({ question, userAnswer }) => {
  const correctAnswers = question?.correctAnswers || [];

  return (
    <Box>
      <CheckboxGroup value={userAnswer} isDisabled>
        <Stack direction="column" spacing={4}>
          {question.options.map((option, index) => {
            const isCorrect = correctAnswers.includes(option);
            const isSelected = userAnswer.includes(option);

            return (
              <Box
                key={index}
                bg={isSelected ? (isCorrect ? 'green.50' : 'red.50') : 'transparent'}
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Checkbox value={option} isDisabled>
                  {option}
                </Checkbox>
                {/* Display check icon if the option is correct */}
                {isCorrect && (
                  <Icon as={CheckCircleIcon} color="green.500" ml={2} />
                )}
              </Box>
            );
          })}
        </Stack>
      </CheckboxGroup>
      {/* Feedback message */}
      <Text mt={2} color={userAnswer.sort().toString() === correctAnswers.sort().toString() ? 'green.500' : 'red.500'}>
        {userAnswer.sort().toString() === correctAnswers.sort().toString() ? 'Your answers are correct' : 'Your answers are incorrect'}
      </Text>
    </Box>
  );
};

export default MultipleChoiceQuestion;