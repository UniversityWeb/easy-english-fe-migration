import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourseAll } from '~/store/courseSlice';
import { useNavigate } from 'react-router-dom';
import enrollmentService from '~/services/enrollmentService';

function RecommendCourse() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const dispatch = useDispatch();
  const { courseDataAll } = useSelector((state) => state.course);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(courseDataAll)) {
      dispatch(getDataCourseAll());
    }
  }, [dispatch, courseDataAll]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrolled courses
        const courseRequest = {
          pageNumber: 0,
          size: 1000,
          title: null,
          categoryIds: null,
          rating: null,
          topicId: null,
          levelId: null,
        };

        const enrollResponse =
          await enrollmentService.getEnrollByFilter(courseRequest);

        // Extract enrolled course IDs
        debugger;
        const enrolledCourseIds =
          enrollResponse?.content?.map((enrollment) => enrollment.id) || [];
        setEnrolledCourses(enrolledCourseIds);

        // Fetch recommendations
        const recommendationResponse = await axios.get(
          'http://localhost:8000/recommendations/vanan',
        );
        setData(recommendationResponse.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get course details by course_id
  const getCourseDetails = (courseId) => {
    if (!courseDataAll || courseDataAll.length === 0) return null;
    return courseDataAll.find((course) => course.id === courseId);
  };

  // Function to check if course is already enrolled
  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  if (loading) {
    return (
      <ChakraProvider>
        <Box p={6} textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading recommendations...</Text>
        </Box>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider>
        <Box p={6}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        </Box>
      </ChakraProvider>
    );
  }

  const { recommendations } = data;

  // Filter recommendations to only show courses that:
  // 1. Have matching course details (have id)
  // 2. Are NOT already enrolled by the user
  const validRecommendations =
    recommendations?.filter((recommendation) => {
      const courseDetails = getCourseDetails(recommendation.course_id);
      const hasValidDetails =
        courseDetails !== null && courseDetails !== undefined;
      const isNotEnrolled = !isCourseEnrolled(recommendation.course_id);

      return hasValidDetails && isNotEnrolled;
    }) || [];

  return (
    <ChakraProvider>
      <Box p={6}>
        <Box mb={8}>
          <Heading size="lg">Recommended Courses for you</Heading>
          {enrolledCourses.length > 0 && (
            <Text fontSize="sm" color="gray.600" mt={2}>
              Showing recommendations excluding {enrolledCourses.length}{' '}
              enrolled course(s)
            </Text>
          )}
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {validRecommendations.map((recommendation) => {
            const courseDetails = getCourseDetails(recommendation.course_id);

            return (
              <Box
                key={recommendation.course_id}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow="md"
                p={5}
                _hover={{ shadow: 'lg', borderColor: 'blue.300' }}
                transition="all 0.2s"
                bg="white"
              >
                {/* Course Image */}
                {courseDetails?.imagePreview && (
                  <Image
                    src={courseDetails.imagePreview}
                    alt={courseDetails.title}
                    borderRadius="md"
                    mb={4}
                    h="180px"
                    w="100%"
                    objectFit="cover"
                  />
                )}

                {/* Course Title */}
                <Heading size="md" mb={3} noOfLines={2} minH="3em">
                  {courseDetails.title}
                </Heading>

                {/* Instructor */}
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Instructor: {courseDetails?.owner?.fullName || 'Unknown'}
                </Text>

                {/* Action Button */}
                <Button
                  colorScheme="blue"
                  size="md"
                  width="100%"
                  onClick={() => {
                    navigate(`/course-view-detail/${recommendation.course_id}`);
                  }}
                >
                  View Details
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* No recommendations message */}
        {validRecommendations.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">
              {enrolledCourses.length > 0
                ? 'No new recommendations available. You may have enrolled in all recommended courses!'
                : 'No valid recommendations available at the moment.'}
            </Text>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default RecommendCourse;
