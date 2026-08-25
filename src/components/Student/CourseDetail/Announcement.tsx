import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import courseService from '~/services/courseService';
import './Description.css';

const Announcement = ({ courseId }) => {
  const [course, setCourse] = useState(null);

  const fetchCourseDetails = useCallback(async () => {
    const response = await courseService.fetchMainCourse({ id: courseId });
    if (response) {
      setCourse(response);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  if (!course) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Box
        className="course-content"
        w="100%"
        maxW="800px"
        p={4}
        dangerouslySetInnerHTML={{ __html: course.notice }}
      />
    </Box>
  );
};

export default Announcement;
