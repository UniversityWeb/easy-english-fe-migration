import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  CloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaBook, FaClock, FaGlobe } from 'react-icons/fa';
import CourseCard from '~/components/Student/Search/CourseCard';
import courseStatisticsService from '~/services/courseStatisticsService';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import config from '~/config';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [showTestAlert, setShowTestAlert] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseStatisticsService.getTopCourse();
        setCourses(response.content || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <RoleBasedPageLayout>
      <Box>
        {/* Alert Làm bài test */}
        {showTestAlert && (
          <Alert status="info" justifyContent="space-between" p={4}>
            <Box display="flex" alignItems="center">
              <AlertIcon />
              <AlertTitle mr={2}>Take the test!</AlertTitle>
              <AlertDescription>
                Start your proficiency test right now.
              </AlertDescription>
            </Box>
            <HStack>
              <Button
                colorScheme="blue"
                variant="solid"
                size="sm"
                onClick={() => navigate(config.routes.entrance_test)}
              >
                Làm
              </Button>
              <CloseButton onClick={() => setShowTestAlert(false)} />
            </HStack>
          </Alert>
        )}

        {/* Hero Section */}
        <Flex
          bgImage="url('https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Mask-Group-29-1-1.jpg')"
          bgSize="cover"
          bgPosition="center"
          color="white"
          p={10}
          alignItems="center"
          justifyContent="space-between"
          height="80vh"
          borderBottomLeftRadius="80px"
        >
          <Box maxW="700px" pl={40}>
            <Heading fontSize="5xl" mb={4}>
              Start Investing in Your Future Today
            </Heading>
            <Text fontSize="xl" mb={6}>
              Explore over 1300 English courses, from beginner to advanced
              levels, taught by top experts and prestigious universities.
              Enhance your communication skills to excel in your career, studies
              abroad, and daily life.
            </Text>
          </Box>
        </Flex>

        {/* Popular Courses Section */}
        <Box p={10} bg="gray.50">
          <Heading fontSize="3xl" mb={6} textAlign="center">
            Popular Courses
          </Heading>
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPreview={() => navigate(`/course-view-detail/${course.id}`)}
                onHover={setHoveredCourseId}
                isHovered={hoveredCourseId === course.id}
              />
            ))}
          </SimpleGrid>
        </Box>

        {/* Call to Action Section */}
        <Flex
          p={0}
          bg="gray.100"
          alignItems="center"
          justifyContent="space-between"
          height="100vh"
        >
          <Box flex="1">
            <Image
              src="https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Image_27-1-1.jpeg"
              alt="CTA"
              boxSize="full"
              objectFit="cover"
              height="100vh"
            />
          </Box>

          <Box
            flex="1"
            p={10}
            bg="white"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Heading fontSize="3xl" mb={4} marginLeft="100px">
              Pick a Course That Makes Your Life
            </Heading>
            <Text
              marginLeft="100px"
              fontSize="lg"
              mb={6}
              color="gray.600"
              maxWidth="500px"
            >
              Looking for your next favorite course? Find our freshest content
              here. Discover new horizons. Gain knowledge that makes a
              mind-blowing change in your life. Ready? Let’s get started!
            </Text>
            <Button
              marginLeft="100px"
              colorScheme="blue"
              size="lg"
              width="fit-content"
              onClick={() => navigate('/search')}
            >
              VIEW ALL COURSES
            </Button>
          </Box>
        </Flex>

        {/* Why Choose Us Section */}
        <Box p={10} bg="white">
          <Flex
            justify="space-between"
            align="center"
            direction={['column', 'row']}
          >
            <Box flex="1" marginLeft="100px">
              <Heading fontSize="3xl" mb={4} color="gray.800">
                Why Choose Us
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="500px" mb={6}>
                MasterStudy is committed to helping students achieve their goals
                by providing an innovative environment and making a difference.
              </Text>

              <VStack align="start" spacing={6}>
                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaGlobe} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Learn from the Best
                    </Heading>
                    <Text fontSize="sm" color="gray.600" maxW="500px">
                      Certificate courses are instructed by experienced and
                      qualified instructors with Ph.D. and Masters' degrees.
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaBook} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Set Your Own Learning Pace
                    </Heading>
                    <Text fontSize="sm" color="gray.600" maxW="500px">
                      If you're a busy parent or professional, find an online
                      program that works around your schedule.
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaClock} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Graduate in Less Than a Year
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Get your degree quickly and start writing your success
                      story now.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>

            <Box flex="1" display="flex" justifyContent="center" mt={[8, 0]}>
              <Image
                src="https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Image_29-1-1.png"
                alt="Why Choose Us"
                borderRadius="md"
                boxShadow="lg"
                objectFit="cover"
                height="100vh"
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default Home;
