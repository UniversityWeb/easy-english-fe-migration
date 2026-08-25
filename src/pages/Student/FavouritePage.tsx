import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuChartBar } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import Pagination from '~/components/Student/Search/Page';
import Filter from '~/components/Student/Search/Filter';
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

const WishlistSkeleton = ({ itemsPerPage }) => (
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
          <Skeleton height="180px" width="100%" />
          <VStack align="start" spacing={3} mt={4}>
            <SkeletonText noOfLines={2} width="80%" />
            <SkeletonText noOfLines={1} width="60%" />
          </VStack>
        </Box>
      ))}
  </Grid>
);

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { successToast, errorToast } = useCustomToast();

  //const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      const response =
        await favouriteService.getFavouriteByFilter(courseRequest);
      if (response) {
        if (response.content.length === 0) {
          successToast('No courses favourite found');
        }
        setCourses(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      errorToast('Error fetching favorite courses');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCourses();
  };

  const removeFromWishlist = async (id) => {
    try {
      await favouriteService.deleteFavourite(id);
      successToast('Course removed from wishlist');
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id),
      );
    } catch (error) {
      errorToast('Error removing course from wishlist');
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
          Wishlist
        </Text>

        {/* Search Section */}
        <Flex mb={5} justify="space-between">
          <Input
            placeholder="Search for favorite courses..."
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
                <WishlistSkeleton itemsPerPage={itemsPerPage} />
              ) : (
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <Box
                        key={course.id}
                        style={{ zoom: 0.9 }}
                        width="300px"
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
                        {/* Course Image */}
                        <Box height="180px" overflow="hidden">
                          <Image
                            src={course.imagePreview}
                            alt={course.title}
                            objectFit="cover"
                            width="100%"
                            height="100%"
                            transition="transform 0.3s ease"
                            _hover={{ transform: 'scale(1.05)' }}
                          />
                        </Box>

                        {/* Course Details */}
                        <Box p={6}>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">
                              {course.topic?.name || 'No topic'}
                            </Text>

                            <Text
                              fontWeight="bold"
                              fontSize="lg"
                              noOfLines={2}
                              minHeight="60px"
                            >
                              {course.title}
                            </Text>

                            <Flex
                              justify="space-between"
                              align="center"
                              width="100%"
                            >
                              <Rating rating={course.rating} />

                              <PriceDisplay priceResponse={course?.price} primaryColor={'gray.700'}/>
                            </Flex>

                            {/* Hovered View */}
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
                                hoveredCourseId === course.id
                                  ? 'scale(1)'
                                  : 'scale(0.95)'
                              }
                              transition="opacity 0.3s ease, transform 0.3s ease"
                              pointerEvents={
                                hoveredCourseId === course.id ? 'all' : 'none'
                              }
                            >
                              <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Demo Instructor
                              </Text>

                              <Text
                                fontWeight="bold"
                                fontSize="lg"
                                mb={2}
                                noOfLines={2}
                                minHeight="50px"
                              >
                                {course.title}
                              </Text>

                              <Rating rating={course.rating} />

                              <Text
                                fontSize="sm"
                                mt={3}
                                noOfLines={3}
                                minHeight="65px"
                              >
                                {course.descriptionPreview ||
                                  'No description available.'}
                              </Text>

                              <Flex
                                mt={6}
                                justify="space-between"
                                align="center"
                                width="100%"
                              >
                                <HStack spacing="1">
                                  <Icon
                                    as={LuChartBar}
                                    boxSize={5}
                                    color="gray.600"
                                  />
                                  <Text fontSize="sm">
                                    {course.level?.name || 'No level'}
                                  </Text>
                                </HStack>
                                <HStack spacing="1">
                                  <Icon
                                    as={IoBookOutline}
                                    boxSize={5}
                                    color="gray.600"
                                  />
                                  <Text fontSize="sm">
                                    {course.countSection} Sections
                                  </Text>
                                </HStack>
                                <HStack spacing="1">
                                  <Icon
                                    as={TbClockHour4}
                                    boxSize={5}
                                    color="gray.600"
                                  />
                                  <Text fontSize="sm">
                                    {course.duration} hours
                                  </Text>
                                </HStack>
                              </Flex>

                              <Button
                                mt={7}
                                colorScheme="blue"
                                size="sm"
                                width="full"
                                onClick={() =>
                                  navigate(`/course-view-detail/${course.id}`)
                                }
                              >
                                PREVIEW THIS COURSE
                              </Button>

                              <Button
                                mt={4}
                                size="sm"
                                width="full"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => removeFromWishlist(course.id)}
                                leftIcon={<Icon as={FaHeart} color="red.500" />}
                              >
                                Remove from Wishlist
                              </Button>
                            </Box>
                          </VStack>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <GridItem
                      colSpan={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="380px"
                    >
                      <Heading textAlign="center" size="md">
                        No favorites available
                      </Heading>
                    </GridItem>
                  )}
                </Grid>
              )}

              {/* Pagination */}
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

export default Wishlist;
