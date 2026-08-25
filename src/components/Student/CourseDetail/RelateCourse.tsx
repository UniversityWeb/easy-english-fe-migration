import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import courseService from '~/services/courseService';
import { formatVNDMoney } from '~/utils/methods';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '~/components/PriceDisplay';

const RelateCourse = ({ courseId, numberOfCourses, type }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRelatedCourses = async () => {
    try {
      const requestPayload = { courseId, numberOfCourses, type };
      const response = await courseService.getRelatedCourses(requestPayload);
      setCourses(response);
    } catch (error) {
      console.error('Failed to fetch related courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedCourses();
  }, [courseId, numberOfCourses, type]);

  const formatCoursePrice = (price) => {
    const now = new Date();
    const isOnSale =
      price.salePrice > 0 &&
      new Date(price.startDate) <= now &&
      now <= new Date(price.endDate);

    return isOnSale
      ? formatVNDMoney(price.salePrice)
      : formatVNDMoney(price.price);
  };

  return (
    <VStack spacing={5} align="stretch">
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Related Courses
      </Text>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {courses.map((course, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="4"
              boxShadow="sm"
              cursor="pointer"
              _hover={{
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
              }}
              _active={{
                transform: 'scale(1)',
                transition: 'transform 0.1s ease-in-out',
              }}
              onClick={async () => {
                const courseId = course.id;
                try {
                  await courseService.countView(courseId);
                } catch (e) {
                  console.error(e);
                }
                navigate(`/course-view-detail/${courseId}`);
              }}
            >
              <Box position="relative">
                <Image
                  w="100%"
                  h="150px"
                  objectFit="cover"
                  src={course.imagePreview || course.imageUrl}
                  alt={course.title}
                  borderRadius="md"
                />
                {course.isHot && (
                  <Badge
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme="red"
                    fontSize="0.8em"
                  >
                    HOT
                  </Badge>
                )}
                {course.isSpecial && (
                  <Badge
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme="green"
                    fontSize="0.8em"
                  >
                    SPECIAL
                  </Badge>
                )}
              </Box>
              <Stack spacing={2} pt={4}>
                <Tooltip
                  label={course.title}
                  aria-label="Course Title"
                  hasArrow
                >
                  <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                    {course.title}
                  </Text>
                </Tooltip>

                <PriceDisplay
                  priceResponse={course?.price}
                  primaryColor={'green.500'}
                  fontWeight={'regular'}
                />

                <HStack spacing={1}>
                  {Array(5)
                    .fill('')
                    .map((_, i) => (
                      <StarIcon
                        key={i}
                        color={i < course.rating ? 'yellow.400' : 'gray.300'}
                      />
                    ))}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  By {course.owner?.fullName || 'Unknown Instructor'}
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default RelateCourse;
