import React, { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import writingService from '~/services/writingService';
import { Support } from '@mui/icons-material';
import SupportWriting from './SupportWriting';

const Writing = ({
  id,
  sectionId,
  ordinalNumber,
  testId,
  isNew,
  onWritingSaved,
}) => {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [writing, setWriting] = useState({
    id: '',
    title: '',
    instructions: '',
    level: 'INTERMEDIATE',
    startDate: '',
    endDate: '',
  });
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    if (!isNew && id) {
      // Fetch existing lesson data
      let isMounted = true; // Mounted flag for component cleanup

      const fetchWriting = async () => {
        setLoading(true);
        try {
          const data = await writingService.fetchWritingById(id);
          if (data && isMounted) {
            // Check if component is still mounted
            setWriting({
              id: data.id || '',
              title: data.title || '',
              level: data.level || '',
              instructions: data.instructions || '',
              startDate: data.startDate || '',
              startTime: data.startTime || '',
              endDate: data.endDate || '',
            });
            //successToast('Lesson data fetched successfully');
          }
        } catch (error) {
          if (isMounted) {
            console.error(error?.message);
            errorToast('Error fetching lesson data');
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchWriting();

      return () => {
        isMounted = false; // Cleanup function to prevent memory leaks
      };
    } else {
      // Initialize new lesson state for a new lesson
      setWriting({
        title: '',
        level: 'INTERMEDIATE',
        instructions: '',
        startDate: '',
        startTime: '',
      });
    }
  }, [id, isNew]);

  const validate = () => {
    const newErrors = {};

    if (!writing.title) {
      newErrors.title = 'Title is required';
    }

    if (!writing.instructions) {
      newErrors.instructions = 'Instructions is required';
    }

    if (!writing.level) {
      newErrors.level = 'Level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      errorToast('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Construct the formData object
    const formData = {
      ...writing,
      sectionId,
    };

    try {
      let savedWriting;
      if (id) {
        savedWriting = await writingService.updateWriting(id, {
          ...formData,
          status: 'DRAFT',
          id,
        });
        successToast('Lesson updated successfully');
      } else {
        savedWriting = await writingService.createWriting(formData);
        successToast('Lesson created successfully');
      }
      if (onWritingSaved) {
        onWritingSaved(savedWriting); // Pass the saved lesson to the parent
      }
    } catch (error) {
      errorToast('Error saving the lesson');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px">
      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab>Test</Tab>
          <Tab>Result</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p={5} pb={0} shadow="md" borderWidth="1px" width="100%">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <FormControl mb={4}>
                    <FormLabel>Writing Title</FormLabel>
                    <Input
                      value={writing.title}
                      onChange={(e) =>
                        setWriting({ ...writing, title: e.target.value })
                      }
                      placeholder="Enter writing title"
                    />
                    {errors.title && (
                      <Text color="red.500">{errors.title}</Text>
                    )}
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Level</FormLabel>
                    <Select
                      value={writing.level}
                      onChange={(e) =>
                        setWriting({ ...writing, level: e.target.value })
                      }
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </Select>
                    {errors.level && (
                      <Text color="red.500">{errors.level}</Text>
                    )}
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea
                      value={writing.instructions}
                      onChange={(e) =>
                        setWriting({ ...writing, instructions: e.target.value })
                      }
                      placeholder="Enter instructions for the writing task"
                    />
                    {errors.instructions && (
                      <Text color="red.500">{errors.instructions}</Text>
                    )}
                  </FormControl>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Start Date</FormLabel>
                        <Input
                          value={writing.startDate}
                          type="datetime-local"
                          onChange={(e) =>
                            setWriting({
                              ...writing,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>End Date</FormLabel>
                        <Input
                          value={writing.endDate}
                          onChange={(e) =>
                            setWriting({ ...writing, endDate: e.target.value })
                          }
                          type="datetime-local"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Box position="sticky" bottom={0} bg="white" p={4} zIndex={5}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={loading}
                      >
                        {id ? 'Update Writing' : 'Create Writing'}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <SupportWriting infoWriting={writing} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Writing;
