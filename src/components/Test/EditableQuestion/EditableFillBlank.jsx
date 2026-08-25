import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { ContentState, convertToRaw, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const EditableFillBlank = ({ question, onUpdateQuestionField }) => {
  const [editorState, setEditorState] = useState(() =>
    question.description
      ? EditorState.createWithContent(ContentState.createFromText(question.description))
      : EditorState.createEmpty()
  );
  const [blanks, setBlanks] = useState([]);
  const [answers, setAnswers] = useState(question.correctAnswers || []);

  // Ref to store the timeout ID for debouncing
  const updateTimeoutRef = useRef(null); // Timeout ID for debouncing description update

  // Debounce the description update on the parent component by 1000ms
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      const description = rawContent.blocks.map((block) => block.text).join(' ');

      const title = getTitleWithBlanks(description);
      const correctAnswers = extractBlanksFromDescription(description);

      onUpdateQuestionField({
        title: title,
        description: description,
        correctAnswers: correctAnswers,
      });
    }, 1500);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [editorState]);

  // Extract blanks from the description based on the | | syntax
  const extractBlanksFromDescription = (description) => {
    // Regular expression to match text between pipe characters
    const regex = /\|([^\|]+)\|/g;
    const matchedBlanks = []; // Array to store extracted values

    let match; // Variable to hold the current match
    // Use regex.exec to find all matches in the text
    while ((match = regex.exec(description)) !== null) {
      matchedBlanks.push(match[1]); // match[1] contains the text between | |
    }

    // Update the state with the extracted blanks
    setBlanks(matchedBlanks); // Update the blanks state

    // Check if the number of extracted blanks is different from the number of existing answers
    if (matchedBlanks.length !== answers.length) {
      setAnswers(matchedBlanks); // Update the answers state
    }
    return matchedBlanks;
  };

  // Handle text change in the editor (for description)
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // Display the title with blanks
  const getTitleWithBlanks = (rawText) => {
    return rawText.replace(/\|([^\|]+)\|/g, '___'); // Replace |text| with ___
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      {/* Title (Question with blanks) */}
      <Box mb={4}>
        <Text mb={2} fontWeight="bold">Question</Text>
        <Text fontSize="lg" mb={2}>
          {question?.title} {/* Display the title with blanks */}
        </Text>
      </Box>

      {/* Rich Text Editor for the Fill-in-the-Blank Description */}
      <Box mb={4}>
        <Text mb={2} fontWeight="bold">Description (Fill in the blank text)</Text>
        <Box border="1px solid gray" borderRadius="md" p={2} bg="white">
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Enter the text with blanks marked using | |"
          />
        </Box>
      </Box>

      {/* Dynamic Answer Inputs */}
      {blanks.map((blank, index) => (
        <Box mb={4} key={index}>
          <Text mb={2} fontWeight="bold">Answer {index + 1}</Text>
          <Input
            placeholder={`Enter the correct answer for blank ${index + 1}`}
            value={answers[index] || ''}
            isReadOnly
          />
        </Box>
      ))}

      {/* Example Section */}
      <Flex align="center" bg="blue.50" p={3} borderRadius="md">
        <InfoIcon color="blue.500" mr={2} />
        <Text fontSize="sm">
          <strong>Example:</strong> She is good |at| math. This will display as "She is good ___ math."
        </Text>
      </Flex>
    </Box>
  );
};

export default EditableFillBlank;