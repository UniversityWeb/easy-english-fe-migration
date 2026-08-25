import React, { useEffect, useState } from 'react';
import {
  Box,
  HStack,
  Image,
  Stack,
  Text,
  Tooltip,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import bundleService from '~/services/bundleService'; // Giả sử có service cho bundle
import { formatVNDMoney } from '~/utils/methods';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '~/components/PriceDisplay';
import config from '~/config';

const RandomBundle = ({ bundleId, numberOfBundles, type }) => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const bundleRequest = { pageNumber: 0, size: 8, name: 'long' };

        const response = await bundleService.getMyBundle(bundleRequest);
        setBundles(response.content);
      } catch (error) {
        console.error('Failed to fetch bundles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, [bundleId, numberOfBundles, type]);

  // Component để hiển thị ảnh kết hợp từ các course trong bundle
  const BundleImageGrid = ({ courses, bundleTitle }) => {
    const displayCourses = courses?.slice(0, 4) || []; // Chỉ lấy tối đa 4 course để hiển thị

    if (displayCourses.length === 0) {
      return (
        <Box
          boxSize="100px"
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
      );
    }

    if (displayCourses.length === 1) {
      return (
        <Image
          boxSize="100px"
          objectFit="cover"
          src={displayCourses[0].imagePreview}
          alt={bundleTitle}
          borderRadius="md"
        />
      );
    }

    return (
      <Box boxSize="100px" borderRadius="md" overflow="hidden">
        <Grid
          templateColumns={displayCourses.length === 2 ? '1fr 1fr' : '1fr 1fr'}
          templateRows={displayCourses.length <= 2 ? '1fr' : '1fr 1fr'}
          gap={0.5}
          height="100%"
        >
          {displayCourses.map((course, index) => (
            <GridItem key={course.id || index}>
              <Image
                width="100%"
                height="100%"
                objectFit="cover"
                src={course.imagePreview}
                alt={course.title}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  };

  const calculateBundleRating = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const totalRating = courses.reduce(
      (sum, course) => sum + (course.rating || 0),
      0,
    );
    return Math.round(totalRating / courses.length);
  };

  if (loading) {
    return <Text>Loading bundles...</Text>;
  }

  return (
    <VStack spacing={5} align="stretch">
      {bundles.map((bundle) => (
        <Box
          key={bundle.id}
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
          onClick={async () => {
            const bundleId = bundle.id;
            try {
              await bundleService.countView(bundleId); // Giả sử có method count view cho bundle
            } catch (e) {
              console.error(e);
            }
            navigate(
              config.routes.bundle_view_detail.replace(':bundleId', bundleId), // Giả sử có route cho bundle detail
            );
          }}
        >
          <HStack>
            <BundleImageGrid
              courses={bundle.courses}
              bundleTitle={bundle.title}
            />

            <Stack spacing={2} pl={4}>
              <Tooltip label={bundle.title} aria-label="Bundle Title" hasArrow>
                <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                  {bundle.title}
                </Text>
              </Tooltip>

              <PriceDisplay
                priceResponse={bundle?.price}
                primaryColor={'blue.500'} // Sử dụng màu khác để phân biệt với course
                fontWeight={'regular'}
              />

              <HStack spacing={1}>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={
                        i < calculateBundleRating(bundle.courses)
                          ? 'yellow.400'
                          : 'gray.300'
                      }
                    />
                  ))}
              </HStack>

              <Text fontSize="sm" color="gray.500">
                {bundle.courses?.length || 0} courses • By{' '}
                {bundle.owner?.fullName || 'Unknown'}
              </Text>
            </Stack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default RandomBundle;
