import React, { useState } from 'react';
import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

const SingleChoiceQuestion = ({ question, onQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onQuestionAnswered(question.id, [option]);
  };

  return (
    <RadioGroup onChange={handleOptionChange} value={selectedOption}>
      <Stack direction="column" spacing={4}>
        {question.options.map((option, index) => (
          <Radio key={index} value={option}>
            {option}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default SingleChoiceQuestion;
