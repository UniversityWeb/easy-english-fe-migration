import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Input,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuChartBar } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import { PiStudent } from 'react-icons/pi';
import Pagination from '~/components/Student/Search/Page';
import Filter from '~/components/Student/Search/Filter';
import courseService from '~/services/courseService';
import favouriteService from '~/services/favouriteService';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import useCustomToast from '~/hooks/useCustomToast';
import { formatVNDMoney } from '~/utils/methods';
import PriceDisplay from '~/components/PriceDisplay';

const Rating = ({ rating }) => (
  <HStack spacing="1">
    {Array(5)
      .fill('')
      .map((_, i) => (
        <StarIcon key={i} color={i < rating ? 'yellow.400' : 'gray.300'} />
      ))}
    <Text fontSize="sm" ml="2">
      {rating}
    </Text>
  </HStack>
);

const CourseListSkeleton = ({ itemsPerPage }) => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {Array(itemsPerPage)
        .fill('')
        .map((_, index) => (
          <Box
            key={index}
            width="100%" // Ensure it takes full width of the grid item
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="300px"
            position="relative"
            p={6}
          >
            <Skeleton height="120px" width="100%" />
            <VStack align="start" spacing={3} mt={4}>
              <SkeletonText noOfLines={1} width="50%" />
              <SkeletonText noOfLines={1} width="60%" />
              <SkeletonCircle size="10" />
              <SkeletonText noOfLines={1} width="90%" />
            </VStack>
          </Box>
        ))}
    </Grid>
  );
};

const CourseList = ({
  courses,
  hoveredCourseId,
  setHoveredCourseId,
  toggleWishlist,
  likedCourses,
}) => {
  const navigate = useNavigate();

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {courses.map((course) => {
        const isLiked = likedCourses.find((c) => c.id === course.id)?.liked;

        return (
          <Box
            key={course.id}
            width="100%" // Ensure it takes full width of the grid item
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="380px"
            position="relative"
            onMouseEnter={() => setHoveredCourseId(course.id)}
            onMouseLeave={() => setHoveredCourseId(null)}
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
            }}
          >
            <Box height="160px" overflow="hidden">
              <Image
                src={course.imagePreview}
                alt={course.title}
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.0)' }}
              />
            </Box>

            <Box p={6}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  {course.topic?.name || 'Unknown Topic'}
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  noOfLines={2}
                  minHeight="60px"
                >
                  {course.title}
                </Text>

                <Flex justify="space-between" align="center" width="100%">
                  <HStack spacing="1">
                    <Icon as={PiStudent} boxSize={5} color="gray.600" />
                    <Text fontSize="sm" color="gray.500" noOfLines={1}>
                      {course.countStudent} Students
                    </Text>
                  </HStack>
                  <HStack spacing="1">
                    <Icon as={IoBookOutline} boxSize={5} color="gray.600" />
                    <Text fontSize="sm" color="gray.500"  noOfLines={1}>
                      {course.countSection} Sections
                    </Text>
                  </HStack>
                </Flex>

                <Divider borderColor="gray.300" mb="10px" />

                <Flex justify="space-between" align="center" width="100%">
                  <Rating rating={course.rating} />

                  <PriceDisplay priceResponse={course?.price} primaryColor={'gray.700'}/>
                </Flex>

                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  zIndex="10"
                  opacity={hoveredCourseId === course.id ? 1 : 0}
                  transform={
                    hoveredCourseId === course.id ? 'scale(1)' : 'scale(0.95)'
                  }
                  transition="opacity 0.3s ease, transform 0.3s ease"
                  pointerEvents={hoveredCourseId === course.id ? 'all' : 'none'}
                >
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Instructor Information
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" mb={3} minH="80px">
                    {course.title}
                  </Text>
                  <Text fontSize="sm" mt={3} noOfLines={3} minH="60px">
                    {course.descriptionPreview || 'No description available.'}
                  </Text>

                  <Flex mt={6} justify="space-between">
                    <HStack spacing="1">
                      <Icon as={LuChartBar} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">
                        {course.level?.name || 'All Levels'}
                      </Text>
                    </HStack>
                    <HStack spacing="1">
                      <Icon as={IoBookOutline} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">{course.countSection} Sections</Text>
                    </HStack>
                    <HStack spacing="1">
                      <Icon as={TbClockHour4} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">{course.duration} Hours</Text>
                    </HStack>
                  </Flex>

                  <Button
                    mt={7}
                    colorScheme="blue"
                    size="sm"
                    width="full"
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
                    PREVIEW THIS COURSE
                  </Button>

                  <Button
                    mt={4}
                    width="full"
                    size="sm"
                    variant="ghost"
                    colorScheme={isLiked ? 'red' : 'gray'}
                    onClick={() => toggleWishlist(course.id, isLiked)}
                    leftIcon={
                      <Icon
                        as={FaHeart}
                        color={isLiked ? 'red.500' : 'gray.500'}
                      />
                    }
                  >
                    {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </Box>
              </VStack>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { successToast, errorToast } = useCustomToast();

  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
  });
  const [likedCourses, setLikedCourses] = useState([]);

  // State quản lý việc hiển thị Filter
  //const [showFilter, setShowFilter] = useState(false);

  const fetchCourses = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const courseRequest = {
        pageNumber: currentPage - 1,
        size: itemsPerPage,
        title: searchTerm || null,
        categoryIds:
          filterOptions.categoryIds.length > 0
            ? filterOptions.categoryIds
            : null,
        rating: filterOptions.rating || null,
        topicId: filterOptions.topicId || null,
        levelId: filterOptions.levelId || null,
      };

      const response = await courseService.getCourseByFilter(courseRequest);

      if (response) {
        const { content, totalPages } = response;
        if (content.length === 0) {
          successToast('No course found');
        }
        setCourses(content);
        setTotalPages(totalPages);

        const likedCoursesStatus = await Promise.all(
          content.map(async (course) => {
            const isLiked = await favouriteService.checkCourseInFavourite(
              course.id,
            );
            return { id: course.id, liked: isLiked };
          }),
        );

        setLikedCourses(likedCoursesStatus);
      }
    } catch (error) {
      errorToast('Error fetching courses');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const toggleWishlist = async (id, isLiked) => {
    try {
      if (isLiked) {
        await favouriteService.deleteFavourite(id);
        successToast('Removed from wishlist');
      } else {
        await favouriteService.addFavourite(id);
        successToast('Added to wishlist');
      }

      setLikedCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, liked: !course.liked } : course,
        ),
      );
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Flex mb={5} justify="space-between" align="center">
          <Input
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mr={2}
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: '1fr 4fr' }} gap={6} mt={4}>
          <GridItem>
            <Filter onFilterChange={setFilterOptions} />
          </GridItem>

          <GridItem mx={0} maxWidth="none" flex="1">
            <Flex direction="column" justify="space-between" height="100%">
              {loading ? (
                <CourseListSkeleton itemsPerPage={itemsPerPage} />
              ) : (
                <CourseList
                  courses={courses}
                  hoveredCourseId={hoveredCourseId}
                  setHoveredCourseId={setHoveredCourseId}
                  toggleWishlist={toggleWishlist}
                  likedCourses={likedCourses}
                />
              )}

              <Box mt={8}>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalPages={totalPages}
                />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default SearchPage;
