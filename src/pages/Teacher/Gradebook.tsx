import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Collapse,
  Table,
  Tbody,
  Tr,
  Td,
  Divider,
  Link,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { getCurrentUserRole, getUsername } from '~/utils/authUtils';
import enrollmentService from '~/services/enrollmentService';
import { USER_ROLES } from '~/utils/constants';

function Gradebook() {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState({});
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetchCoursesStats();
  }, []);

  const fetchCoursesStats = async () => {
    setLoading(true);
    const role = getCurrentUserRole();
    const currentUsername = getUsername();
    const teacherUsername = role === USER_ROLES.TEACHER ? currentUsername : '';
    try {
      const courseStatsFilter = {
        teacherUsername: teacherUsername,
        pageNumber: 0,
        size: 20,
        keyword: searchTerm,
      };

      const response =
        await enrollmentService.getCoursesStatistics(courseStatsFilter);
      setCourses(response.content || []);
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchCoursesStats();
    }
  };

  const loadStudents = async (courseId) => {
    setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));

    try {
      const studentStatsFilter = {
        pageNumber: 0,
        size: 999,
        courseId: courseId,
      };

      const response =
        await enrollmentService.getStudentsStatistics(studentStatsFilter);
      setStudentsByCourse((prev) => ({
        ...prev,
        [courseId]: response.content || [],
      }));
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      toast({
        title: 'Error',
        description:
          'Failed to load student statistics. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={6} maxW="800px" mx="auto">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">The Gradebook</Heading>
          <InputGroup maxW="250px">
            <Input
              placeholder="Enter keyword here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                size="sm"
                onClick={fetchCoursesStats}
              />
            </InputRightElement>
          </InputGroup>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading courses...</Text>
          </Box>
        ) : courses.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text>No courses found. Try a different search term.</Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {courses.map((course) => (
              <Box key={course.id} borderWidth="1px" borderRadius="md" p={4}>
                <HStack justify="space-between">
                  <HStack>
                    <Image
                      src={course.imagePreview}
                      boxSize="50px"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/50"
                    />
                    <Text fontWeight="bold">{course.courseTitle}</Text>
                  </HStack>
                  <Button
                    rightIcon={
                      expandedCourse === course.id ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                    onClick={() => toggleCourse(course.id)}
                    variant="outline"
                  >
                    {expandedCourse === course.id ? 'Show less' : 'More info'}
                  </Button>
                </HStack>

                <Collapse in={expandedCourse === course.id} animateOpacity>
                  <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                    <Table variant="simple">
                      <Tbody>
                        <Tr>
                          <Td>All time course students:</Td>
                          <Td fontWeight="bold">
                            {course?.totalStudents || 0}
                          </Td>
                          <Td>Course average progress:</Td>
                          <Td fontWeight="bold">
                            {course?.averageProgress || '0%'}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Course passed quizzes:</Td>
                          <Td fontWeight="bold">
                            {course?.passedQuizzesPercentage || '0%'}
                          </Td>
                          <Td>Course passed lessons:</Td>
                          <Td fontWeight="bold">
                            {course?.passedLessonsPercentage || '0%'}
                          </Td>
                        </Tr>
                        {/* <Tr>
                          <Td>Course enrolled by subscription:</Td>
                          <Td fontWeight="bold">
                            {course?.subscriptions || 0}
                          </Td>
                          <Td>Course passed assignments:</Td>
                          <Td fontWeight="bold">
                            {course?.assignments || '0%'}
                          </Td>
                        </Tr> */}
                      </Tbody>
                    </Table>

                    {!studentsByCourse[course.id] ? (
                      <Text mt={4} color="blue.500" fontSize="sm">
                        <Link
                          onClick={() => loadStudents(course.id)}
                          cursor="pointer"
                        >
                          {loadingStudents[course.id] ? (
                            <Spinner size="xs" mr={2} />
                          ) : (
                            'Load Students Statistics'
                          )}
                        </Link>
                      </Text>
                    ) : (
                      <>
                        <Divider my={4} />
                        <Heading size="md">Students Statistics</Heading>
                        {studentsByCourse[course.id].length === 0 ? (
                          <Box mt={4} textAlign="center">
                            <Text>No students enrolled in this course.</Text>
                          </Box>
                        ) : (
                          studentsByCourse[course.id].map((student, index) => (
                            <Box
                              key={index}
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                              mt={4}
                            >
                              <HStack spacing={4}>
                                <Image
                                  src={
                                    student.avatarPath ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      student.fullName.charAt(0),
                                    )}&background=random&color=ffffff&size=50&length=1`
                                  }
                                  boxSize="50px"
                                  borderRadius="full"
                                  fallbackSrc="https://via.placeholder.com/50?text=User"
                                />
                                <Box>
                                  <Text fontWeight="bold">
                                    {student.fullName}
                                  </Text>
                                  <Text fontSize="sm" color="blue.500">
                                    {student.email}
                                  </Text>
                                  <Text fontSize="sm" fontStyle="italic">
                                    Started:{' '}
                                    {new Date(
                                      student.startedDate,
                                    ).toLocaleDateString()}
                                  </Text>
                                </Box>
                              </HStack>
                              <HStack mt={2} spacing={2} flexWrap="wrap">
                                <Button size="sm" colorScheme="green">
                                  Lessons Passed: {student.passedLesson}
                                </Button>
                                <Button size="sm" colorScheme="gray">
                                  Quizzes Passed: {student.passedTests}
                                </Button>

                                <Button size="sm" colorScheme="green">
                                  Progress: {student.progress}
                                </Button>
                              </HStack>
                            </Box>
                          ))
                        )}
                      </>
                    )}
                  </Box>
                </Collapse>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </RoleBasedPageLayout>
  );
}

export default Gradebook;
