import React from 'react';
import { Box, Flex, Select, Text, Tooltip, VStack } from '@chakra-ui/react';

const MatchingQuestion = ({ question, userAnswers }) => {
  const correctAnswers = question?.correctAnswers || [];
  const { options } = question;

  return (
    <VStack align="start" spacing={4} width="100%">
      {options.map((option, index) => {
        const isCorrect = userAnswers[index] === correctAnswers[index];
        return (
          <Box
            key={index}
            p={4}
            bg="white"
            border="2px solid"
            borderColor={isCorrect ? "green.400" : "red.400"}
            borderRadius="md"
            width="100%"
            boxShadow="md"
          >
            {/* Adjusted Flex to stack items vertically */}
            <Flex alignItems="flex-start" justifyContent="flex-start" flexDirection="column" width="100%">
              {/* Tooltip with Modified maxWidth */}
              <Tooltip label={option} hasArrow maxWidth="400px">
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  maxWidth="100%"  // Remove truncation for better readability
                  title={option}
                  mb={2}  // Add margin between the text and Select box
                >
                  {option}
                </Text>
              </Tooltip>

              {/* Select box stacked vertically below the text */}
              <Select
                fontSize="md"
                value={userAnswers[index] || ""}
                isDisabled
                bg={isCorrect ? "green.100" : "red.100"}
                borderColor={isCorrect ? "green.400" : "red.400"}
                minWidth="200px"  // Ensure enough width for longer answers
                width="100%"  // Make the Select box take full width
                mb={2}  // Add margin between Select and Correct Answer text
              >
                {correctAnswers.map((answer, i) => (
                  <option key={i} value={answer}>
                    {answer}
                  </option>
                ))}
              </Select>

              {/* Display Correct Answer below the Select */}
              {!isCorrect && (
                <Text fontSize="sm" color="green.500">
                  Correct: {correctAnswers[index]}
                </Text>
              )}
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
};

export default MatchingQuestion;