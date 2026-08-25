import React, { useEffect, useState } from 'react';
import { Box, Collapse, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import testService from '~/services/testService';
import { FiFileText, FiHelpCircle, FiVideo } from 'react-icons/fi';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { SEC_ITEM_TYPES } from '~/utils/constants';

const Curriculum = ({ courseId }) => {
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState([]);
  const [openLessons, setOpenLessons] = useState({});

  useEffect(() => {
    const fetchCurriculumData = async () => {
      setLoading(true);
      try {
        const sections = await sectionService.fetchSectionsByCourse({
          courseId: courseId,
        });

        const sectionsWithContent = await Promise.all(
          sections.map(async (section) => {
            const [lessons, tests] = await Promise.all([
              lessonService.fetchLessons({ sectionId: section.id }),
              testService.getTestsBySection(section.id),
            ]);

            const formattedLessons = lessons.map((lesson) => ({
              ...lesson,
              type: SEC_ITEM_TYPES.LESSON,
              icon: getLessonIcon(lesson.type),
              color: getLessonColor(lesson.type),
            }));

            const formattedTests = tests.map((test) => ({
              ...test,
              type: SEC_ITEM_TYPES.TEST,
              title: test.title, // Adjust based on the test data structure
              duration: 0, // Tests might not have a duration
              icon: getLessonIcon(SEC_ITEM_TYPES.TEST),
              color: getLessonColor(SEC_ITEM_TYPES.TEST),
            }));

            return {
              ...section,
              items: [...formattedLessons, ...formattedTests],
            };
          }),
        );

        setCurriculumData(sectionsWithContent);
        setOpenSections(sectionsWithContent.map(() => false));
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      }
      setLoading(false);
    };

    fetchCurriculumData();
  }, [courseId]);

  const toggleSection = (index) => {
    setOpenSections((prevState) =>
      prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const toggleLessonDescription = (lessonId) => {
    setOpenLessons((prevOpenLessons) => ({
      ...prevOpenLessons,
      [lessonId]: !prevOpenLessons[lessonId],
    }));
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case SEC_ITEM_TYPES.VIDEO:
        return FiVideo;
      case SEC_ITEM_TYPES.AUDIO:
        return HiOutlineSpeakerWave;
      case SEC_ITEM_TYPES.TEST:
        return FiHelpCircle;
      default:
        return FiFileText;
    }
  };

  const getLessonColor = (type) => {
    switch (type) {
      case SEC_ITEM_TYPES.VIDEO:
        return 'blue.500';
      case SEC_ITEM_TYPES.AUDIO:
        return 'purple.500';
      case SEC_ITEM_TYPES.TEST:
        return 'orange.500';
      default:
        return 'green.500';
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box mt={4}>
      {curriculumData.map((section, index) => (
        <Box key={section.id} mb={4}>
          <HStack
            p={1}
            justify="space-between"
            cursor="pointer"
            onClick={() => toggleSection(index)}
            _hover={{ bg: 'gray.100' }}
          >
            <Text fontWeight="medium" fontSize="lg">
              {section.title}
            </Text>
            <Icon as={openSections[index] ? RxTriangleUp : RxTriangleDown} />
          </HStack>
          <Collapse in={openSections[index]} animateOpacity>
            <VStack spacing={4} align="stretch" mt={4}>
              {section.items.map((item) => (
                <Box key={item.id}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={item.icon} color={item.color} />
                      <Text>{item.title}</Text>
                    </HStack>
                    <HStack>
                      <Text>
                        {item.type === SEC_ITEM_TYPES.TEST
                          ? ''
                          : `${item.duration} min`}
                      </Text>
                      {/* {item.description && (
                        <Icon
                          as={
                            openLessons[item.id] ? RxTriangleUp : RxTriangleDown
                          }
                          _hover={{ bg: 'gray.200', borderRadius: '50%' }}
                          _active={{ bg: 'gray.300', borderRadius: '50%' }}
                          cursor="pointer"
                          onClick={() => toggleLessonDescription(item.id)}
                        />
                      )} */}
                    </HStack>
                  </HStack>
                  {/* {item.description && (
                    <Collapse in={openLessons[item.id]} animateOpacity>
                      <Box pl={6} mt={2} maxWidth="90%">
                        <Text wordBreak="break-word" noOfLines={3}>
                          {item.description}
                        </Text>
                      </Box>
                    </Collapse>
                  )} */}
                </Box>
              ))}
            </VStack>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default Curriculum;
