import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Icon,
  Input,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FiFileText, FiHelpCircle, FiVideo } from 'react-icons/fi';
import { LuPencil } from 'react-icons/lu';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import {
  RxDragHandleDots2,
  RxTriangleDown,
  RxTriangleUp,
} from 'react-icons/rx';
import { RiDeleteBinFill } from 'react-icons/ri';
import { PiPencilSimpleFill } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import TextLesson from '~/components/Teacher/CourseDetail/Curriculum/TextLesson';
import VideoLesson from '~/components/Teacher/CourseDetail/Curriculum/VideoLesson';
import AudioLesson from '~/components/Teacher/CourseDetail/Curriculum/AudioLesson';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';
import EditableTest from '~/components/Test/EditableTest';
import testService from '~/services/testService';
import { SEC_ITEM_TYPES } from '~/utils/constants';
import Writing from './Curriculum/Writing';
import writingService from '~/services/writingService';
import writingResultService from '~/services/writingResultService';

const getSectionItemIcon = (type) => {
  switch (type) {
    case SEC_ITEM_TYPES.TEXT:
      return { icon: FiFileText, color: 'green.500' };
    case SEC_ITEM_TYPES.VIDEO:
      return { icon: FiVideo, color: 'blue.500' };
    case SEC_ITEM_TYPES.AUDIO:
      return { icon: HiOutlineSpeakerWave, color: 'purple.500' };
    case SEC_ITEM_TYPES.TEST:
      return { icon: FiHelpCircle, color: 'orange.500' };
    default:
      return { icon: FiFileText, color: 'gray.500' };
  }
};

const Curriculum = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [showIcons, setShowIcons] = useState(null);
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [selectedSectionItemType, setSelectedSectionItemType] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [hoveredLessonId, setHoveredLessonId] = useState(null);
  const [hoveredWritingId, setHoveredWritingId] = useState(null);

  const [hoveredTestId, setHoveredTestId] = useState(null);
  const { successToast, errorToast } = useCustomToast();
  const [isNewTest, setIsNewTest] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: null, id: null });
  useEffect(() => {
    const isNewTest = !selectedTestId && selectedSectionId;
    setIsNewTest(isNewTest);
  }, [selectedTestId, selectedSectionId]);

  // Fetch sections and lessons from the API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionRequest = { courseId };
        const fetchedSections =
          await sectionService.fetchSectionsByCourse(sectionRequest);
        if (fetchedSections) {
          const sectionsWithLessons = await Promise.all(
            fetchedSections.map(async (section) => {
              const sectionId = section?.id;

              // Create requests for lessons and tests
              const lessonRequest = { sectionId: sectionId };
              const writingRequest = {
                sectionId: sectionId,
                pageNumber: 0,
                size: 9999,
              };
              // Fetch both lessons and tests concurrently
              const [lessons, tests, writings] = await Promise.all([
                lessonService.fetchLessons(lessonRequest),
                testService.getTestsBySection(sectionId),
                writingService.getWriting(writingRequest),
              ]);

              // Return the section object with lessons and tests included
              return {
                ...section,
                lessons: lessons || [],
                tests: tests || [],
                writings: writings || [],
              };
            }),
          );
          setSections(sectionsWithLessons);
        } else {
          errorToast('Failed to fetch sections');
        }
      } catch (error) {
        errorToast('Error fetching sections');
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [courseId, toast]);

  const handleLessonSaved = (savedLesson) => {
    console.log('save : ', savedLesson);

    // Cập nhật lại sections với lesson mới hoặc cập nhật lesson đã tồn tại
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === savedLesson.sectionId) {
          const updatedLessons = section.lessons.some(
            (lesson) => lesson.id === savedLesson.id,
          )
            ? section.lessons.map((lesson) =>
                lesson.id === savedLesson.id ? savedLesson : lesson,
              )
            : [...section.lessons, savedLesson];

          return { ...section, lessons: updatedLessons };
        }
        return section;
      }),
    );

    // Sau khi lesson được lưu, cập nhật lại state để hiển thị lesson đó như là lesson đã tồn tại (update lesson)
    setSelectedLessonId(savedLesson.id); // Cập nhật ID của lesson mới tạo hoặc vừa cập nhật
    setSelectedSectionItemType(savedLesson.type);
    setSelectedSectionId(savedLesson.sectionId);
  };

  const handleWritingSaved = (savedWriting) => {
    console.log('save : ', savedWriting);

    // Cập nhật lại sections với lesson mới hoặc cập nhật lesson đã tồn tại
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === savedWriting.sectionId) {
          const updatedWritings = section.writings.some(
            (lesson) => lesson.id === savedWriting.id,
          )
            ? section.writings.map((writings) =>
                writings.id === savedWriting.id ? savedWriting : writings,
              )
            : [...section.writings, savedWriting];

          return { ...section, writings: updatedWritings };
        }
        return section;
      }),
    );

    // Sau khi lesson được lưu, cập nhật lại state để hiển thị lesson đó như là lesson đã tồn tại (update lesson)
    setSelectedLessonId(savedWriting.id); // Cập nhật ID của lesson mới tạo hoặc vừa cập nhật
    setSelectedSectionItemType(SEC_ITEM_TYPES.WRITING);
    setSelectedSectionId(savedWriting.sectionId);
  };

  const handleSectionItemTypeClick = (sectionItemType) => {
    setSelectedSectionItemType(sectionItemType);
    setSelectedLessonId(null);
    setSelectedTestId(null);
    onClose();
  };

  const handleDeleteSection = async (id) => {
    try {
      await sectionService.deleteSection({ id });
      setSections(sections.filter((section) => section.id !== id));
      successToast('Section deleted');
    } catch (error) {
      errorToast('Error deleting section');
    }
  };

  const handleUpdateSection = async (sectionId, newTitle) => {
    try {
      const updatedSection = {
        id: sectionId,
        title: newTitle,
        courseId, // Ensure you send the courseId as well
      };

      // Call the update API
      const result = await sectionService.updateSection(updatedSection);

      if (result) {
        // Update the local state with the new title
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === sectionId
              ? { ...section, title: newTitle }
              : section,
          ),
        );
        successToast('Section updated');
      } else {
        errorToast('Failed to update section');
      }
    } catch (error) {
      errorToast('Error updating section');
    }
  };

  const handleAddNewSection = async () => {
    if (newSectionTitle.trim() !== '') {
      try {
        const newSection = {
          title: newSectionTitle,
          status: 'DISPLAY',
          courseId,
        };
        const createdSection = await sectionService.createSection(newSection);

        setSections([
          ...sections,
          {
            ...createdSection,
            lessons: [],
            tests: [],
            writings: [],
          },
        ]);

        setNewSectionTitle('');
        setIsAddingNewSection(false);
        successToast('Section added');
      } catch (error) {
        errorToast('Error adding section');
      }
    } else {
      errorToast('Section title cannot be empty');
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedSectionItemType(lesson?.type);
    setSelectedLessonId(lesson.id);
    setSelectedSectionId(lesson.sectionId);
  };

  const handleWritingClick = (writing) => {
    setSelectedSectionItemType(SEC_ITEM_TYPES.WRITING);
    setSelectedLessonId(writing.id);
    setSelectedSectionId(writing.sectionId);
  };

  const renderLessonComponent = () => {
    const isNewLesson = Boolean(!selectedLessonId && selectedSectionId);
    switch (selectedSectionItemType) {
      case SEC_ITEM_TYPES.TEXT:
        return (
          <TextLesson
            key={`${selectedSectionId}-${selectedLessonId}`}
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case SEC_ITEM_TYPES.VIDEO:
        return (
          <VideoLesson
            key={`${selectedSectionId}-${selectedLessonId}`}
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case SEC_ITEM_TYPES.AUDIO:
        return (
          <AudioLesson
            key={`${selectedSectionId}-${selectedLessonId}`}
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case SEC_ITEM_TYPES.TEST:
        return (
          <EditableTest
            courseId={courseId}
            testId={selectedTestId}
            sectionId={selectedSectionId}
            ordinalNumber={1}
            isNew={isNewTest}
            onTestSaved={handleTestSaved}
          />
        );
      case SEC_ITEM_TYPES.WRITING:
        return (
          <Writing
            //courseId={courseId}
            //testId={selectedTestId}
            sectionId={selectedSectionId}
            // ordinalNumber={1}
            isNew={isNewLesson}
            id={selectedLessonId}
            handleWritingSaved
            onWritingSaved={handleWritingSaved}
          />
        );
      default:
        return <Text fontSize="xl">Please select a lesson type.</Text>;
    }
  };

  if (loading) {
    return (
      <HStack justify="center" align="center" h="full">
        <Spinner size="xl" />
      </HStack>
    );
  }

  const handleTestSaved = async (savedTest) => {
    console.log('Saved test : ', savedTest);
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === savedTest.sectionId) {
          const updatedTests = section.tests.some(
            (test) => test.id === savedTest.id,
          )
            ? section.tests.map((test) =>
                test.id === savedTest.id ? savedTest : test,
              )
            : [...section.tests, savedTest];

          return { ...section, tests: updatedTests };
        }
        return section;
      }),
    );

    await handleTestClick(savedTest);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const lessonRequest = { id: lessonId };
      await lessonService.deleteLesson(lessonRequest);

      // Update sections to remove the deleted lesson
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        })),
      );

      // Reset selected lesson state
      setSelectedLessonId(null);
      setSelectedSectionItemType(null);
      setSelectedSectionId(null);

      successToast('Lesson deleted');
    } catch (error) {
      errorToast('Error deleting lesson');
    }
  };

  const handleTestClick = async (test) => {
    setSelectedSectionItemType(SEC_ITEM_TYPES.TEST);
    setSelectedTestId(test?.id);
    setSelectedSectionId(test.sectionId);
  };

  const handleDeleteTest = async (testId) => {
    try {
      await testService.remove(testId);
      setSections((prevTests) =>
        prevTests.map((section) => ({
          ...section,
          tests: section.tests.filter((test) => test.id !== testId),
        })),
      );
      setSelectedLessonId(null);
      setSelectedSectionItemType(null);
      setSelectedSectionId(null);
      successToast('Test deleted');
    } catch (error) {
      errorToast('Error deleting test');
    }
  };

  const handleDeleteWriting = async (writingId) => {
    try {
      await writingService.deleteWriting(writingId);

      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          writings: section.writings.filter(
            (writing) => writing.id !== writingId,
          ),
        })),
      );

      if (
        selectedLessonId === writingId &&
        selectedSectionItemType === SEC_ITEM_TYPES.WRITING
      ) {
        setSelectedLessonId(null);
        setSelectedSectionItemType(null);
        setSelectedSectionId(null);
      }

      successToast('Writing deleted');
    } catch (error) {
      errorToast('Error deleting writing');
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete.type === 'section') {
      handleDeleteSection(itemToDelete.id);
    } else if (itemToDelete.type === 'lesson') {
      handleDeleteLesson(itemToDelete.id);
    } else if (itemToDelete.type === 'test') {
      handleDeleteTest(itemToDelete.id);
    } else if (itemToDelete.type === 'writing') {
      handleDeleteWriting(itemToDelete.id);
    }
    setIsConfirmOpen(false);
  };

  const promptDelete = (type, id) => {
    setItemToDelete({ type, id });
    setIsConfirmOpen(true);
  };

  const DeleteConfirmationModal = () => (
    <Modal
      isOpen={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold" color="red.600">
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          <Text fontSize="md" color="gray.700" mb={4}>
            Are you sure you want to delete this {itemToDelete.type}?
          </Text>
          <HStack spacing={4} justify="flex-end" mb={2}>
            <Button colorScheme="red" onClick={handleConfirmDelete} size="md">
              Delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmOpen(false)}
              size="md"
            >
              Cancel
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <HStack spacing={5} align="start" h="full">
      <Box
        w="30%"
        bg="gray.100"
        p={5}
        rounded="md"
        display="flex"
        flexDirection="column"
        h="100%"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Curriculum
        </Text>
        <Box flex="1" overflowY="auto" pr={2}>
          <Accordion allowMultiple>
            {sections.map((section) => (
              <AccordionItem key={section.id}>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton
                        _hover={{ bg: 'gray.200' }}
                        onMouseEnter={() => setShowIcons(section.id)}
                        onMouseLeave={() => setShowIcons(null)}
                      >
                        <Icon
                          as={RxDragHandleDots2}
                          color="gray.500"
                          marginRight="10px"
                        />

                        <Box
                          flex="1"
                          textAlign="left"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          {editingSectionId === section.id ? (
                            <Input
                              value={section.title}
                              onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                              onChange={(e) =>
                                setSections((prevState) =>
                                  prevState.map((s) =>
                                    s.id === section.id
                                      ? { ...s, title: e.target.value }
                                      : s,
                                  ),
                                )
                              }
                              onBlur={async () => {
                                await handleUpdateSection(
                                  section.id,
                                  section.title,
                                );
                                setEditingSectionId(null);
                              }}
                              onKeyDown={async (e) => {
                                e.stopPropagation(); // Prevent accordion toggle on keydown
                                if (e.key === 'Enter') {
                                  await handleUpdateSection(
                                    section.id,
                                    section.title,
                                  );
                                  setEditingSectionId(null);
                                }
                              }}
                              autoFocus
                              size="sm"
                              width="auto"
                            />
                          ) : (
                            section.title
                          )}

                          {showIcons === section.id && (
                            <Icon
                              as={PiPencilSimpleFill}
                              color="gray.500"
                              marginLeft="10px"
                              onClick={() => setEditingSectionId(section.id)}
                              cursor="pointer"
                            />
                          )}
                        </Box>

                        {showIcons === section.id && (
                          <Box marginRight="10px">
                            <Icon
                              as={RiDeleteBinFill}
                              color="gray.500"
                              cursor="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                promptDelete('section', section.id);
                              }}
                            />
                          </Box>
                        )}

                        {isExpanded ? <RxTriangleUp /> : <RxTriangleDown />}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        {/* lessons */}
                        {section.lessons.map((lesson) => {
                          const { icon, color } = getSectionItemIcon(
                            lesson?.type,
                          );
                          return (
                            <ListItem
                              onClick={() =>
                                handleLessonClick({
                                  ...lesson,
                                  sectionId: section.id,
                                })
                              }
                              key={lesson.id}
                              cursor="pointer"
                              onMouseEnter={() => setHoveredLessonId(lesson.id)}
                              onMouseLeave={() => setHoveredLessonId(null)}
                            >
                              <HStack justify="space-between">
                                <HStack>
                                  <ListIcon
                                    as={RxDragHandleDots2}
                                    color="gray.500"
                                  />
                                  <ListIcon as={icon} color={color} />
                                  <Text noOfLines={1}>{lesson.title}</Text>
                                </HStack>
                                {hoveredLessonId === lesson.id && (
                                  <Icon
                                    as={RiDeleteBinFill}
                                    color="gray.500"
                                    cursor="pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      promptDelete('lesson', lesson.id);
                                    }}
                                  />
                                )}
                              </HStack>
                            </ListItem>
                          );
                        })}
                        {section.writings.map((writing) => {
                          const { icon, color } = getSectionItemIcon(
                            writing?.type,
                          );
                          return (
                            <ListItem
                              onClick={() =>
                                handleWritingClick({
                                  ...writing,
                                  sectionId: section.id,
                                })
                              }
                              key={writing.id}
                              cursor="pointer"
                              onMouseEnter={() =>
                                setHoveredWritingId(writing.id)
                              }
                              onMouseLeave={() => setHoveredWritingId(null)}
                            >
                              <HStack justify="space-between">
                                <HStack>
                                  <ListIcon
                                    as={RxDragHandleDots2}
                                    color="gray.500"
                                  />
                                  <ListIcon as={LuPencil} color={color} />
                                  <Text noOfLines={1}>{writing.title}</Text>
                                </HStack>
                                {hoveredWritingId === writing.id && (
                                  <Icon
                                    as={RiDeleteBinFill}
                                    color="gray.500"
                                    cursor="pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      promptDelete('writing', writing.id);
                                    }}
                                  />
                                )}
                              </HStack>
                            </ListItem>
                          );
                        })}
                        {/* tests */}
                        {section.tests.map((test) => {
                          const { icon, color } = getSectionItemIcon(
                            SEC_ITEM_TYPES.TEST,
                          );
                          return (
                            <ListItem
                              onClick={() =>
                                handleTestClick({
                                  ...test,
                                  sectionId: section.id,
                                })
                              }
                              key={test.id}
                              cursor="pointer"
                              onMouseEnter={() => setHoveredTestId(test.id)}
                              onMouseLeave={() => setHoveredTestId(null)}
                            >
                              <HStack justify="space-between">
                                <HStack>
                                  <ListIcon
                                    as={RxDragHandleDots2}
                                    color="gray.500"
                                  />
                                  <ListIcon as={icon} color={color} />
                                  <Text noOfLines={1}>{test.title}</Text>
                                </HStack>
                                {hoveredTestId === test.id && (
                                  <Icon
                                    as={RiDeleteBinFill}
                                    color="gray.500"
                                    cursor="pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      promptDelete('test', test.id);
                                    }}
                                  />
                                )}
                              </HStack>
                            </ListItem>
                          );
                        })}
                      </List>

                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        mt={4}
                        onClick={() => {
                          onOpen();
                          setSelectedSectionId(section.id);
                        }}
                      >
                        Add a lesson
                      </Button>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
        {isAddingNewSection ? (
          <VStack mt={4} spacing={3}>
            <Input
              placeholder="Enter new section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewSection();
                }
              }}
              autoFocus
            />
            <HStack>
              <Button colorScheme="blue" onClick={handleAddNewSection}>
                Add Section
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNewSection(false);
                  setNewSectionTitle('');
                }}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            mt={4}
            onClick={() => setIsAddingNewSection(true)}
          >
            New Section
          </Button>
        )}
      </Box>

      <Box w="70%" textAlign="center" h="100%" overflow="auto">
        {selectedSectionItemType ? (
          renderLessonComponent()
        ) : (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Let's build your course!
            </Text>
            <Text fontSize="md" color="gray.500">
              Get started by creating the lessons from scratch in the column on
              the left or import your Educational content.
            </Text>
          </Box>
        )}
      </Box>

      {/* Add options */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="700px" height="500px" p={5}>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Select lesson type
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Learning Content
              </Text>
              <SimpleGrid columns={4} spacing={4}>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionItemTypeClick(SEC_ITEM_TYPES.TEXT)
                  }
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiFileText} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Text lesson
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionItemTypeClick(SEC_ITEM_TYPES.VIDEO)
                  }
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiVideo} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Video lesson
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionItemTypeClick(SEC_ITEM_TYPES.AUDIO)
                  }
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={HiOutlineSpeakerWave}
                    w={8}
                    h={8}
                    color="blue.500"
                  />
                  <Text mt={2} fontSize="sm">
                    Audio lesson
                  </Text>
                </Button>
              </SimpleGrid>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Exam Students
              </Text>
              <SimpleGrid columns={4} spacing={4}>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionItemTypeClick(SEC_ITEM_TYPES.TEST)
                  }
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiHelpCircle} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Test
                  </Text>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionItemTypeClick(SEC_ITEM_TYPES.WRITING)
                  }
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={LuPencil} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Writing
                  </Text>
                </Button>
              </SimpleGrid>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <DeleteConfirmationModal />
    </HStack>
  );
};

export default Curriculum;
