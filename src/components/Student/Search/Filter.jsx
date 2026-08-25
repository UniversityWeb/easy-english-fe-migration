import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  ChakraProvider,
  Checkbox,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, StarIcon } from '@chakra-ui/icons';
import topicService from '~/services/topicService';
import categoryService from '~/services/categoryService';
import levelService from '~/services/levelService';

const FilterSection = ({ title, children, isOpen }) => (
  <Accordion allowToggle defaultIndex={isOpen ? [0] : []}>
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                {title}
              </Box>
              <IconButton
                icon={isExpanded ? <MinusIcon /> : <AddIcon />}
                size="xs"
                variant="ghost"
                aria-label="Toggle"
              />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{children}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  </Accordion>
);

const RatingFilter = ({ selectedRating, setSelectedRating }) => {
  const ratings = [4.5, 4.0, 3.5, 3.0];

  return (
    <RadioGroup
      value={selectedRating?.toString()}
      onChange={(value) => setSelectedRating(parseFloat(value))}
    >
      <VStack align="start">
        {ratings.map((rating) => (
          <HStack key={rating} spacing={2} alignItems="center">
            <Radio value={rating.toString()}>
              <HStack spacing={1}>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < Math.floor(rating) ? 'yellow.400' : 'gray.300'}
                    />
                  ))}
                <Text>{rating} & up</Text>
              </HStack>
            </Radio>
          </HStack>
        ))}
      </VStack>
    </RadioGroup>
  );
};

const Filter = ({ onFilterChange }) => {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const fetchData = useCallback(async () => {
    const topicsData = await topicService.fetchAllTopic();
    setTopics(topicsData || []);

    const categoriesData = await categoryService.fetchAllCategory();
    setCategories(categoriesData || []);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleTopicChange = async (topicId) => {
    setSelectedTopic(topicId);
    setSelectedLevel(null); // Reset selected level mỗi khi đổi topic
    const levelsData = await levelService.fetchAllLevelByTopic({ topicId });
    setLevels(levelsData || []);
  };

  const handleLevelChange = (levelId) => {
    setSelectedLevel(levelId);
  };

  useEffect(() => {
    onFilterChange({
      categoryIds: selectedCategories,
      topicId: selectedTopic,
      levelId: selectedLevel,
      rating: selectedRating,
    });
  }, [onFilterChange, selectedCategories, selectedLevel, selectedRating, selectedTopic]);

  return (
    <ChakraProvider>
      <Box
        style={{ zoom: 0.9 }}
        p={4}
        w="300px"
        borderWidth="1px"
        borderRadius="lg"
      >
        <FilterSection title="Topic" isOpen={true}>
          <RadioGroup
            value={selectedTopic?.toString()}
            onChange={(value) => handleTopicChange(value)}
          >
            <VStack align="start">
              {topics.map((topic) => (
                <Radio key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        </FilterSection>

        <FilterSection title="CategoryPage" isOpen={true}>
          <VStack align="start">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                isChecked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Checkbox>
            ))}
          </VStack>
        </FilterSection>

        <FilterSection title="Level" isOpen={true}>
          {levels.length > 0 ? (
            <RadioGroup
              value={selectedLevel?.toString() || ''}
              onChange={(value) => handleLevelChange(value)}
            >
              <VStack align="start">
                {levels.map((level) => (
                  <Radio key={level.id} value={level.id.toString()}>
                    {level.name}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          ) : (
            <Text>No levels available</Text> // Hiển thị khi không có level
          )}
        </FilterSection>

        <FilterSection title="Rating" isOpen={true}>
          <RatingFilter
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        </FilterSection>
      </Box>
    </ChakraProvider>
  );
};

export default Filter;

