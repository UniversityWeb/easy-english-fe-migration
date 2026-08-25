import React, { useState } from 'react';
import { Radio, RadioGroup, VStack } from '@chakra-ui/react';

const TrueFalseQuestion = ({ question, onQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onQuestionAnswered(question.id, [option]);
  };

  return (
    <VStack align="start" spacing={3}>
      {/* True/False Options */}
      <RadioGroup onChange={handleOptionChange} value={selectedOption} fontSize="md">
        <VStack align="start">
          <Radio value="True" colorScheme="blue">
            True
          </Radio>
          <Radio value="False" colorScheme="blue">
            False
          </Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  );
};

export default TrueFalseQuestion;