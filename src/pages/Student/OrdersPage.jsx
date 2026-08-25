import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Skeleton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import orderService from '~/services/orderService';
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';
import { delayLoading, formatDate, formatVNDMoney } from '~/utils/methods';
import { DEFAULT_LIST_SIZE, getOrdersTabStatusByIndex, SAVED_ORDERS_TAB_INDEX_KEY } from '~/utils/constants';
import config from '~/config';
import StudentPageLayout from '~/components/StudentPageLayout';

const OrdersPage = () => {
  const username = getUsername();
  const { successToast, errorToast } = useCustomToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const savedIndex = localStorage.getItem(SAVED_ORDERS_TAB_INDEX_KEY) || 0;
  const [selectedIndex, setSelectedIndex] = useState(parseInt(savedIndex));

  useEffect(() => {
    fetchOrdersByStatus(page, selectedIndex);
  }, [page, selectedIndex]);

  const fetchOrdersByStatus = async (pageNumber, selectedIndex) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const status = getOrdersTabStatusByIndex(selectedIndex);
      const response = await fetchOrders(status, pageNumber);
      const orders = response?.content;
      setOrders(orders || []);
      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      console.log(error?.message);
      errorToast('Error fetching orders');
    } finally {
      await delayLoading(startTime);
      setLoading(false);
    }
  };

  const fetchOrders = async (status, pageNumber) => {
    if (status === 'All') {
      return orderService.getOrdersByUsername(username, pageNumber);
    }
    return orderService.getOrdersByStatus(username, status, pageNumber);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  return (
    <StudentPageLayout>
      <Container maxW="80%" mb="50px">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Orders
        </Text>

        <Tabs
          index={selectedIndex}
          onChange={(index) => {
            localStorage.setItem(SAVED_ORDERS_TAB_INDEX_KEY, index);
            setSelectedIndex(index);
            setPage(0);
          }}
        >
          <TabList>
            <Tab>All</Tab>
            <Tab>Pending payment</Tab>
            <Tab>Paid</Tab>
            <Tab>Failed</Tab>
            <Tab>Expired</Tab>
          </TabList>

          <OrderList orders={orders} loading={loading} />
        </Tabs>

        <Flex justify="center" align="center" mt={6} mb={50} gap={10}>
          <Button
            onClick={handlePreviousPage}
            disabled={page === 0}
            colorScheme={page === 0 ? "gray" : "blue"}
            size="md"
            variant="outline"
            leftIcon={page > 0 ? <FaArrowLeft /> : null}
            _hover={{
              bg: page > 0 ? "blue.500" : "",
              color: page > 0 ? "white" : "",
            }}
          >
            Prev
          </Button>

          <Text fontSize="sm" color="gray.600">
            Page {page + 1} of {totalPages}
          </Text>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            colorScheme={page === totalPages - 1 ? "gray" : "blue"}
            size="md"
            variant="outline"
            rightIcon={page < totalPages - 1 ? <FaArrowRight /> : null}
            _hover={{
              bg: page < totalPages - 1 ? "blue.500" : "",
              color: page < totalPages - 1 ? "white" : "",
            }}
          >
            Next
          </Button>
        </Flex>
      </Container>
    </StudentPageLayout>
  );
};

const OrderList = ({ orders, loading }) => {
  const navigate = useNavigate();

  const handleOrderClick = (orderId) => {
    navigate(config.routes.order_detail.replace(':orderId', orderId));
  };

  return (
    <Stack spacing={4} mt={6} px={6}>
      {loading ? (
        [...Array(DEFAULT_LIST_SIZE)].map((_, index) => (
          <Skeleton key={index} height="100px" borderRadius="md" />
        ))
      ) : orders.length === 0 ? (
        <Text fontSize="xl" color="gray.500" textAlign="center">
          No orders available.
        </Text>
      ) : (
        orders.map((order) => (
          <Box
            key={order.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            backgroundColor="white"
            display="flex"
            flexDirection="column"
            cursor="pointer"
            _hover={{ backgroundColor: 'gray.100' }}
            onClick={() => handleOrderClick(order.id)}
          >
            {/* Order Information */}
            <Box flex="1" mb={4}>
              <Text fontSize="sm" color="gray.500">
                Total Amount: {formatVNDMoney(order.totalAmount)}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Created At: {formatDate(order.createdAt)}
              </Text>
              <Badge colorScheme={order.status === 'PAID' ? 'green' : 'red'}>
                {order.status}
              </Badge>
            </Box>

            {/* Displaying Order Items with Preview Images */}
            <Box>
              {order.items && order.items.length > 0 ? (
                <Stack spacing={3}>
                  {order.items.map((item) => (
                    <Flex key={item.id} align="center" borderWidth="1px" borderRadius="md" p={2}>
                      <Image
                        src={item.course.imagePreview} // Assuming the preview image is from the course object
                        alt={item.course.title} // Alt text as the course title
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                        mr={4}
                    />
                      <Box flex="1">
                        <Text fontWeight="bold">{item.course.title}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {item.price === 0 ? "Free" : `Price: ${formatVNDMoney(item.price)} `}
                          {item.discountPercent > 0 && ` (Discount: ${item.discountPercent}%)`}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No items available for this order.
                </Text>
              )}
            </Box>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default OrdersPage;
