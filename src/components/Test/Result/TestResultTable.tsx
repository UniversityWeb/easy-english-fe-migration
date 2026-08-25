import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { FaBan, FaFilter, FaRedo, FaSearch } from 'react-icons/fa';
import { websocketConstants } from '~/utils/websocketConstants';
import testResultService from '~/services/testResultService';
import useCustomToast from '~/hooks/useCustomToast';
import { TEST_RESULT_STATUSES } from '~/utils/constants';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WebSocketService from '~/services/websocketService';

const TestResultTable = ({ testId, courseId }) => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchFilters, setSearchFilters] = useState({
    username: '',
    finishedAt: '',
  });
  const [currentPage, setCurrentPage] = useState(0); // Page index starts from 0
  const [totalPages, setTotalPages] = useState(1);   // Total number of pages
  const pageSize = 10;                               // Fixed page size
  const { infoToast, successToast, errorToast } = useCustomToast();
  const navigate = useNavigate();

  // Fetch test results by testId with pagination
  const fetchTestResults = useCallback(async (page = 0) => {
    setLoading(true); // Trigger loading
    try {
      const data = await testResultService.getTestHistory(testId, page, pageSize);
      setTestResults(data.content || []);
      setTotalPages(data.totalPages || 1); // Update total pages from the response
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error fetching test results:', error);
      setLoading(false); // Stop loading even if there's an error
    }
  }, [pageSize, testId]);

  // Effect to fetch test results on component mount and when page changes
  useEffect(() => {
    fetchTestResults(currentPage);
  }, [currentPage, fetchTestResults]);

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(websocketConstants.testResultNotificationTopic(testId), (newTestResult) => {
          setTestResults((prevResults) => {
            if (!prevResults.some(result => result.id === newTestResult.id)) {
              const updatedResults = [newTestResult, ...prevResults];
              if (updatedResults.length > pageSize) {
                updatedResults.pop();
              }
              return updatedResults;
            }
            return prevResults;
          });
          infoToast('Received new test result!');
        });
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    }

    initializeWebsocket();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.testResultNotificationTopic(testId));
      }
    }
  }, [infoToast, pageSize, testId]);

  // Handle deleting a test result
  const deleteTestResult = useCallback(async (id) => {
    try {
      await testResultService.remove(id);
      setTestResults((prevResults) => prevResults.filter((result) => result.id !== id));
      successToast('Test result deleted successfully!');
    } catch (error) {
      console.error('Error deleting test result:', error);
      errorToast('Failed to delete test result.');
    }
  }, [errorToast, successToast]);

  // Handle filtering the results based on username and finishedAt
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Apply filters to test results
  const filteredResults = testResults.filter((result) => {
    const matchesUsername = result.username.toLowerCase().includes(searchFilters.username.toLowerCase());
    const matchesFinishedAt = searchFilters.finishedAt
      ? result.finishedAt.startsWith(searchFilters.finishedAt)
      : true;
    return matchesUsername && matchesFinishedAt;
  });

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  // Reload the table data
  const handleReload = () => {
    fetchTestResults(currentPage);  // Fetch the data again for the current page
  };

  // Get status color for each status
  const getStatusColor = (status) => {
    switch (status) {
      case TEST_RESULT_STATUSES.DONE:
        return 'green.200'; // Green color for DONE status
      case TEST_RESULT_STATUSES.IN_PROGRESS:
        return 'yellow.200'; // Yellow color for IN_PROGRESS status
      case TEST_RESULT_STATUSES.FAILED:
        return 'red.200'; // Red color for FAILED status
      default:
        return 'gray.100'; // Default color
    }
  };

  const navigateToTestResult = (result) => {
    navigate(config.routes.test_result(result?.id), {
      state: { returnUrl: config.routes.course_detail(courseId) }
    });
  };

  // Motion configuration for zoom-in animation
  const zoomInAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 }
  };

  return (
    <Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
      {/* Filter Bar */}
      <VStack spacing={4} mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Filter by username"
            name="username"
            value={searchFilters.username}
            onChange={handleFilterChange}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaFilter} color="gray.300" />
          </InputLeftElement>
          <Input
            type="date"
            placeholder="Filter by finishedAt (YYYY-MM-DD)"
            name="finishedAt"
            value={searchFilters.finishedAt}
            onChange={handleFilterChange}
          />
        </InputGroup>
      </VStack>

      {/* Reload Button */}
      <HStack justifyContent="flex-end" mb={4}>
        <Button leftIcon={<FaRedo />} colorScheme="blue" onClick={handleReload} isLoading={loading}>
          Reload
        </Button>
      </HStack>

      {/* Table Container with Fixed Height, Scrollable */}
      <Box borderWidth="1px" borderRadius="md" overflow="auto" maxHeight="400px">
        {loading ? (
          <Skeleton height="400px" />
        ) : testResults.length === 0 ? (
          // Show Empty State if there are no results
          <Flex direction="column" alignItems="center" justifyContent="center" height="400px">
            <Icon as={FaBan} boxSize="50px" color="gray.400" />
            <Text mt={4} fontSize="lg" color="gray.500">
              No test results found.
            </Text>
          </Flex>
        ) : (
          <Table variant="simple" size="sm" minWidth="800px" overflowX="auto">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Correct Percent</Th>
                <Th>Status</Th>
                <Th>Started At</Th>
                <Th>Finished At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredResults.map((result) => (
                <motion.tr
                  key={result.id}
                  {...zoomInAnimation}
                  onClick={() => navigateToTestResult(result)}
                  whileHover={{
                    cursor: 'pointer',
                    backgroundColor: '#f7fafc', // Chakra's 'gray.100' equivalent
                    transition: { duration: 0.3 },
                  }}
                >
                  <Td>{result.username}</Td>
                  <Td>
                    {new Intl.NumberFormat('en-US', {
                      style: 'percent',
                      maximumFractionDigits: 2,
                    }).format(result.correctPercent / 100)}
                  </Td>
                  <Td>
                    <Box
                      bg={getStatusColor(result.status)} // Apply background color based on status
                      borderRadius="md"
                      p={2}
                      textAlign="center"
                    >
                      {result.status}
                    </Box>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap' }}>{new Date(result.startedAt).toLocaleString()}</Td>
                  <Td style={{ whiteSpace: 'nowrap' }}>{new Date(result.finishedAt).toLocaleString()}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when 'Delete' is clicked
                        deleteTestResult(result.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </motion.tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination Controls - Centered and placed at the bottom */}
      <HStack justifyContent="center" mt={4}>
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 0}>
          Previous
        </Button>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages - 1 || totalPages === 0}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default TestResultTable;