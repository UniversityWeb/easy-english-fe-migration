import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Box, Container, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import orderService from '../../services/orderService';
import { formatDate, formatVNDMoney } from '~/utils/methods';
import StudentPageLayout from '~/components/StudentPageLayout';
import config from '~/config';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={20}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <StudentPageLayout>
      <Container maxW="80%" mb="50px">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={8} mb={6}>
          Order Details
        </Text>

        {/* Order Summary Section */}
        <OrderSummary order={order} />

        {/* Order Items Section */}
        <OrderItems items={order.items} navigate={navigate}/>
      </Container>
    </StudentPageLayout>
  );
};

const OrderSummary = ({ order }) => (
  <Box mt={4} borderWidth="1px" borderRadius="lg" shadow="md" p={6} mb={6}>
    <Text fontSize="lg" fontWeight="bold">
      Order ID: {order.id}
    </Text>
    <Text mt={2}>
      Total Amount: {formatVNDMoney(order.totalAmount)}
    </Text>
    <Text mt={2}>Created At: {formatDate(order.createdAt)}</Text>
    <Text mt={2}>Updated At: {formatDate(order.updatedAt)}</Text>
    <Badge mt={3} colorScheme={order.status === 'PAID' ? 'green' : 'red'}>
      {order.status}
    </Badge>
  </Box>
);

const OrderItems = ({ items, navigate }) => {
  if (items.length === 0) {
    return <Text color="gray.500" mt={6}>No items in this order.</Text>;
  }

  return (
    <Box mt={4} borderWidth="1px" borderRadius="lg" shadow="md" p={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Order Items</Text>

      {items.map(item => (
        <Flex
          key={item.id}
          alignItems="center"
          borderBottomWidth="1px"
          py={4}
          justifyContent="space-between"
          _last={{ borderBottomWidth: 0 }}
          _hover={{ bg: 'gray.100', cursor: 'pointer' }}
          onClick={() => navigate(config.routes.course_view_detail.replace(':courseId', item?.course?.id))}
        >
          {/* Left side: Item details */}
          <Box flex="1">
            <Text fontWeight="bold">Course: {item.course.title}</Text>
            <Text mt={1}>
              {item.price === 0 ? "Free" : `Price: ${formatVNDMoney(item.price)} `}
            </Text>
            {item.discountPercent > 0 && (
              <Text mt={1} color="orange.500">
                Discount: ${item.discountPercent}%
              </Text>
            )}
          </Box>

          {/* Right side: Course image */}
          <Image
            src={item.course.imagePreview} // Assuming the image URL is stored in course.imagePreview
            alt={item.course.title}
            boxSize="100px"
            objectFit="cover"
            borderRadius="md"
            ml={4}
          />
        </Flex>
      ))}
    </Box>
  );
};

export default OrderDetailPage;
