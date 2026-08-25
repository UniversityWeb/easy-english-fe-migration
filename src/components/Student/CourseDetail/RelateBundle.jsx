import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  VStack,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import bundleService from '~/services/bundleService';
import courseService from '~/services/courseService';
import { formatVNDMoney } from '~/utils/methods';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '~/components/PriceDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { getDataCourse, getDataCourseAll } from '~/store/courseSlice';
import { isEmpty } from 'lodash';
import cartService from '~/services/cartService';
import useCustomToast from '~/hooks/useCustomToast';

const RelatedBundle = ({ courseId, numberOfBundles, type }) => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bundleImages, setBundleImages] = useState({});
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [selectedBundleCourses, setSelectedBundleCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { courseDataAll } = useSelector((state) => state.course);
  const { successToast, errorToast } = useCustomToast();

  const fetchRelatedBundles = async () => {
    try {
      const result = await bundleService.getAllBundle();
      const response = result?.content || [];
      setBundles(response);
      // Fetch images for each bundle's courses
      const imagePromises = response.map(async (bundle) => {
        if (bundle.courseIds && bundle.courseIds.length > 0) {
          try {
            const courses = courseDataAll?.filter((course) =>
              bundle.courseIds.includes(course.id),
            );
            console.log(
              `Fetching images for bundle ${bundle.id} with courses:`,
              courses,
            );
            return {
              bundleId: bundle.id,
              images: courses
                .map((course) => course.imagePreview || course.imageUrl)
                .filter(Boolean),
            };
          } catch (error) {
            console.error(
              `Failed to fetch courses for bundle ${bundle.id}:`,
              error,
            );
            return { bundleId: bundle.id, images: [] };
          }
        }
        return { bundleId: bundle.id, images: [] };
      });

      const imageResults = await Promise.all(imagePromises);
      const imageMap = {};
      imageResults.forEach((result) => {
        imageMap[result.bundleId] = result.images;
      });
      setBundleImages(imageMap);
      console.log('Bundle images:', imageMap);
    } catch (error) {
      console.error('Failed to fetch related bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBundleCourses = async (bundle) => {
    setLoadingCourses(true);
    try {
      if (bundle.courseIds && bundle.courseIds.length > 0) {
        const courses = courseDataAll?.filter((course) =>
          bundle.courseIds.includes(course.id),
        );
        setSelectedBundleCourses(courses || []);
      } else {
        setSelectedBundleCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch bundle courses:', error);
      setSelectedBundleCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleBundleClick = async (bundle) => {
    setSelectedBundle(bundle);
    onOpen();
    await fetchBundleCourses(bundle);

    // Count view
    try {
      await bundleService.countView(bundle.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = async () => {
    // Thêm logic add to cart ở đây
    try {
      await cartService.addBundleToCart(selectedBundle.id);
      successToast('Added to cart');
      //   const addRequest = {
      //     username: getUsername(),
      //   };
      //   const wsService = await WebsocketService.getIns();
      //   wsService.send(websocketConstants.cartItemCountDestination, addRequest);
      //   setButtonState(CourseDetailBtnStat.IN_CART);
    } catch (error) {
      errorToast('Error adding to cart');
    }
    onClose();
  };

  const handleViewBundleDetail = () => {
    onClose();
    navigate(`/bundle-view-detail/${selectedBundle.id}`);
  };

  useEffect(() => {
    if (isEmpty(courseDataAll)) {
      dispatch(getDataCourseAll());
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(courseDataAll)) {
      fetchRelatedBundles();
    }
  }, [courseDataAll]);

  const renderBundleImages = (bundle) => {
    const images = bundleImages[bundle.id] || [];

    if (images.length === 0) {
      return (
        <Box
          w="100%"
          h="150px"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
        >
          <Text color="gray.500">No Image</Text>
        </Box>
      );
    }

    if (images.length === 1) {
      return (
        <Image
          w="100%"
          h="150px"
          objectFit="cover"
          src={images[0]}
          alt={bundle.name}
          borderRadius="md"
        />
      );
    }

    if (images.length === 2) {
      return (
        <HStack spacing={1} h="150px">
          <Image
            w="50%"
            h="100%"
            objectFit="cover"
            src={images[0]}
            alt={`${bundle.name} course 1`}
            borderRadius="md"
          />
          <Image
            w="50%"
            h="100%"
            objectFit="cover"
            src={images[1]}
            alt={`${bundle.name} course 2`}
            borderRadius="md"
          />
        </HStack>
      );
    }

    if (images.length === 3) {
      return (
        <HStack spacing={1} h="150px">
          <Image
            w="50%"
            h="100%"
            objectFit="cover"
            src={images[0]}
            alt={`${bundle.name} course 1`}
            borderRadius="md"
          />
          <VStack spacing={1} w="50%" h="100%">
            <Image
              w="100%"
              h="49%"
              objectFit="cover"
              src={images[1]}
              alt={`${bundle.name} course 2`}
              borderRadius="md"
            />
            <Image
              w="100%"
              h="49%"
              objectFit="cover"
              src={images[2]}
              alt={`${bundle.name} course 3`}
              borderRadius="md"
            />
          </VStack>
        </HStack>
      );
    }

    // 4 or more images
    return (
      <Grid templateColumns="1fr 1fr" templateRows="1fr 1fr" gap={1} h="150px">
        <Image
          w="100%"
          h="100%"
          objectFit="cover"
          src={images[0]}
          alt={`${bundle.name} course 1`}
          borderRadius="md"
        />
        <Image
          w="100%"
          h="100%"
          objectFit="cover"
          src={images[1]}
          alt={`${bundle.name} course 2`}
          borderRadius="md"
        />
        <Image
          w="100%"
          h="100%"
          objectFit="cover"
          src={images[2]}
          alt={`${bundle.name} course 3`}
          borderRadius="md"
        />
        <Box position="relative">
          <Image
            w="100%"
            h="100%"
            objectFit="cover"
            src={images[3]}
            alt={`${bundle.name} course 4`}
            borderRadius="md"
          />
          {images.length > 4 && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
            >
              <Text color="white" fontWeight="bold" fontSize="lg">
                +{images.length - 4}
              </Text>
            </Box>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <>
      <VStack spacing={5} align="stretch">
        <Text fontWeight="bold" fontSize="xl" mb={4}>
          Related Bundles
        </Text>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {bundles.map((bundle, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                padding="4"
                boxShadow="sm"
                cursor="pointer"
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                }}
                _active={{
                  transform: 'scale(1)',
                  transition: 'transform 0.1s ease-in-out',
                }}
                onClick={() => handleBundleClick(bundle)}
              >
                <Box position="relative">
                  {renderBundleImages(bundle)}
                  {bundle.isHot && (
                    <Badge
                      position="absolute"
                      top="2"
                      right="2"
                      colorScheme="red"
                      fontSize="0.8em"
                    >
                      HOT
                    </Badge>
                  )}
                  {bundle.isSpecial && (
                    <Badge
                      position="absolute"
                      top="2"
                      right="2"
                      colorScheme="green"
                      fontSize="0.8em"
                    >
                      SPECIAL
                    </Badge>
                  )}
                  <Badge
                    position="absolute"
                    top="2"
                    left="2"
                    colorScheme="blue"
                    fontSize="0.8em"
                  >
                    BUNDLE
                  </Badge>
                </Box>
                <Stack spacing={2} pt={4}>
                  <Tooltip
                    label={bundle.name}
                    aria-label="Bundle Name"
                    hasArrow
                  >
                    <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                      {bundle.name}
                    </Text>
                  </Tooltip>

                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {bundle.desc}
                  </Text>

                  <Text fontWeight="bold" color="green.500">
                    {formatVNDMoney(bundle.price)}
                  </Text>

                  <Text fontSize="sm" color="gray.500">
                    {bundle.courseIds?.length || 0} courses included
                  </Text>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Bundle Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <Badge colorScheme="blue" fontSize="0.8em">
                  BUNDLE
                </Badge>
                {selectedBundle?.isHot && (
                  <Badge colorScheme="red" fontSize="0.8em">
                    HOT
                  </Badge>
                )}
                {selectedBundle?.isSpecial && (
                  <Badge colorScheme="green" fontSize="0.8em">
                    SPECIAL
                  </Badge>
                )}
              </HStack>
              <Text fontSize="xl" fontWeight="bold">
                {selectedBundle?.name}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Bundle Description */}
              <Box>
                <Text fontSize="md" color="gray.600">
                  {selectedBundle?.desc}
                </Text>
              </Box>

              {/* Bundle Price */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {selectedBundle && formatVNDMoney(selectedBundle.price)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedBundle?.courseIds?.length || 0} courses included
                </Text>
              </Box>

              <Divider />

              {/* Course List */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Courses in this Bundle
                </Text>

                {loadingCourses ? (
                  <Flex justify="center" py={4}>
                    <Spinner size="md" />
                  </Flex>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {selectedBundleCourses.map((course, index) => (
                      <Box
                        key={course.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor="gray.200"
                      >
                        <HStack
                          spacing={3}
                          onClick={() => {
                            navigate(`/course-view-detail/${course.id}`);
                            onClose();
                          }}
                          cursor={'pointer'}
                        >
                          <Image
                            src={course.imagePreview || course.imageUrl}
                            alt={course.name}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            fallback={
                              <Box
                                boxSize="60px"
                                bg="gray.200"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text fontSize="xs" color="gray.500">
                                  No Image
                                </Text>
                              </Box>
                            }
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              noOfLines={2}
                            >
                              {course.title}
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {course.descriptionPreview || course.description}
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {formatVNDMoney(course.price.price)}
                            </Text>
                            <HStack>
                              <StarIcon color="yellow.400" boxSize={3} />
                              <Text fontSize="xs" color="gray.600">
                                {course.rating || 0}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </Box>
                    ))}

                    {selectedBundleCourses.length === 0 && !loadingCourses && (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No courses found in this bundle
                      </Text>
                    )}
                  </VStack>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <VStack spacing={3} w="100%">
              <Button
                colorScheme="blue"
                size="lg"
                w="100%"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RelatedBundle;
