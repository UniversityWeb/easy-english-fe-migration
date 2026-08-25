import { Badge, Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useMemo } from 'react';
import StarRating from './StarRating';
import { formatVNDMoney } from '~/utils/methods';
import { COURSE_STATUS } from '~/utils/constants';
import PriceDisplay from '~/components/PriceDisplay';

const CourseCard = ({ course, onMakeFeatured }) => {
  const averageRating = useMemo(() => {
    return course.rating ? course.rating.toFixed(1) : 'N/A';
  }, [course.rating]);
  const status = COURSE_STATUS[course.status];

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} w="100%">
      <Image
        src={course.imagePreview}
        alt={course.title}
        borderRadius="md"
        w="100%"
        h="180px"
      />
      {course.special && (
        <Badge
          borderRadius="full"
          px="2"
          colorScheme="orange"
          position="absolute"
          top="2"
          right="2"
        >
          SPECIAL
        </Badge>
      )}
      {course.hot && (
        <Badge
          borderRadius="full"
          px="2"
          colorScheme="red"
          position="absolute"
          top="2"
          right="2"
        >
          HOT
        </Badge>
      )}
      <Box mt={2}>
        <Text fontWeight="bold" fontSize="sm" color="gray.500">
          {course.category}
        </Text>
        <Text
          mt={1}
          fontWeight="semibold"
          fontSize="lg"
          noOfLines={2}
          minH="60px"
        >
          {course.title}
        </Text>
        <Flex align="center" mt={2}>
          <StarRating rating={parseFloat(averageRating)} />
          <Text ml={1} fontSize="sm">
            ({course.ratingCount} reviews)
          </Text>
          <Flex align="center" ml={4}>
            <FaEye />
            <Text ml={1} fontSize="sm">
              {course.views}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex mt={4} align="center" justify="space-between" w="100%">
        {/* Status Section */}
        <Flex align="center" color={status?.color || 'black'}>
          {status?.icon && <status.icon mr={1} />}
          <Text noOfLines={1}>{status?.label || 'Unknown Status'}</Text>
        </Flex>

        {/* Price Section */}
        <PriceDisplay priceResponse={course?.price} />
      </Flex>
      <Button
        colorScheme="blue"
        mt={4}
        w="100%"
        height="60px"
        onClick={onMakeFeatured}
      >
        MAKE FEATURED
      </Button>
      <Text mt={2} fontSize="sm" color="gray.500" textAlign="center">
        Last updated:{' '}
        {(course.updatedAt
          ? new Date(course.updatedAt)
          : new Date(course.createdAt)
        ).toLocaleDateString()}
      </Text>
    </Box>
  );
};

export default CourseCard;
