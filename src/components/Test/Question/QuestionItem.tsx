import React, { useEffect, useRef } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { QUESTION_TYPES } from '~/utils/constants';
import SingleChoiceQuestion from '~/components/Test/Question/SingleChoiceQuestion';
import MultipleChoiceQuestion from '~/components/Test/Question/MultipleChoiceQuestion';
import TrueFalseQuestion from '~/components/Test/Question/TrueFalseQuestion';
import MatchingQuestion from '~/components/Test/Question/MatchingQuestion';
import FillBlankQuestion from '~/components/Test/Question/FillBlankQuestion';

const QuestionItem = ({ question, scrollToQuestion, onQuestionAnswered }) => {
  const questionRef = useRef(null);

  useEffect(() => {
    if (scrollToQuestion === question.id && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToQuestion, question.id]);

  const renderQuestion = () => {
    const commonProps = {
      onQuestionAnswered,
      question,
    };

    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <SingleChoiceQuestion {...commonProps} />;
      case QUESTION_TYPES.MULTI_CHOICE:
        return <MultipleChoiceQuestion {...commonProps} />;
      case QUESTION_TYPES.TRUE_FALSE:
        return <TrueFalseQuestion {...commonProps} />;
      case QUESTION_TYPES.MATCHING:
        return <MatchingQuestion {...commonProps} />;
      case QUESTION_TYPES.FILL_BLANK:
        return <FillBlankQuestion {...commonProps} />;
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <Box ref={questionRef}>
      {question.type !== QUESTION_TYPES.FILL_BLANK && (
        <Heading as="h4" size="sm" mb={4}>
          Question {question.ordinalNumber}. {question.title}
        </Heading>
      )}

      {renderQuestion()}
    </Box>
  );
};

export default QuestionItem;
