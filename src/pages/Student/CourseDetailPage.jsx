import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaBook,
  FaClock,
  FaHeart,
  FaMoneyBillAlt,
  FaStar,
} from 'react-icons/fa';
import { IoChatbox } from 'react-icons/io5';
import FAQ from '~/components/Student/CourseDetail/FAQ';
import Reviews from '~/components/Student/CourseDetail/Reviews';
import Curriculum from '~/components/Student/CourseDetail/Curriculum';
import Announcement from '~/components/Student/CourseDetail/Announcement';
import Description from '~/components/Student/CourseDetail/Description';
import CourseRandom from '~/components/Student/CourseDetail/CourseRandom';
import RelateCourse from '~/components/Student/CourseDetail/RelateCourse';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import courseService from '~/services/courseService';
import cartService from '~/services/cartService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { websocketConstants } from '~/utils/websocketConstants';
import { getUsername } from '~/utils/authUtils';
import config from '~/config';
import WebsocketService from '~/services/websocketService';
import favouriteService from '~/services/favouriteService';
import useCustomToast from '~/hooks/useCustomToast';
import PriceDisplay from '~/components/PriceDisplay';
import RelatedBundle from '~/components/Student/CourseDetail/RelateBundle';

const CourseDetailBtnStat = {
  START_COURSE: 'START_COURSE',
  CONTINUE_COURSE: 'CONTINUE_COURSE',
  IN_CART: 'IN_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  LOADING: 'LOADING',
  COMPLETED: 'COMPLETED',
};

function CourseDetailsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courseData, setCourseData] = useState(null);
  const [buttonState, setButtonState] = useState(CourseDetailBtnStat.LOADING); // State to control the button text
  const { courseId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  // Determine the active tab based on the query parameter
  const activeTab = searchParams.get('tab') || 'description';

  const loadCourseData = async () => {
    try {
      const response = await courseService.fetchMainCourse({ id: courseId });
      if (response) setCourseData(response);
    } catch (e) {
      errorToast('Error loading course data');
    }
  };

  const checkCourseInFavourite = async () => {
    try {
      const response = await favouriteService.checkCourseInFavourite(courseId);
      if (response) setIsLiked(response);
    } catch (e) {
      errorToast('Error checking course in favourite');
    }
  };

  const fetchButtonStat = async () => {
    try {
      const btnStat = await courseService.getCourseDetailButtonStatus(courseId);
      console.log(`Button Stat: ${btnStat}`);
      setButtonState(btnStat);
    } catch (e) {
      setButtonState(CourseDetailBtnStat.LOADING);
    }
  };

  const toggleWishlist = async (id, isLiked) => {
    try {
      if (isLiked) {
        await favouriteService.deleteFavourite(id);
        setIsLiked(false);
        successToast('Removed from wishlist');
      } else {
        await favouriteService.addFavourite(id);
        setIsLiked(true);
        successToast('Added to wishlist');
      }
    } catch (error) {
      errorToast('Error toggling wishlist');
    }
  };

  const addToCart = async () => {
    try {
      await cartService.addItemToCart(courseId);
      successToast('Added to cart');
      const addRequest = {
        username: getUsername(),
      };
      const wsService = await WebsocketService.getIns();
      wsService.send(websocketConstants.cartItemCountDestination, addRequest);
      setButtonState(CourseDetailBtnStat.IN_CART);
    } catch (error) {
      errorToast('Error adding to cart');
    }
  };

  useEffect(() => {
    loadCourseData();
    fetchButtonStat();
    checkCourseInFavourite();

    window.scrollTo(0, 0);
  }, [courseId]);

  const handleButtonClick = async () => {
    switch (buttonState) {
      case CourseDetailBtnStat.ADD_TO_CART:
        await addToCart();
        break;
      case CourseDetailBtnStat.START_COURSE:
      case CourseDetailBtnStat.CONTINUE_COURSE:
      case CourseDetailBtnStat.COMPLETED:
        localStorage.setItem('previousPageMain', window.location.href);
        navigate(config.routes.learn(courseId, courseData?.title));
        break;
      case CourseDetailBtnStat.IN_CART:
        navigate(config.routes.cart);
        break;
      default:
        break;
    }
  };

  const handleTabChange = (index) => {
    // Map tab indices to query parameter values
    const tabMapping = [
      'description',
      'curriculum',
      'faq',
      'announcement',
      'reviews',
    ];
    setSearchParams({ tab: tabMapping[index] });
  };

  const getTabIndex = () => {
    // Map query parameter values to tab indices
    const tabMapping = {
      description: 0,
      curriculum: 1,
      faq: 2,
      announcement: 3,
      reviews: 4,
    };
    return tabMapping[activeTab] || 0;
  };

  if (!courseData) return <Text>Loading...</Text>;

  return (
    <RoleBasedPageLayout>
      <Box maxW="1200px" mx="auto" py={10} px={5}>
        <Flex justify="space-between" direction={['column', 'column', 'row']}>
          <Box flex="2">
            <Text color="gray.500" fontSize="sm">
              {courseData?.topic.name}
            </Text>
            <Tooltip
              label={
                <PriceDisplay
                  primaryColor={'white'}
                  priceResponse={courseData?.price}
                />
              }
              aria-label="Course Price"
              hasArrow
            >
              <Text fontSize="3xl" fontWeight="bold" mt={2}>
                {courseData?.title}
              </Text>
            </Tooltip>

            <Text fontSize="md" mt={4} color="gray.600">
              {courseData?.descriptionPreview}
            </Text>

            <Flex align="center" mt={5}>
              <Avatar
                name={courseData?.owner?.fullName || 'Teacher Name'}
                src={courseData?.owner?.avatarPath}
                size="lg"
              />
              <Box ml={4}>
                <Text fontWeight="bold">Teacher</Text>
                <Text
                  color="blue.500"
                  cursor="pointer"
                  onClick={() =>
                    navigate(config.routes.teacher(courseData?.owner?.username))
                  }
                >
                  {courseData?.owner?.fullName || 'Teacher Name'}
                </Text>
              </Box>

              <Box ml={10}>
                <Text fontWeight="bold">{courseData?.countStudent}</Text>
                <Text>Students enrolled</Text>
              </Box>
              <Box ml={10}>
                <Flex align="center">
                  {[...Array(Math.round(courseData?.rating))].map((_, i) => (
                    <Icon key={i} as={FaStar} color="orange.400" />
                  ))}
                  {[...Array(5 - Math.round(courseData?.rating))].map(
                    (_, i) => (
                      <Icon key={i + 5} as={FaStar} color="gray.300" />
                    ),
                  )}
                  <Text ml={2}>
                    {courseData?.ratingCount} review
                    {courseData?.ratingCount !== 1 ? 's' : ''}
                  </Text>
                </Flex>
              </Box>
            </Flex>

            <Box mt={10}>
              <Tabs
                variant="unstyled"
                index={getTabIndex()}
                onChange={handleTabChange}
              >
                <TabList>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Description
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Curriculum
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    FAQ
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Announcement
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Reviews
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Description courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Curriculum courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <FAQ courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Announcement courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Reviews
                      courseId={courseId}
                      instructorName={courseData?.ownerUsername}
                      buttonState={buttonState}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Box mt={10}>
              <RelatedBundle
                courseId={courseId}
                numberOfCourses={3}
                type={'LEVEL'}
              />
            </Box>
          </Box>

          <Box flex="1" mt={[8, 8, 0]} pl={[0, 0, 10]}>
            <Flex justify="space-between" mb={4}>
              <Button
                variant="ghost"
                colorScheme={isLiked ? 'red' : 'gray'}
                onClick={() => toggleWishlist(courseId, isLiked)}
                leftIcon={
                  <Icon as={FaHeart} color={isLiked ? 'red.500' : 'gray.500'} />
                }
              >
                {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button
                leftIcon={<IoChatbox />}
                variant="ghost"
                colorScheme="gray"
                onClick={() => {
                  navigate(config.routes.chat, {
                    state: {
                      returnUrl: config.routes.course_view_detail.replace(
                        ':courseId',
                        courseData?.id,
                      ),
                      targetCourse: courseData,
                    },
                  });
                }}
              >
                Chat
              </Button>
            </Flex>

            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleButtonClick}
              isDisabled={buttonState === CourseDetailBtnStat.LOADING}
            >
              {buttonState === CourseDetailBtnStat.LOADING && 'Loading...'}
              {buttonState === CourseDetailBtnStat.ADD_TO_CART && 'Add to Cart'}
              {buttonState === CourseDetailBtnStat.IN_CART && 'In Cart'}
              {buttonState === CourseDetailBtnStat.START_COURSE &&
                'Start Course'}
              {buttonState === CourseDetailBtnStat.CONTINUE_COURSE &&
                'Continue Course'}
              {buttonState === CourseDetailBtnStat.COMPLETED && 'Completed'}
            </Button>

            <Box mt={6}>
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Course details
              </Text>
              <Stack spacing={3}>
                <HStack>
                  <Icon as={FaClock} color="gray.500" />
                  <Text>Duration</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData?.duration} hours
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaBook} color="gray.500" />
                  <Text>Lectures</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData?.countSection}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaBook} color="gray.500" />
                  <Text>Level</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData?.level.name}
                  </Text>
                </HStack>
              </Stack>
            </Box>
            <Box mt={6}>
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Related Courses
              </Text>
              <CourseRandom
                courseId={courseId}
                numberOfCourses={4}
                type={'TOPIC'}
              />
            </Box>
          </Box>
        </Flex>
      </Box>
    </RoleBasedPageLayout>
  );
}

export default CourseDetailsPage;
