import React, { useEffect, useState } from 'react';
import { Box, Button, Collapse, HStack, Text, VStack } from '@chakra-ui/react';
import { getParts, getQuestionRange } from '~/utils/testUtils';

// PartSection Component
const PartSection = React.memo(
  ({
    part,
    questionRange = [],
    onPartClick,
    onScrollToQuestion,
    answers,
    selectedPartId,
  }) => {
    const isActive = selectedPartId === part?.id;

    // Count how many questions have been answered
    const answeredCount = questionRange.filter((question) =>
      answers.find((answer) => answer.testQuestionId === question.id),
    ).length;

    const handlePartClick = (e) => {
      e.preventDefault();
      onPartClick(part?.id);
    };

    return (
      <VStack
        spacing={2}
        p={2}
        h="auto"
        border="2px"
        borderColor={isActive ? 'teal.400' : 'transparent'}
        borderRadius="md"
        alignItems="flex-start"
        cursor="pointer"
        onClick={handlePartClick}
        minW="200px"
        transition="border-color 0.2s ease-in-out, transform 0.2s ease-in-out"
        _hover={{ borderColor: 'teal.300', transform: 'scale(1.05)' }}
      >
        {/* Collapsed View */}
        {!isActive ? (
          <Text fontWeight="bold" color="black">
            Part {part.ordinalNumber}:{' '}
            <Text as="span" fontWeight="normal">
              {answeredCount} of {questionRange.length} questions answered
            </Text>
          </Text>
        ) : (
          <Collapse in={isActive} animateOpacity>
            <HStack
              spacing={1}
              wrap="nowrap"
              whiteSpace="nowrap"
              overflowX="auto"
              maxW="100%"
              p={1}
            >
              {questionRange.map((question) => {
                const isAnswered = answers.find(
                  (answer) => answer.testQuestionId === question.id,
                );
                return (
                  <Button
                    key={question.id}
                    size="sm"
                    borderRadius="full"
                    variant={isAnswered ? 'solid' : 'outline'}
                    colorScheme={isAnswered ? 'teal' : 'gray'}
                    w="30px"
                    h="30px"
                    onClick={(e) => {
                      e.stopPropagation();
                      onScrollToQuestion(question.id);
                      onPartClick(part?.id);
                    }}
                    _active={{
                      transform: 'scale(0.95)',
                      transition: 'transform 0.1s ease-in-out',
                    }}
                  >
                    {question.ordinalNumber}
                  </Button>
                );
              })}
            </HStack>
          </Collapse>
        )}
      </VStack>
    );
  },
);

// TakeTestFooter Component
function TakeTestFooter({
  testId,
  selectedPartId,
  onPartClick,
  onScrollToQuestion,
  isRefresh,
  userAnswers, // Receives updated user answers
}) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const fetchParts = () => {
      return getParts(testId).map((part) => ({
        ...part,
        questionRange: getQuestionRange(testId, part),
      }));
    };
    const fetchedParts = fetchParts();
    setParts(fetchedParts);

    // Automatically click on the first part if it exists
    if (fetchedParts.length > 0 && !selectedPartId) {
      onPartClick(fetchedParts[0].id); // Trigger click on the first part
    }
  }, [testId, isRefresh, onPartClick, selectedPartId]);

  return (
    <Box
      w="100%"
      bg="white"
      position="sticky"
      bottom="0"
      left="0"
      zIndex="1000"
      overflowX="auto"
    >
      <HStack spacing={4} overflowX="auto" p={2}>
        {parts.map((part) => (
          <PartSection
            key={part.id}
            part={part}
            questionRange={part.questionRange}
            selectedPartId={selectedPartId}
            onPartClick={onPartClick}
            onScrollToQuestion={onScrollToQuestion}
            answers={userAnswers} // Pass user answers to determine completed questions
          />
        ))}
      </HStack>
    </Box>
  );
}

export default TakeTestFooter;
