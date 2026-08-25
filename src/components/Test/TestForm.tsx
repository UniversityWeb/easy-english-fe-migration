import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Heading, Icon, Input, Select, Text, VStack } from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import testService from '~/services/testService';
import { TEST_STATUSES, TEST_TYPES } from '~/utils/constants';
import { InfoIcon } from '@chakra-ui/icons';
import CustomReactQuill from '~/components/CustomReactQuill';

const TestForm = ({ sectionId, ordinalNumber, testState, setTestState, onTestSaved, isNew }) => {
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const testId = testState?.id || 0;
      const newTest = {
        ...testState,
        id: testId,
        sectionId,
        ordinalNumber,
        type: testState?.type || TEST_TYPES.CUSTOM,
        passingGrade: Number(testState.passingGrade),
      };

      let testResponse;
      if (testId) {
        testResponse = await testService.update(testId, newTest);
        successToast("Test updated successfully!");
      } else {
        testResponse = await testService.create(newTest);
        successToast("Test created successfully!");
      }

      if (testResponse) {
        onTestSaved(testResponse);
      }
    } catch (error) {
      console.error("Error saving test:", error);
      errorToast("Failed to save test.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const convertToMilliseconds = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60000;
  };

  return (
    <Box p={4}>
      <Heading mb={10}>{isNew ? 'Add new test' : 'Update test'}</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={testState.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <CustomReactQuill
              value={testState?.description}
              onChange={desc => setTestState((prevState) => ({ ...prevState, description: desc }))}
              placeholder={"Enter your description here..."}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Duration (hours / minutes)</FormLabel>
            <Input
              type="time"
              value={formatTime(testState.durationInMilis)}
              onChange={(e) => {
                const newDurationInMilis = convertToMilliseconds(e.target.value);
                setTestState({ ...testState, durationInMilis: newDurationInMilis });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Passing Grade (%)</FormLabel>
            <Input
              type="number"
              name="passingGrade"
              value={testState?.passingGrade}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Test Type</FormLabel>
            <Select
              name="type"
              value={testState?.type}
              onChange={(e) => setTestState({ ...testState, type: e.target.value })}
              isDisabled={!isNew}
            >
              <option value="">Select Test Type</option>
              <option value={TEST_TYPES.QUIZ}>Quiz</option>
              <option value={TEST_TYPES.CUSTOM}>Custom</option>
            </Select>
          </FormControl>

          <Box mt={4} p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <VStack spacing={2} align="start">
              <Box display="flex" justifyContent="center" width="100%">
                <Icon as={InfoIcon} color="blue.500" boxSize={5} />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                  Quiz:
                  <Text as="span" color="gray.700" fontWeight="normal">
                    {' '}A simple test with multiple questions.
                  </Text>
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="blue.600" mt={1}>
                  Custom:
                  <Text as="span" color="gray.700" fontWeight="normal">
                    {' '}A customizable test with multiple sections, question groups, and individual questions.
                  </Text>
                </Text>
              </Box>
            </VStack>
          </Box>

          <FormControl isRequired>
            <FormLabel>Test Status</FormLabel>
            <Select
              name="status"
              value={testState.status}
              onChange={(e) => setTestState({ ...testState, status: e.target.value })}
            >
              <option value="">Select Test Status</option>
              <option value={TEST_STATUSES.DISPLAY}>Display</option>
              <option value={TEST_STATUSES.HIDE}>Hide</option>
              <option value={TEST_STATUSES.DRAFT}>Draft</option>
            </Select>
          </FormControl>

          <Button colorScheme="blue" type="submit" isLoading={loading}>
            {isNew ? 'Create Test' : 'Update Test'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TestForm;