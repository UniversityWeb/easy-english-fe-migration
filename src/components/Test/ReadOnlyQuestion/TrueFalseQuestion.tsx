import React from 'react';
import { Box, Icon, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const TrueFalseQuestion = ({ question, userAnswers }) => {
  const correctAnswers = question?.correctAnswers || [];

  return (
    <Box>
      <Text fontSize="lg" mb={4}>{question.text}</Text>
      <RadioGroup value={userAnswers[0]} isDisabled>
        <VStack align="start">
          {["True", "False"].map((option, index) => {
            const isCorrect = correctAnswers[0] === option;
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
                {isCorrect && (
                  <Icon as={CheckCircleIcon} color="green.500" ml={2} />
                )}
              </Box>
            );
          })}
        </VStack>
      </RadioGroup>
      <Text mt={2} color={userAnswers[0] === correctAnswers[0] ? 'green.500' : 'red.500'}>
        {userAnswers[0] === correctAnswers[0] ? 'Your answer is correct' : 'Your answer is incorrect'}
      </Text>
    </Box>
  );
};

export default TrueFalseQuestion;