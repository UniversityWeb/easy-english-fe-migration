import React, { useState } from 'react';
import { HStack, Input, Text, VStack } from '@chakra-ui/react';

const FillBlankQuestion = ({ question, onQuestionAnswered }) => {
  // Extract parts using "___" as the delimiter
  const parts = question?.title.split("___");
  const [answers, setAnswers] = useState(Array(parts.length - 1).fill(""));

  // Handle input change for each blank
  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onQuestionAnswered(question.id, newAnswers);
  };

  // Render the text with inputs based on the "___" delimiter
  const renderQuestion = () => {
    let count = 0;
    return parts.map((part, index) => {
      // Render an input for each blank, except after the last part
      if (index < parts.length - 1) {
        count++;
        return (
          <React.Fragment key={index}>
            <Text display="inline" fontSize="md" fontWeight="medium">
              {part}
            </Text>
            <Input
              fontSize="md"
              placeholder={count}
              value={answers[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              width="120px"
              mx={2}
              textAlign="center"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              _hover={{ borderColor: "gray.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
              transition="border-color 0.2s ease, box-shadow 0.2s ease"
            />
          </React.Fragment>
        );
      }
      // Render the last part (after the final blank)
      return (
        <Text key={index} display="inline" fontSize="lg" fontWeight="medium">
          {part}
        </Text>
      );
    });
  };

  return (
    <VStack align="start" spacing={4}>
      <Text fontWeight="bold" fontSize="sm" color="gray.700">
        Question {question?.ordinalNumber + 1}:
      </Text>
      <HStack align="start" wrap="wrap">
        {renderQuestion()}
      </HStack>
    </VStack>
  );
};

export default FillBlankQuestion;