import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Pagination from '~/components/Student/Search/Page';
import topicService from '~/services/topicService';
import levelService from '~/services/levelService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const TopicAndLevelPage = () => {
  const [topics, setTopics] = useState([]);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [levelsByTopic, setLevelsByTopic] = useState({});
  const [levelCounts, setLevelCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);
  const [newTopic, setNewTopic] = useState({ name: '' });

  const {
    isOpen: isLevelModalOpen,
    onOpen: onOpenLevelModal,
    onClose: onCloseLevelModal,
  } = useDisclosure();
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [currentLevel, setCurrentLevel] = useState({ name: '' });
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      const data = await topicService.fetchAllTopic();
      if (data) {
        setTopics(data);
        setSearchResults(data);

        // Fetch level counts for all topics after fetching topics
        for (const topic of data) {
          const levels = await levelService.fetchAllLevelByTopic({
            topicId: topic.id,
          });
          setLevelCounts((prevCounts) => ({
            ...prevCounts,
            [topic.id]: levels.length, // Store the count of levels for each topic
          }));
        }
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const filteredTopics = topics.filter((topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(filteredTopics);
  }, [topics, searchTerm]);

  const toggleTopicExpand = async (topicId) => {
    if (expandedTopicId === topicId) {
      // Collapse the topic
      setExpandedTopicId(null);
    } else {
      // Expand and fetch levels for this topic
      if (!levelsByTopic[topicId]) {
        const levels = await levelService.fetchAllLevelByTopic({ topicId });
        if (levels) {
          setLevelsByTopic((prev) => ({ ...prev, [topicId]: levels }));
        }
      }
      setExpandedTopicId(topicId);
    }
  };

  const handleOpenModal = (topic = null) => {
    if (topic) {
      setIsEditing(true);
      setEditTopicId(topic.id);
      setNewTopic({ name: topic.name });
    } else {
      setIsEditing(false);
      setNewTopic({ name: '' });
    }
    onOpen();
  };

  const handleSaveTopic = async () => {
    if (isEditing) {
      await topicService.updateTopic(editTopicId, newTopic);
    } else {
      await topicService.createTopic(newTopic);
    }
    onClose();
    const updatedTopics = await topicService.fetchAllTopic();
    setTopics(updatedTopics || []);
  };

  const handleDeleteTopic = async (topicId) => {
    await topicService.deleteTopic(topicId);
    const updatedTopics = await topicService.fetchAllTopic();
    setTopics(updatedTopics || []);
  };

  const handleOpenLevelModal = (topicId, level = null) => {
    setSelectedTopicId(topicId);
    if (level) {
      setIsEditingLevel(true);
      setCurrentLevel(level);
    } else {
      setIsEditingLevel(false);
      setCurrentLevel({ name: '' });
    }
    onOpenLevelModal();
  };

  const handleSaveLevel = async () => {
    const newLevel = {
      ...currentLevel,
      description: 'Predefined description',
    };

    if (isEditingLevel) {
      await levelService.updateLevel(currentLevel.id, newLevel);
    } else {
      await levelService.createLevel({ ...newLevel, topicId: selectedTopicId });
    }

    onCloseLevelModal();
    const updatedLevels = await levelService.fetchAllLevelByTopic({
      topicId: selectedTopicId,
    });
    setLevelsByTopic((prev) => ({ ...prev, [selectedTopicId]: updatedLevels }));
  };

  const handleDeleteLevel = async (topicId, levelId) => {
    await levelService.deleteLevel(levelId);
    const updatedLevels = await levelService.fetchAllLevelByTopic({ topicId });
    setLevelsByTopic((prev) => ({ ...prev, [topicId]: updatedLevels }));
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const currentTopics = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <RoleBasedPageLayout>
      <Box p={5} mt={10}>
        <HStack justify="space-between" mb={4}>
          <Button colorScheme="green" onClick={() => handleOpenModal()}>
            Add Topic
          </Button>
          <HStack>
            <Input
              placeholder="Enter topic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="300px"
            />
          </HStack>
        </HStack>

        <Table variant="simple" mt={5}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>TOPICS</Th>
              <Th isNumeric>TOTAL LEVELS</Th>
              <Th>ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentTopics.length > 0 ? (
              currentTopics.map((topic) => (
                <React.Fragment key={topic.id}>
                  <Tr>
                    <Td>
                      <Checkbox />
                    </Td>
                    <Td>
                      <HStack
                        spacing={4}
                        onClick={() => toggleTopicExpand(topic.id)}
                        cursor="pointer"
                      >
                        <Text fontWeight="bold">{topic.name}</Text>
                        <IconButton
                          icon={
                            expandedTopicId === topic.id ? (
                              <ChevronUpIcon />
                            ) : (
                              <ChevronDownIcon />
                            )
                          }
                          variant="ghost"
                          size="sm"
                          aria-label="Expand/Collapse"
                        />
                      </HStack>
                    </Td>
                    <Td isNumeric>{levelCounts[topic.id] || 0}</Td>{' '}
                    {/* Correct level count */}
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          variant="ghost"
                          onClick={() => handleOpenModal(topic)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          variant="ghost"
                          onClick={() => handleDeleteTopic(topic.id)}
                        />
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenLevelModal(topic.id)}
                        >
                          Add Level
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td colSpan={4} p={0}>
                      <Collapse
                        in={expandedTopicId === topic.id}
                        animateOpacity
                      >
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Title</Th>
                              <Th>From</Th>
                              <Th>To</Th>
                              <Th>ACTIONS</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {levelsByTopic[topic.id]?.map((level) => (
                              <Tr key={level.id}>
                                <Td>{level.name}</Td>
                                <Td>{level.from || "Default"}</Td>
                                <Td>{level.to || "Default"}</Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<EditIcon />}
                                      variant="ghost"
                                      onClick={() =>
                                        handleOpenLevelModal(topic.id, level)
                                      }
                                    />
                                    <IconButton
                                      aria-label="Delete"
                                      icon={<DeleteIcon />}
                                      variant="ghost"
                                      onClick={() =>
                                        handleDeleteLevel(topic.id, level.id)
                                      }
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Collapse>
                    </Td>
                  </Tr>
                </React.Fragment>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  No topics found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditing ? 'Edit Topic' : 'Add Topic'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  value={newTopic.name}
                  onChange={(e) =>
                    setNewTopic((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveTopic}>
                {isEditing ? 'Save Changes' : 'Add Topic'}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isLevelModalOpen} onClose={onCloseLevelModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditingLevel ? 'Edit Level' : 'Add Level'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="levelName" isRequired>
                <FormLabel>Level Name</FormLabel>
                <Input
                  placeholder="Level Name"
                  value={currentLevel.name}
                  onChange={(e) =>
                    setCurrentLevel((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveLevel}>
                {isEditingLevel ? 'Save Changes' : 'Add Level'}
              </Button>
              <Button variant="ghost" onClick={onCloseLevelModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default TopicAndLevelPage;
