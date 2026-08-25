import React from 'react';
import { Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';

const FillBlankQuestion = ({ question, userAnswers }) => {
  const correctAnswers = question?.correctAnswers || [];
  const parts = question?.title.split("___");

  const renderQuestion = () => {
    let count = 0;
    return parts.map((part, index) => {
      if (index < parts.length - 1) {
        const isCorrect = userAnswers[count] === correctAnswers[count];
        count++;
        return (
          <React.Fragment key={index}>
            <Text display="inline" fontSize="md" fontWeight="medium">
              {part}
            </Text>
            <Input
              fontSize="md"
              value={userAnswers[index]}
              isDisabled
              width="120px"
              mx={2}
              textAlign="center"
              bg={isCorrect ? "green.100" : "red.100"}
              borderColor={isCorrect ? "green.500" : "red.500"}
              color={isCorrect ? "green.700" : "red.700"}
            />
            {isCorrect ? null : (
              <Text display="inline" color="green.500" fontSize="md">
                (Correct: {correctAnswers[index]})
              </Text>
            )}
          </React.Fragment>
        );
      }
      return (
        <Text key={index} display="inline" fontSize="lg" fontWeight="medium">
          {part}
        </Text>
      );
    });
  };

  return (
    <VStack align="start" spacing={4}>
      <Heading as="h4" size="sm" mb={4}>
        Question {question?.ordinalNumber}:
      </Heading>
      <HStack align="start" wrap="wrap">
        {renderQuestion()}
      </HStack>
    </VStack>
  );
};

export default FillBlankQuestion;