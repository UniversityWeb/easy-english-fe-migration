import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import courseService from '~/services/courseService';
import './Description.css';

const Description = ({ courseId }) => {
    const [course, setCourse] = useState(null);

    const fetchCourseDetails = async () => {
        const response = await courseService.fetchMainCourse({ id: courseId });
        if (response) {
            setCourse(response);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    if (!course) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box mt={4}>
            <Box position="relative" mb={6}>
                <video
                    src={course.videoPreview}
                    controls
                    style={{ borderRadius: '8px', width: '100%',height: '400px' }}
                />
            </Box>

            <Box
                className="course-content" 
                w="100%"
                maxW="800px"
                p={4}
                dangerouslySetInnerHTML={{ __html: course.description }} 
            />
        </Box>
    );
};

export default Description;
