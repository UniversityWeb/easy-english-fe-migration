import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Switch,
  Textarea,
  Text,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';
import VideoPicker from '~/components/VideoPicker';
import VideoPlayer from './VideoPlayer';

const VideoLesson = ({ sectionId, id, isNew, onLessonSaved }) => {
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    contentUrl: '',
    description: '',
    duration: '',
    isPreview: false,
    startDate: '',
    startTime: '',
  });
  const [video, setVideo] = useState(null);
  const [sourceType, setSourceType] = useState('MP4');
  // Add separate state for YouTube and MP4 URLs
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [mp4Url, setMp4Url] = useState('');

  const { successToast, errorToast } = useCustomToast();
  const [errors, setErrors] = useState({});

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

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

    // Kiểm tra video hoặc liên kết YouTube
    if (sourceType === 'MP4' && !mp4Url) {
      newErrors.contentUrl = 'MP4 video is required';
    }

    if (sourceType === 'YouTube' && !youtubeUrl) {
      newErrors.contentUrl = 'YouTube URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    let isMounted = true;

    const fetchLesson = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await lessonService.fetchLessonById({ id });
        if (data && isMounted) {
          const isYouTube = data.contentUrl?.includes('youtube.com');
          setLesson({
            title: data.title || '',
            content: data.content || '',
            contentUrl: data.contentUrl || '',
            description: data.description || '',
            duration: data.duration || '',
            isPreview: data.isPreview || false,
            startDate: data.startDate || '',
            startTime: data.startTime || '',
          });
          // Set the appropriate URL based on type
          if (isYouTube) {
            setYoutubeUrl(data.contentUrl || '');
            setSourceType('YouTube');
          } else {
            setMp4Url(data.contentUrl || '');
            setSourceType('MP4');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error(error?.message);
          errorToast('Error fetching lesson data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!isNew && id) {
      fetchLesson();
    }

    return () => {
      isMounted = false;
    };
  }, [id, isNew]);

  useEffect(() => {
    return () => {
      if (mp4Url && mp4Url.startsWith('blob:')) {
        URL.revokeObjectURL(mp4Url);
      }
    };
  }, [mp4Url]);

  const handleSourceTypeChange = (e) => {
    const newSourceType = e.target.value;
    setSourceType(newSourceType);
    // Update contentUrl based on the selected source type
    if (newSourceType === 'YouTube') {
      setLesson((prev) => ({ ...prev, contentUrl: youtubeUrl }));
    } else {
      setLesson((prev) => ({ ...prev, contentUrl: mp4Url }));
    }
  };

  const handleUrlChange = (url) => {
    if (sourceType === 'YouTube') {
      setYoutubeUrl(url);
      setLesson((prev) => ({ ...prev, contentUrl: url }));
    } else {
      setMp4Url(url);
      setLesson((prev) => ({ ...prev, contentUrl: url }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      errorToast('Please fill in all required fields');
      return;
    }
    setLoading(true);

    const formData = {
      ...lesson,
      sectionId,
      type: 'VIDEO',
      ...(sourceType === 'MP4' && video ? { file: video } : {}),
    };

    try {
      let savedLesson;
      if (id) {
        savedLesson = await lessonService.updateLesson({ ...formData, id });
        successToast('Lesson updated successfully');
      } else {
        savedLesson = await lessonService.createLesson(formData);
        successToast('Lesson created successfully');
      }
      if (onLessonSaved) {
        onLessonSaved(savedLesson);
      }
    } catch (error) {
      errorToast('Error saving the lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} pb={0} shadow="md" borderWidth="1px" width="100%">
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
            <FormLabel>Source Type</FormLabel>
            <Select value={sourceType} onChange={handleSourceTypeChange}>
              <option value="MP4">MP4</option>
              <option value="YouTube">YouTube</option>
            </Select>
          </FormControl>

          {sourceType === 'YouTube' ? (
            <FormControl mb={4} isInvalid={!!errors.contentUrl}>
              <FormLabel>YouTube Video URL</FormLabel>
              <Input
                value={youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Enter YouTube video URL"
              />
              {errors.contentUrl && (
                <Text color="red.500">{errors.contentUrl}</Text>
              )}
            </FormControl>
          ) : (
            <FormControl mb={4} isInvalid={!!errors.contentUrl}>
              <VideoPicker
                title={'Upload Video (MP4)'}
                videoPreview={mp4Url}
                setVideoPreview={(url) => handleUrlChange(url)}
                setVideoFile={setVideo}
              />
              {errors.contentUrl && (
                <Text color="red.500">{errors.contentUrl}</Text>
              )}
            </FormControl>
          )}

          <Box mb={4}>
            {sourceType === 'YouTube' && (
              <VideoPlayer url={youtubeUrl} type={sourceType} />
            )}
          </Box>

          {/* Rest of the form remains the same */}
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

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={lesson.description}
              onChange={(e) =>
                setLesson({ ...lesson, description: e.target.value })
              }
              placeholder="Enter lesson description"
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
                  height: '350px',
                  marginBottom: '20px',
                },
              }}
            >
              <ReactQuill
                value={lesson.content}
                onChange={(content) => setLesson({ ...lesson, content })}
                theme="snow"
                placeholder="Enter lesson content"
                style={{ height: '420px', marginBottom: '20px' }}
              />
              {errors.content && <Text color="red.500">{errors.content}</Text>}
            </Box>
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

export default VideoLesson;
