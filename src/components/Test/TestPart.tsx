import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import QuestionItem from '~/components/Test/Question/QuestionItem';

const TestPartComponent = ({ section, onAnswerChange, answers }) => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        {section.title}
      </Text>

      <VStack spacing={6} w="100%">
        {section.questions.map((question) => (
          <Box
            key={question.id}
            w="100%"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            mb={4}
          >
            <QuestionItem
              question={question}
              selectedAnswer={answers[question.id]}
              onAnswerChange={onAnswerChange}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TestPartComponent;