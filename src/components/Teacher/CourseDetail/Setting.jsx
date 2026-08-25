import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select as ChakraSelect,
  Switch,
  Textarea,
  Text,
} from '@chakra-ui/react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import courseService from '~/services/courseService';
import categoryService from '~/services/categoryService';
import topicService from '~/services/topicService';
import levelService from '~/services/levelService';
import { getUsername } from '~/utils/authUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import ImagePicker from '~/components/ImagePicker';
import VideoPicker from '~/components/VideoPicker';

const Setting = React.memo(({ courseId }) => {
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const username = getUsername();
  const [course, setCourse] = useState({
    title: '',
    categoryIds: [],
    levelId: '',
    topicId: '',
    description: '',
    descriptionPreview: '',
    duration: '',
    isPublish: true,
    ownerUsername: 'admin',
    imagePreview: '',
    videoPreview: '',
  });

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [imageFile, setImageFile] = useState(null); // Store the actual image file
  const [videoFile, setVideoFile] = useState(null); // Store the actual video file
  const [isSaving, setIsSaving] = useState(false); // Loading state for image processing
  const { successToast, errorToast } = useCustomToast();

  // Fetch categories and topics on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedCategories, fetchedTopics] = await Promise.all([
          categoryService.fetchAllCategory(),
          topicService.fetchAllTopic(),
        ]);
        setCategories(fetchedCategories || []);
        setTopics(fetchedTopics || []);
      } catch (error) {
        console.error('Error fetching categories or topics.', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch course data if courseId is provided
  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const courseRequest = { id: courseId };
          const data = await courseService.fetchMainCourse(courseRequest);
          console.log('Fetched course data:', data);
          setCourse({
            title: data.title,
            categoryIds: data.categories.map((category) => category.id),
            topicId: data.topic.id,
            levelId: data.level.id,
            description: data.description,
            descriptionPreview: data.descriptionPreview,
            duration: data.duration,
            status: data.status,
            createdBy: data.createdBy,
            imagePreview: data.imagePreview,
            videoPreview: data.videoPreview,
          });

          if (data.topic.id) {
            const levels = await levelService.fetchAllLevelByTopic({
              topicId: data.topic.id,
            });
            setLevels(levels || []);
          }
        } catch (error) {
          console.error('Error fetching course data.', error);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  // Handle topic change and fetch levels
  const handleTopicChange = async (e) => {
    const selectedTopicId = e.target.value;
    setCourse({ ...course, topicId: selectedTopicId, levelId: '' });

    try {
      const fetchedLevels = await levelService.fetchAllLevelByTopic({
        topicId: selectedTopicId,
      });
      setLevels(fetchedLevels || []);
    } catch (error) {
      console.error('Error fetching levels for the selected topic.', error);
    }
  };

  // Handle category selection changes
  const handleCategoryChange = (selectedOptions) => {
    const selectedCategoryIds = selectedOptions.map((option) => option.value);
    setCourse({ ...course, categoryIds: selectedCategoryIds });
  };

  const handleDescriptionChange = (content) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      description: content,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!course.title) {
      newErrors.title = 'Course name is required';
    }
    if (!course.duration) {
      newErrors.duration = 'Duration is required';
    }
    if (!course.descriptionPreview) {
      newErrors.descriptionPreview = 'Description preview is required';
    }
    const isContentEmpty = (content) => {
      return !content || content.trim() === '' || content === '<p><br></p>';
    };
    if (isContentEmpty(course.description)) {
      newErrors.description = 'Description is required';
    }
    if (!course.topicId) {
      newErrors.topicId = 'Topic is required';
    }
    if (!course.levelId) {
      newErrors.levelId = 'Level is required';
    }
    if (!course.categoryIds || course.categoryIds.length === 0) {
      newErrors.categoryIds = 'At least one category is required';
    }
    if (!imageFile && !course.imagePreview) {
      newErrors.imageFile = 'An image is required';
    }
    if (!videoFile && !course.videoPreview) {
      newErrors.videoFile = 'A video is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission (create or update)
  const handleSubmit = async () => {
    if (!validate()) {
      errorToast('Please fill in all required fields');
      return;
    }
    setIsSaving(true);
    const formData = new FormData();
    formData.append('ownerUsername', username);
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('descriptionPreview', course.descriptionPreview);
    formData.append('duration', course.duration);
    formData.append('status', course.status);
    formData.append('imagePreview', course.imagePreview);
    formData.append('videoPreview', course.videoPreview);
    course.categoryIds.forEach((id) => {
      formData.append('categoryIds', id); // Thêm từng categoryId vào FormData
    });
    formData.append('topicId', course.topicId);
    formData.append('levelId', course.levelId);
    formData.append('createdBy', course.createdBy);

    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (courseId) {
        formData.append('id', courseId);
        await courseService.updateCourse(formData);
        successToast('Course updated successfully.');
        console.log('Course updated successfully.');
      } else {
        const newCourse = await courseService.createCourse(formData);
        const newCourseId = newCourse.id;
        console.log('newCourseId', newCourseId);
        successToast('Course created successfully.');
        console.log('Course created successfully.');

        navigate(config.routes.course_detail(newCourseId));
      }
    } catch (error) {
      errorToast('Error saving course.');
      console.error('Error saving course.', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box pb={10} maxW="600px" mx="auto">
      <Center mt={10} mb={5}>
        <Heading>{courseId ? 'Update Course' : 'Create Course'}</Heading>
      </Center>

      <FormControl mb="4">
        <FormLabel>Course name</FormLabel>
        <Input
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          placeholder="Enter course name"
        />
        {errors.title && <Text color="red.500">{errors.title}</Text>}
      </FormControl>

      <FormControl mb="4" display="none">
        <FormLabel>Course publish</FormLabel>
        <Switch
          isChecked={course.isPublish}
          onChange={() =>
            setCourse({ ...course, isPublish: !course.isPublish })
          }
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Category</FormLabel>
        <Select
          isMulti
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={categories
            .filter((category) => course.categoryIds.includes(category.id))
            .map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          onChange={handleCategoryChange}
          placeholder="Select categories"
        />
        {errors.categoryIds && (
          <Text color="red.500">{errors.categoryIds}</Text>
        )}
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Topic</FormLabel>
        <ChakraSelect
          placeholder="Select topic"
          value={course.topicId}
          onChange={handleTopicChange}
        >
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </ChakraSelect>
        {errors.topicId && <Text color="red.500">{errors.topicId}</Text>}
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Level</FormLabel>
        <ChakraSelect
          placeholder="Select level"
          value={course.levelId}
          onChange={(e) => setCourse({ ...course, levelId: e.target.value })}
          isDisabled={!levels.length}
        >
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </ChakraSelect>
        {errors.levelId && <Text color="red.500">{errors.levelId}</Text>}
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Course duration (hours)</FormLabel>
        <Input
          type="number"
          placeholder="Enter course duration"
          value={course.duration}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
        />
        {errors.duration && <Text color="red.500">{errors.duration}</Text>}
      </FormControl>

      <VideoPicker
        title={'Video'}
        videoPreview={course.videoPreview}
        setVideoPreview={(videoPreview) =>
          setCourse({ ...course, videoPreview: videoPreview })
        }
        setVideoFile={setVideoFile}
      />
      {errors.videoFile && <Text color="red.500">{errors.videoFile}</Text>}

      <ImagePicker
        title={'Image'}
        imagePreview={course?.imagePreview}
        setImagePreview={(imagePreview) =>
          setCourse({ ...course, imagePreview: imagePreview })
        }
        setImageFile={setImageFile}
      />
      {errors.imageFile && <Text color="red.500">{errors.imageFile}</Text>}

      <FormControl mb="4">
        <FormLabel>Description preview</FormLabel>
        <Textarea
          placeholder="Enter a short description preview..."
          rows={6}
          value={course.descriptionPreview}
          onChange={(e) =>
            setCourse({ ...course, descriptionPreview: e.target.value })
          }
        />
        {errors.descriptionPreview && (
          <Text color="red.500">{errors.descriptionPreview}</Text>
        )}
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Description</FormLabel>
        <Box
          sx={{
            '.quill': {
              height: '270px',
              display: 'flex',
              flexDirection: 'column',
            },
            '.ql-container': {
              height: '220px',
              marginBottom: '20px',
            },
          }}
        >
          <ReactQuill
            value={course.description}
            onChange={handleDescriptionChange}
            theme="snow"
            placeholder="Enter your description here..."
          />
          {errors.description && (
            <Text color="red.500">{errors.description}</Text>
          )}
        </Box>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        onClick={handleSubmit}
        isLoading={isSaving}
        isDisabled={isSaving}
        loadingText={'Saving...'}
      >
        {courseId ? 'Update Course' : 'Create Course'}
      </Button>
    </Box>
  );
});

export default Setting;
