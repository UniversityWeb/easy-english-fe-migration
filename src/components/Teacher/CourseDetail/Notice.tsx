import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, useToast, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import courseService from '~/services/courseService';
import useCustomToast from '~/hooks/useCustomToast';

const Notice = ({ courseId }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  const toast = useToast();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const courseRequest = { id: courseId };
        const courseCall = await courseService.fetchMainCourse(courseRequest);
        setCourse(courseCall);
        setContent(courseCall.notice || '');
      } catch (error) {
        errorToast('Error fetching notice');
      }
    };
    fetchNotice();
  }, [courseId]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const courseRequest = {
        id: courseId,
        notice: content,
        price: 0,
      };
      await courseService.updateCourseNotice(courseRequest);
      successToast('Notice updated successfully');
    } catch (error) {
      errorToast('Error updating notice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} w="100%" maxW="800px" mx="auto" mt={6}>
      <Box w="100%">
        <FormControl mb="4">
          <Box
            sx={{
              '.quill': {
                height: '370px',
                display: 'flex',
                flexDirection: 'column',
              },
              '.ql-container': {
                height: '320px',
                marginBottom: '20px',
              },
            }}
          >
            <ReactQuill
              value={content}
              onChange={handleContentChange}
              theme="snow"
              placeholder="Enter your notice here..."
            />
          </Box>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          isLoading={isLoading} // Show loading spinner while submitting
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </VStack>
  );
};

export default Notice;
