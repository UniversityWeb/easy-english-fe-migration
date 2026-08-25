import React from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import bundleService from '~/services/bundleService';
import useCustomToast from '~/hooks/useCustomToast';
const MotionBox = motion(Box);

export const CourseBundle = ({ data, isHovered, setHovered, fetchCourses }) => {
  const { successToast, errorToast } = useCustomToast();
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const courses = courseData?.filter((course) =>
    data.courseIds.includes(course.id),
  );

  const deleteBundle = async (id) => {
    try {
      await bundleService.deleteBundle(id);
      successToast('Delete bundle successfully');
      fetchCourses();
    } catch (error) {
      errorToast("Can't delete bundle");
    }
  };
  return (
    <MotionBox
      w="300px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      position="relative"
      bg="white"
      onMouseEnter={() => setHovered(data?.name)}
      onMouseLeave={() => setHovered(null)}
      animate={{ height: isHovered ? 'auto' : 320 }}
    >
      {/* Header */}
      <Box bg="blue.600" color="white" p={4} textAlign="center">
        <VStack spacing={2}>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {data?.name}
            </Text>
            <Text fontSize="sm">{data.courseIds.length} Courses</Text>
          </Box>
          {/* Thêm các nút Draft, Edit, Delete với hiệu ứng hover */}
          <HStack justify="center" spacing={2}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
            >
              Draft
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
              onClick={() => navigate(config.routes.bundle_detail(data.id))}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
              onClick={() => deleteBundle(data.id)}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Course List */}
      <VStack spacing={3} align="stretch" p={3}>
        {courses
          .slice(0, isHovered ? courses.length : 3)
          .map((course, index) => (
            <HStack key={index} spacing={3} align="center">
              <Image
                boxSize="40px"
                objectFit="cover"
                src={course.imagePreview}
                borderRadius="md"
                fallbackSrc={course?.imagePreview}
              />
              <VStack align="start" spacing={0} flex="1">
                <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                  {course?.title}
                </Text>
                <HStack spacing={1}>
                  <Text fontSize="sm" color="gray.600">
                    {course?.price?.price}
                  </Text>
                  {course?.price?.salePrice && (
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      textDecoration="line-through"
                    >
                      {course?.price?.salePrice}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </HStack>
          ))}
      </VStack>

      <Divider />

      <Box
        p={3}
        position={!isHovered && courses.length > 3 ? 'absolute' : 'relative'}
        bottom="0"
        left="0"
        right="0"
        bg="white"
      >
        <HStack justify="space-between">
          <Text fontSize="sm">
            ⭐ {5} ({5})
          </Text>
          <HStack>
            <Text fontWeight="bold" color="green.600">
              {data?.price}
            </Text>
            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
              {data?.price}
            </Text>
          </HStack>
        </HStack>
      </Box>
    </MotionBox>
  );
};
