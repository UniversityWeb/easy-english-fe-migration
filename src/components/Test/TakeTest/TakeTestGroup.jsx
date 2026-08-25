import React from 'react';
import { Box, List, ListItem, Text, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import QuestionItem from '~/components/Test/Question/QuestionItem';

function TakeTestGroup({
  questionGroup,
  scrollToQuestion,
  onQuestionAnswered,
}) {
  const isRequirementEmpty = (text) => {
    return !text || text.trim().replace(/<[^>]+>/g, '').length === 0;
  };

  return (
    <VStack align="start" spacing={10} pt={4}>
      {questionGroup?.from !== questionGroup?.to && (
        <Text fontSize="md" fontWeight="bold">
          Question {questionGroup?.from} - {questionGroup?.to}
        </Text>
      )}

      {!isRequirementEmpty(questionGroup?.requirement) && (
        <Box
          w="100%"
          overflow="hidden"
          sx={{
            '.ql-editor': { lineHeight: '1.5' },
            '.ql-size-small': { fontSize: '16px' },
            '.ql-size-large': { fontSize: '18px' },
            '.ql-size-huge': { fontSize: '24px' },
            '.ql-editor p': { marginBottom: '15px' },
          }}
        >
          <ReactQuill
            value={questionGroup?.requirement}
            readOnly={true}
            theme={'bubble'}
            style={{ marginBottom: '0px', lineHeight: '1.5' }}
          />
        </Box>
      )}

      {/* Loop over the questions inside the question group */}
      <List spacing={4} w="100%">
        {questionGroup?.questions?.map((question) => (
          <ListItem key={question?.id} p={4} borderWidth="1px" borderRadius="md">
            <QuestionItem
              key={question.id}
              question={question}
              onQuestionAnswered={onQuestionAnswered}
              scrollToQuestion={scrollToQuestion}
            />
          </ListItem>
        ))}
      </List>
    </VStack>
  );
}

export default TakeTestGroup;
