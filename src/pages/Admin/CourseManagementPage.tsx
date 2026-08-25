import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { PiPencilSimpleFill } from 'react-icons/pi';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import courseService from '~/services/courseService'; // Import the service
import Pagination from '~/components/Student/Search/Page';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const STATUS_OPTIONS = {
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  PENDING_APPROVAL: 'Pending Approval',
  DRAFT: 'Draft',
  DELETED: 'Deleted',
};

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [filters, setFilters] = useState({
    ownerUsername: null,
    status: null,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const toast = useToast();
  const { successToast, errorToast } = useCustomToast();
  const fetchCourses = async () => {
    try {
      const courseRequest = {
        pageNumber: currentPage - 1,
        size: itemsPerPage,
        ownerUsername: filters.ownerUsername || null,
        status: filters.status || null,
      };
      const response = await courseService.getAllCourseForAdmin(courseRequest);
      setCourses(response.content || []);
      setFilteredCourses(response.content || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: 'Error fetching courses',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleEdit = (course = null) => {
    setSelectedCourse(course);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handleStatusChange = (courseId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [courseId]: newStatus,
    }));
  };

  const handleEditStatus = async (courseId) => {
    try {
      if (!statusUpdates[courseId]) {
        errorToast('Please select a status to update.');
        return;
      }
      await courseService.updateCourseStatus(courseId, statusUpdates[courseId]);
      successToast('Course status updated successfully.');
      fetchCourses();
    } catch (error) {
      errorToast(error?.message);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading>Course Management</Heading>
        </Flex>

        <Flex mb={4} gap={4}>
          <Box>
            <Input
              placeholder="Search by username"
              name="ownerUsername"
              value={filters.ownerUsername}
              onChange={handleFilterChange}
            />
          </Box>

          <Box>
            <Select
              placeholder="Filter by status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {Object.keys(STATUS_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {STATUS_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table
            variant="simple"
            colorScheme="whiteAlpha"
            className="resizable-table"
          >
            <Thead bg="gray.100">
              <Tr>
                <Th>Image</Th>
                <Th width="400px">Title</Th>
                <Th width="400px">Description Preview</Th>
                <Th>Duration</Th>
                <Th>Count View</Th>
                <Th>Created At</Th>
                <Th>Updated At</Th>
                <Th width="250px">Status</Th>
                <Th>Teacher</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCourses.map((course) => (
                <Tr
                  key={course.id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() =>
                    navigate(config.routes.course_detail(course?.id), {
                      state: {
                        returnUrl: config.routes.course_management_for_admin
                      }
                    })
                  }
                >
                  <Td>
                    <Avatar src={course.imagePreview} name={course.title} />
                  </Td>
                  <Td>{course.title}</Td>
                  <Td>{course.descriptionPreview}</Td>
                  <Td>{course.duration}</Td>
                  <Td>{course.countView}</Td>
                  <Td>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(course.createdAt))}
                  </Td>{' '}
                  <Td>
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }).format(new Date(course.updateAt))}
                  </Td>
                  <Td>
                    <Select
                      placeholder="Select status"
                      value={statusUpdates[course.id] || course.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatusChange(course.id, e.target.value)
                      }
                    >
                      {Object.keys(STATUS_OPTIONS).map((key) => (
                        <option key={key} value={key}>
                          {STATUS_OPTIONS[key]}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>{course.ownerUsername}</Td>
                  <Td>
                    <IconButton
                      icon={<PiPencilSimpleFill />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStatus(course.id);
                      }}
                      color="gray.500"
                      mr={2}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box mt={8}>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
            />
          </Box>
        </Box>
      </Box>
      <style>{`
        .resizable-table th, .resizable-table td {
          border-right: 1px solid #e2e8f0;

        }

      `}</style>
    </RoleBasedPageLayout>
  );
};

export default CourseManagement;
