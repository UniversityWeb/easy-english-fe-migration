import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Switch,
  Text,
  Textarea,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';

const TextLesson = ({ id, sectionId, isNew, onLessonSaved }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    description: '',
    duration: '',
    isPreview: false,
    startDate: '',
    startTime: '',
  });

  const { successToast, errorToast } = useCustomToast();

  // Fetch lesson data if ID is provided
  useEffect(() => {
    if (!isNew && id) {
      // Fetch existing lesson data
      let isMounted = true; // Mounted flag for component cleanup

      const fetchLesson = async () => {
        setLoading(true);
        try {
          const data = await lessonService.fetchLessonById({ id });
          if (data && isMounted) {
            // Check if component is still mounted
            setLesson({
              title: data.title || '',
              content: data.content || '',
              description: data.description || '',
              duration: data.duration || '',
              isPreview: data.isPreview || false,
              startDate: data.startDate || '',
              startTime: data.startTime || '',
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

      fetchLesson();

      return () => {
        isMounted = false; // Cleanup function to prevent memory leaks
      };
    } else {
      // Initialize new lesson state for a new lesson
      setLesson({
        title: '',
        content: '',
        description: '',
        duration: '',
        isPreview: false,
        startDate: '',
        startTime: '',
      });
    }
  }, [id, isNew]);

  // Handle form submission for create/update
  const validate = () => {
    const newErrors = {};

    // Kiểm tra tiêu đề
    if (!lesson.title) {
      newErrors.title = 'Title is required';
    }

    // Kiểm tra thời lượng
    if (!lesson.duration) {
      newErrors.duration = 'Duration is required';
    }

    // Kiểm tra mô tả
    if (!lesson.description) {
      newErrors.description = 'Description is required';
    }

    // Kiểm tra nội dung (HTML rỗng hoặc không có nội dung thực sự)
    const isContentEmpty = (content) => {
      return !content || content.trim() === '' || content === '<p><br></p>';
    };

    if (isContentEmpty(lesson.content)) {
      newErrors.content = 'Content is required';
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
    const formData = { ...lesson, sectionId, type: 'TEXT' };
    try {
      let savedLesson;
      if (id) {
        console.log('check', 'in update');
        savedLesson = await lessonService.updateLesson({ ...formData, id });
        console.log('check', 'out update');
        successToast('Lesson updated successfully');
      } else {
        savedLesson = await lessonService.createLesson(formData);
        successToast('Lesson created successfully');
      }

      console.log('after', savedLesson);
      if (onLessonSaved) {
        onLessonSaved(savedLesson); // Pass the saved lesson to the parent
      }
    } catch (error) {
      errorToast('Error saving the lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} paddingBottom={0} shadow="md" borderWidth="1px" width="100%">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <FormControl mb={4}>
            <FormLabel>Lesson Title</FormLabel>
            <Input
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              placeholder="Enter lesson title"
            />
            {errors.title && <Text color="red.500">{errors.title}</Text>}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Duration (minutes)</FormLabel>
            <Input
              type="number"
              value={lesson.duration}
              onChange={(e) =>
                setLesson({ ...lesson, duration: e.target.value })
              }
              placeholder="Enter lesson duration"
            />
            {errors.duration && <Text color="red.500">{errors.duration}</Text>}
          </FormControl>

          <FormControl display="none" alignItems="center" mb={4}>
            <Switch
              id="preview-switch"
              isChecked={lesson.isPreview}
              onChange={(e) =>
                setLesson({ ...lesson, isPreview: e.target.checked })
              }
            />
            <FormLabel htmlFor="preview-switch" ml={2}>
              Enable Preview
            </FormLabel>
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={6} display="none">
            <GridItem>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={lesson.startDate}
                  onChange={(e) =>
                    setLesson({ ...lesson, startDate: e.target.value })
                  }
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={lesson.startTime}
                  onChange={(e) =>
                    setLesson({ ...lesson, startTime: e.target.value })
                  }
                />
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={lesson.description}
              onChange={(e) =>
                setLesson({ ...lesson, description: e.target.value })
              }
              placeholder="Enter lesson description"
              height="170px"
            />
            {errors.description && (
              <Text color="red.500">{errors.description}</Text>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Content</FormLabel>
            <Box
              sx={{
                '.quill': {
                  height: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                },
                '.ql-container': {
                  height: '310px',
                  marginBottom: '20px',
                },
              }}
            >
              <ReactQuill
                value={lesson.content}
                onChange={(content) => setLesson({ ...lesson, content })}
                theme="snow"
                placeholder="Enter lesson content"
                style={{ height: '380px', marginBottom: '20px' }}
              />
            </Box>
            {errors.content && <Text color="red.500">{errors.content}</Text>}
          </FormControl>

          <Box position="sticky" bottom={0} bg="white" p={4} zIndex={5}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
              >
                {id ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TextLesson;
