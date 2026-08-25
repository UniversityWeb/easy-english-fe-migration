import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import cartService from '~/services/cartService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import paymentService from '~/services/paymentService';
import { getUsername } from '~/utils/authUtils';
import config from '~/config';
import { PAYMENT_STATUES } from '~/utils/constants';
import { useNavigate } from 'react-router-dom';
import bundleService from '~/services/bundleService';

const CartPage = () => {
  const { successToast, errorToast } = useCustomToast();
  const [cart, setCart] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBundle = async () => {
    setLoading(true);
    try {
      const result = await bundleService.getAllBundle();
      const response = result?.content || [];
      setBundles(response);
    } catch (error) {
      console.error(error.message);
      errorToast('Failed to fetch bundle data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundle();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error(error.message);
      errorToast('Failed to fetch cart data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId) => {
    try {
      await cartService.removeItemFromCart(courseId);
      successToast('Course removed from cart.');
      fetchCart();
    } catch (error) {
      console.error(error.message);
      errorToast('Error removing course from cart.');
    }
  };

  const handleRemoveBundle = async (bundle) => {
    try {
      // Remove all courses in bundle
      const removePromises = bundle.courses.map((item) =>
        cartService.removeItemFromCart(item.id),
      );

      await Promise.all(removePromises);
      successToast(`Bundle removed from cart.`);
      fetchCart();
    } catch (error) {
      console.error(error.message);
      errorToast('Error removing bundle from cart.');
    }
  };

  const handleCheckout = async () => {
    const username = getUsername();
    try {
      const urlReturn = `${window.location.protocol}//${window.location.host}${config.routes.payment_result}`;
      const paymentRequest = {
        username: username,
        method: 'VN_PAY',
        urlReturn: urlReturn,
      };

      const paymentResponse =
        await paymentService.createPaymentOrder(paymentRequest);
      successToast('Checkout successful! Redirecting to payment...');

      if (paymentResponse?.status === PAYMENT_STATUES.SUCCESS) {
        if (!paymentResponse?.orderId) {
          return;
        }

        navigate(
          config.routes.order_detail.replace(
            ':orderId',
            paymentResponse?.orderId,
          ),
        );
        return;
      }
      window.location.href = paymentResponse?.paymentUrl;
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout. Please try again.');
    }
  };

  // Check if all courses in a bundle are present in cart
  const isBundleComplete = (bundleData, cartItems) => {
    const cartCourseIds = cartItems.map((item) => item.course?.id);
    return bundleData.courseIds.every((courseId) =>
      cartCourseIds.includes(courseId),
    );
  };

  // Group items by bundleId and only show complete bundles
  const groupItemsByBundle = (items) => {
    const grouped = {
      bundles: {},
      individualCourses: [],
    };

    // Create a map of course IDs to cart items for easier lookup
    const courseIdToCartItem = {};
    items.forEach((item) => {
      courseIdToCartItem[item.course.id] = item;
    });

    // Check each bundle to see if it's complete
    bundles.forEach((bundleData) => {
      if (isBundleComplete(bundleData, items)) {
        // Bundle is complete, group the courses
        const bundleInfo = {
          bundleId: bundleData.id,
          bundleName: bundleData.name,
          bundleDescription: bundleData.desc,
          bundlePrice: bundleData.price, // Use actual bundle price
          courses: [],
          totalOriginalPrice: 0, // Sum of individual course prices
        };

        bundleData.courseIds.forEach((courseId) => {
          const cartItem = courseIdToCartItem[courseId];
          if (cartItem) {
            bundleInfo.courses.push(cartItem);
            bundleInfo.totalOriginalPrice += cartItem.course?.price?.price || 0;
          }
        });

        grouped.bundles[bundleData.id] = bundleInfo;
      }
    });

    // Add remaining courses as individual courses (not part of complete bundles)
    items.forEach((item) => {
      const isPartOfCompleteBundle = Object.values(grouped.bundles).some(
        (bundle) =>
          bundle.courses.some(
            (bundleCourse) => bundleCourse.course.id === item.course.id,
          ),
      );

      if (!isPartOfCompleteBundle) {
        grouped.individualCourses.push(item);
      }
    });

    return grouped;
  };

  // Calculate correct total amount
  const calculateCorrectTotal = (groupedItems) => {
    let total = 0;

    // Add bundle prices
    Object.values(groupedItems.bundles).forEach((bundle) => {
      total += bundle.bundlePrice || 0;
    });

    // Add individual course prices
    groupedItems.individualCourses.forEach((item) => {
      const coursePrice = item.course?.price?.price || 0;
      const discountedPrice = item.discountPercent
        ? coursePrice -
          (coursePrice * item.discountPercent) / 100
        : coursePrice;
      total += discountedPrice;
    });

    return total;
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
  };

  const renderCourseCard = (item, isInBundle = false) => {
    const {
      id,
      course = {},
      discountPercent = 0,
    } = item;

    const {
      title,
      ownerUsername,
      imagePreview,
      duration,
      countStudent,
      rating,
      ratingCount,
      price: coursePriceObj,
    } = course;

    const price = coursePriceObj?.price || 0;
    const salePrice = coursePriceObj?.salePrice || 0;

    const discountedPrice = discountPercent
      ? calculateDiscountedPrice(price, discountPercent)
      : price;

    return (
      <Box
        key={id}
        borderWidth={isInBundle ? '0' : '1px'}
        borderRadius="md"
        p={4}
        mb={isInBundle ? 2 : 4}
        bg={isInBundle ? 'gray.50' : 'white'}
      >
        <Flex align="center" mb={4}>
          <Image
            src={imagePreview || 'https://via.placeholder.com/150'}
            alt={title}
            boxSize={isInBundle ? '80px' : '100px'}
            objectFit="cover"
            borderRadius="md"
            mr={4}
          />
          <Box>
            <Text
              fontWeight="bold"
              fontSize={isInBundle ? 'md' : 'lg'}
              minWidth="370px"
            >
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              By {ownerUsername}
            </Text>
            <Badge
              colorScheme="green"
              mt={2}
              visibility={countStudent || countStudent === 0}
            >
              {countStudent} Students
            </Badge>
            <Text mt={1}>
              <strong>{(rating || 0).toFixed(1)}</strong> ⭐️ ({ratingCount || 0} ratings)
            </Text>
            <Text fontSize="sm" color="gray.500">
              {duration} total hours
            </Text>
          </Box>
          <Box ml="auto" textAlign="right">
            {!isInBundle && (
              <>
                <Text color="purple.600" fontWeight="bold" fontSize="lg">
                  đ{discountedPrice.toLocaleString()}
                </Text>
                {discountPercent > 0 && (
                  <Text as="s" color="gray.500" fontSize="sm">
                    đ{price.toLocaleString()}
                  </Text>
                )}
              </>
            )}
          </Box>
        </Flex>
        {!isInBundle && (
          <HStack spacing={4} mt={2}>
            <Button
              variant="link"
              colorScheme="purple"
              onClick={() => handleRemoveItem(id)}
            >
              Remove
            </Button>
          </HStack>
        )}
      </Box>
    );
  };

  const renderBundle = (bundle) => {
    const bundlePrice = bundle.bundlePrice || 0;
    const originalPrice = bundle.totalOriginalPrice;
    const savings = originalPrice - bundlePrice;

    return (
      <Box
        key={bundle.bundleId}
        borderWidth="2px"
        borderColor="purple.200"
        borderRadius="lg"
        p={4}
        mb={4}
        bg="purple.50"
      >
        {/* Bundle Header */}
        <Flex justify="space-between" align="center" mb={4}>
          <VStack align="start" spacing={1}>
            <Heading size="md" color="purple.700">
              📦 {bundle.bundleName}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Bundle contains {bundle.courses.length} courses
            </Text>
            {bundle.bundleDescription && (
              <Text fontSize="sm" color="gray.500">
                {bundle.bundleDescription}
              </Text>
            )}
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="purple.600">
              đ{bundlePrice.toLocaleString()}
            </Text>
            {savings > 0 && (
              <>
                <Text as="s" color="gray.500" fontSize="sm">
                  đ{originalPrice.toLocaleString()}
                </Text>
                <Badge colorScheme="green" fontSize="xs">
                  Save đ{savings.toLocaleString()}
                </Badge>
              </>
            )}
          </VStack>
        </Flex>

        <Divider mb={4} />

        {/* Bundle Courses */}
        <VStack spacing={2} align="stretch">
          {bundle.courses.map((item) => renderCourseCard(item, true))}
        </VStack>

        {/* Bundle Actions */}
        <HStack
          spacing={4}
          mt={4}
          pt={2}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => handleRemoveBundle(bundle)}
          >
            Remove Bundle
          </Button>
          <Text fontSize="sm" color="gray.500">
            Removing bundle will remove all courses in this bundle
          </Text>
        </HStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <RoleBasedPageLayout>
        <Box p={8} maxW="1200px" mx="auto" textAlign="center">
          <Heading size="lg" mb={4}>
            Your Cart is Empty
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Add some courses to your cart to get started!
          </Text>
        </Box>
      </RoleBasedPageLayout>
    );
  }

  const groupedItems = groupItemsByBundle(cart.items);
  const bundleCount = Object.keys(groupedItems.bundles).length;
  const individualCourseCount = groupedItems.individualCourses.length;

  // Calculate the correct total
  const correctTotal = calculateCorrectTotal(groupedItems);

  return (
    <RoleBasedPageLayout>
      <Box p={8} maxW="1200px" mx="auto">
        <Heading size="lg" mb={6}>
          Shopping Cart
        </Heading>

        <Flex>
          {/* Left Side - Course Cards and Bundles */}
          <Box flex="1" pr={8}>
            <Text fontSize="lg" mb={4}>
              {bundleCount > 0 &&
                `${bundleCount} ${bundleCount > 1 ? 'Bundles' : 'Bundle'}`}
              {bundleCount > 0 && individualCourseCount > 0 && ', '}
              {individualCourseCount > 0 &&
                `${individualCourseCount} Individual ${individualCourseCount > 1 ? 'Courses' : 'Course'}`}{' '}
              in Cart
            </Text>

            {/* Render Bundles */}
            {Object.values(groupedItems.bundles).map((bundle) =>
              renderBundle(bundle),
            )}

            {/* Render Individual Courses */}
            {groupedItems.individualCourses.length > 0 && (
              <>
                {bundleCount > 0 && (
                  <Heading size="md" mt={6} mb={4} color="gray.700">
                    Individual Courses
                  </Heading>
                )}
                {groupedItems.individualCourses.map((item) =>
                  renderCourseCard(item, false),
                )}
              </>
            )}
          </Box>

          {/* Right Side - Payment Summary */}
          <Box w="300px" borderWidth="1px" borderRadius="md" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Total:
            </Text>
            <Text fontSize="3xl" color="purple.600" fontWeight="bold">
              {formatVNDMoney(correctTotal)}
            </Text>

            {/* Summary breakdown */}
            <VStack align="stretch" mt={4} spacing={2}>
              {bundleCount > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {bundleCount} Bundle{bundleCount > 1 ? 's' : ''}
                </Text>
              )}
              {individualCourseCount > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {individualCourseCount} Individual Course
                  {individualCourseCount > 1 ? 's' : ''}
                </Text>
              )}
            </VStack>

            <Button
              colorScheme="purple"
              w="full"
              mt={4}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        </Flex>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CartPage;
