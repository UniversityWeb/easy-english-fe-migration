import React, { useEffect, useState } from 'react';
import { Container, Heading, Flex, Button, Box } from '@chakra-ui/react';
import { getDataCourse } from '~/store/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import bundleService from '~/services/bundleService';
import { CourseBundle } from '~/components/Teacher/Bundle/CourseBundle';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const BundleList = () => {
  const [hoveredBundle, setHoveredBundle] = useState(null);
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);
  const [bundles, setBundles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(courseData)) {
      dispatch(getDataCourse());
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const bundleRequest = { pageNumber: 0, size: 8, name: '' };

      const response = await bundleService.getMyBundle(bundleRequest);
      if (response) {
        setBundles(response.content);
      }
    } catch (error) {
      console.error('Error fetching enroll bundles:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <RoleBasedPageLayout>
      <Container maxW="container.xl" py={8}>
        {/* Header Section */}
        <Flex justify="space-between" align="center" mb={8}>
          <Heading as="h2" size="xl">
            Course Bundles
          </Heading>
          <Button
            colorScheme="teal"
            onClick={() => navigate(config.routes.bundle_add)}
          >
            Add Bundle
          </Button>
        </Flex>

        {/* Bundle List */}
        <Flex wrap="wrap" gap={6} justify="center">
          {bundles.map((bundle) => (
            <CourseBundle
              key={bundle.id}
              data={bundle}
              isHovered={hoveredBundle === bundle.name}
              setHovered={setHoveredBundle}
              fetchCourses={fetchCourses}
            />
          ))}
        </Flex>
      </Container>
    </RoleBasedPageLayout>
  );
};

export default BundleList;
