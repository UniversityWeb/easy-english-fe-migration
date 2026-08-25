import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Curriculum from '~/components/Teacher/CourseDetail/Curriculum';
import Drip from '~/components/Teacher/CourseDetail/Drip';
import Settings from '~/components/Teacher/CourseDetail/Setting';
import Pricing from '~/components/Teacher/CourseDetail/Pricing';
import FAQ from '~/components/Teacher/CourseDetail/Faq';
import Notice from '~/components/Teacher/CourseDetail/Notice';
import config from '~/config';
import courseService from '~/services/courseService';
import useCustomToast from '~/hooks/useCustomToast';
import { COURSE_STATUS } from '~/utils/constants';

function CourseDetailPage() {
  const { successToast, errorToast } = useCustomToast();

  const { courseId } = useParams(); // Extract courseId from URL
  const { state } = useLocation();
  const returnUrl = state?.returnUrl || config.routes.home[0];
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Curriculum'; // Get active tab from query params
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();
  const [courseStatus, setCourseStatus] = useState('');
  const handleBackClick = () => {
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate(-1);
    }
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'Curriculum':
        return <Curriculum courseId={courseId} />;
      case 'Drip':
        return <Drip courseId={courseId} />;
      case 'Settings':
        return <Settings courseId={courseId} />;
      case 'Pricing':
        return <Pricing courseId={courseId} />;
      case 'FAQ':
        return <FAQ courseId={courseId} />;
      case 'Notice':
        return <Notice courseId={courseId} />;
      default:
        return <Curriculum courseId={courseId} />;
    }
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const courseRequest = { id: courseId };
          const data = await courseService.fetchMainCourse(courseRequest);
          if (data) {
            setCourseTitle(data.title || 'Course Detail'); // Set course title from API
            setCourseStatus(data.status);
          }
        } catch (error) {
          console.error('Error fetching course data.', error);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  const handleTabChange = (index) => {
    const tabNames = [
      'Curriculum',
      'Drip',
      'Settings',
      'Pricing',
      'FAQ',
      'Notice',
    ];
    setSearchParams({ tab: tabNames[index] });
  };

  const getTabIndex = () => {
    const tabMapping = {
      Curriculum: 0,
      Drip: 1,
      Settings: 2,
      Pricing: 3,
      FAQ: 4,
      Notice: 5,
    };
    return tabMapping[activeTab] || 0;
  };

  return (
    <VStack h="100vh" bg="gray.50">
      <Flex
        bg="gray.800"
        color="white"
        px="8"
        py="4"
        alignItems="center"
        w="full"
      >
        <Button
          leftIcon={<MdArrowBack />}
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={handleBackClick}
        >
          Back to courses
        </Button>
        <Heading as="h2" size="md" ml="4">
          {courseTitle}
        </Heading>

        <Tabs
          variant="unstyled"
          ml="auto"
          index={getTabIndex()}
          onChange={handleTabChange}
        >
          <TabList>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Curriculum
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Drip
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Settings
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Pricing
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              FAQ
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Notice
            </Tab>
          </TabList>
        </Tabs>

        <Button
          colorScheme="blue"
          variant="solid"
          mr="4"
          ml="4"
          isDisabled={
            courseStatus !== 'DRAFT' &&
            courseStatus !== 'PUBLISHED' &&
            courseStatus !== 'REJECTED'
          }
          onClick={async () => {
            try {
              if (courseStatus === 'DRAFT') {
                await courseService.updateCourseStatus(
                  courseId,
                  COURSE_STATUS.PENDING_APPROVAL.value,
                );
                successToast('Send for request publish course successfully.');
                setCourseStatus(COURSE_STATUS.PENDING_APPROVAL.value);
              } else if (courseStatus === 'PUBLISHED') {
                await courseService.updateCourseStatus(courseId, 'DRAFT');
                successToast('Unpublish course successfully.');
                setCourseStatus('DRAFT');
              }
            } catch (error) {
              console.error('Error updating course status:', error);
            }
          }}
        >
          {courseStatus === COURSE_STATUS.PUBLISHED.value
            ? 'UnPublish'
            : courseStatus === COURSE_STATUS.DRAFT.value
              ? 'Request Publish'
              : courseStatus === COURSE_STATUS.PENDING_APPROVAL.value
                ? 'Pending Approval'
                : courseStatus === COURSE_STATUS.REJECTED.value
                  ? 'Request Publish'
                  : 'Deleted'}
        </Button>
        <Button
          colorScheme="blue"
          variant="solid"
          onClick={() => navigate(`/course-view-detail/${courseId}`)}
        >
          View
        </Button>
      </Flex>

      <Box
        w="full"
        h="full"
        bg="white"
        rounded="md"
        minHeight="500px"
        overflowY="auto"
      >
        {renderComponent()}
      </Box>
    </VStack>
  );
}

export default CourseDetailPage;
