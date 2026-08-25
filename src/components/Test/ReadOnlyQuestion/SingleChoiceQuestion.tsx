import React from 'react';
import { Box, Heading, Icon, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const SingleChoiceQuestion = ({ question, userAnswers }) => {
  const correctAnswers = question?.correctAnswers || [];

  return (
    <Box>
      <Heading size="md" mb={4}>{question.text}</Heading>
      <RadioGroup value={userAnswers[0]} isDisabled>
        <Stack direction="column" spacing={4}>
          {question.options.map((option, index) => {
            const isCorrect = correctAnswers.includes(option);
            const isSelected = userAnswers[0] === option;

            return (
              <Box
                key={index}
                bg={isSelected ? (isCorrect ? 'green.50' : 'red.50') : 'transparent'}
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Radio value={option} isDisabled>
                  {option}
                </Radio>
                {/* Display check icon if the option is correct */}
                {isCorrect && (
                  <Icon as={CheckCircleIcon} color="green.500" ml={2} />
                )}
              </Box>
            );
          })}
        </Stack>
      </RadioGroup>
      {/* Feedback message */}
      <Text mt={2} color={userAnswers[0] === correctAnswers[0] ? 'green.500' : 'red.500'}>
        {userAnswers[0] === correctAnswers[0] ? 'Your answer is correct' : 'Your answer is incorrect'}
      </Text>
    </Box>
  );
};

export default SingleChoiceQuestion;