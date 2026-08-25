import React, { useEffect, useState } from 'react';
import { Box, Flex, Select, Text, VStack } from '@chakra-ui/react';

const MatchingQuestion = ({ question, onQuestionAnswered }) => {
  const { options, correctAnswers } = question;
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(options.length).fill(""));

  const shuffleArray = (array) => {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle change when an answer is selected
  const handleSelectChange = (index, value) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = value;
    setSelectedAnswers(updatedAnswers); // Update the local state

    // Automatically submit the answers whenever an option is selected
    onQuestionAnswered(question.id, updatedAnswers);
  };

  useEffect(() => {
    if (correctAnswers) {
      const shuffled = shuffleArray(correctAnswers);
      setShuffledAnswers(shuffled);
    }
  }, [correctAnswers]);

  return (
    <VStack align="start" spacing={4} width="100%">
      {options.map((option, index) => (
        <Box
          key={index}
          p={3}
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          width="100%"
        >
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {/* Display the option text with truncation for long text */}
            <Text
              fontWeight="bold"
              fontSize="sm"
              isTruncated
              maxWidth="70%"  // Adjust the max width of the text to keep the select box aligned
              title={option}  // Show full text on hover
              mr={4}          // Add margin between text and the select box
            >
              {option}
            </Text>

            {/* Dropdown for selecting the answer */}
            <Select
              fontSize="sm"
              placeholder="Select an answer"
              value={selectedAnswers[index] || ""}  // Bind the value to the selectedAnswers state
              onChange={(e) => handleSelectChange(index, e.target.value)}  // Update the state on change
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              minWidth="180px"
              maxWidth="30%"  // Restrict the select box width for better alignment
              _hover={{ borderColor: "gray.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
            >
              {shuffledAnswers.map((answer, i) => (
                <option key={i} value={answer}>
                  {answer}
                </option>
              ))}
            </Select>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};

export default MatchingQuestion;
