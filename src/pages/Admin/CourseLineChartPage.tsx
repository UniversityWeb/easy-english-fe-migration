import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import courseStatisticsService from '~/services/courseStatisticsService';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserRole, getUsername } from '~/utils/authUtils';
import { USER_ROLES } from '~/utils/constants';

const CourseBarChartPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherList, setTeacherList] = useState([]);

  // Fetch teachers (for admin role)
  useEffect(() => {
    const fetchTeachers = async () => {
      const role = getCurrentUserRole();
      if (role === USER_ROLES.ADMIN) {
        try {
          const response = await courseStatisticsService.getAllTeachers(); // Assumes API exists
          setTeacherList(response || []);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      }
    };
    fetchTeachers();
  }, []);

  // Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const role = getCurrentUserRole();
      const currentUsername = getUsername();
      const usernameToUse =
        role === USER_ROLES.TEACHER ? currentUsername : teacherUsername || null;

      try {
        const response = await courseStatisticsService.getRevenueByMonthAndYear(
          usernameToUse,
          month,
          year,
          page,
          size,
        );

        const sortedData = response.content
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 10);

        setData(sortedData.map((item) => ({ name: item.title, ...item })));
        setCourses(sortedData);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, page, size, teacherUsername]);

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
    setPage(0);
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    setPage(0);
  };

  const handleTeacherChange = (e) => {
    setTeacherUsername(e.target.value);
    setPage(0);
  };

  if (loading) {
    return (
      <RoleBasedPageLayout>
        <Box w="full" p={5} textAlign="center">
          <Spinner size="xl" />
        </Box>
      </RoleBasedPageLayout>
    );
  }

  return (
    <RoleBasedPageLayout>
      {/* Chart Section */}
      <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md" mb={8}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Top 10 Courses by Revenue ({courses.length} Courses)
        </Text>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 50, left: 50, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => formatVNDMoney(value)}
              tick={{ fontSize: 12 }}
              padding={{ top: 10, bottom: 10 }}
              width={100}
            />
            <Tooltip formatter={(value) => formatVNDMoney(value)} />
            <Bar
              dataKey="totalRevenue"
              fill="#8884d8"
              name="Total Revenue"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Filter Section */}
      <Box w="full" p={4} mb={2} shadow="md" borderWidth="1px" rounded="md">
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4}
        >
          <Text fontSize="xl" fontWeight="bold" whiteSpace="nowrap">
            Filter Options
          </Text>

          <Flex direction="row" wrap="wrap" gap={4} flex="1" justify="flex-end">
            <Select
              placeholder="Select Month"
              value={month}
              onChange={handleMonthChange}
              minW="150px"
              flex="1"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Year"
              value={year}
              onChange={handleYearChange}
              minW="150px"
              flex="1"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const yr = new Date().getFullYear() - i;
                return (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                );
              })}
            </Select>

            {getCurrentUserRole() === USER_ROLES.ADMIN && (
              <Select
                placeholder="All Teachers"
                value={teacherUsername}
                onChange={handleTeacherChange}
                minW="200px"
                flex="1"
              >
                {teacherList.map((teacher) => (
                  <option key={teacher.username} value={teacher.username}>
                    {teacher.name}
                  </option>
                ))}
              </Select>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Table Section */}
      <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Monthly Course Earnings (Top 10)
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead bg="gray.100">
              <Tr>
                <Th>Top</Th>
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Total Revenue</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course, index) => (
                <Tr
                  key={course.id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() =>
                    navigate(config.routes.course_detail(course?.id))
                  }
                >
                  <Td>{index + 1}</Td>
                  <Td>
                    <Avatar src={course.imagePreview} name={course.title} />
                  </Td>
                  <Td>{course.title}</Td>
                  <Td>{formatVNDMoney(course.totalRevenue)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Box mt={4} textAlign="center">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            isDisabled={page === 0}
            mr={2}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            isDisabled={page + 1 >= totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CourseBarChartPage;
