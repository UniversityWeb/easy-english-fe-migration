import { Controller, useFormContext } from 'react-hook-form';
import { memo, useState, useEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Button,
  Image,
  Text,
  Flex,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const SelectCourseField = ({
  control,
  fieldName,
  label = 'SELECT COURSE',
  visible = true,
  disable = false,
  courses = [],
  maxCourses = 5,
  className = 'col-xs-12 col-sm-12 col-md-3 col-lg-2',
}) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext();
  const [search, setSearch] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const initialCourseIds = control._formValues[fieldName] || [];

    const initialCourses = courses.filter((course) =>
      initialCourseIds.includes(course.id),
    );
    console.log('initialCourses', initialCourses);

    setSelectedCourses(initialCourses);
  }, [control, fieldName, courses]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      !selectedCourses.some((selected) => selected.id === course.id),
  );

  useEffect(() => {
    setValue(
      fieldName,
      selectedCourses.map((course) => course.id),
    );

    const total = selectedCourses.reduce(
      (sum, course) => sum + (course.price.price || 0),
      0,
    );
    setTotalPrice(total);
  }, [selectedCourses, fieldName, setValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleAddCourse = (course) => {
    if (selectedCourses.length < maxCourses) {
      setSelectedCourses([...selectedCourses, course]);
      setSearch('');
      setShowDropdown(false);
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(
      selectedCourses.filter((course) => course.id !== courseId),
    );
  };

  if (!visible) return null;

  return (
    <Box className={className} ref={dropdownRef}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <FormControl
            isInvalid={errors && errors[fieldName]}
            isDisabled={disable}
          >
            <FormLabel htmlFor={fieldName}>{label}</FormLabel>

            <Flex>
              <Input
                id={fieldName}
                placeholder="Select course"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onClick={() => setShowDropdown(true)}
              />
              <Button
                ml={2}
                colorScheme="blue"
                onClick={() => setShowDropdown(true)}
                isDisabled={selectedCourses.length >= maxCourses}
              >
                + ADD COURSE
              </Button>
            </Flex>

            {showDropdown && filteredCourses.length > 0 && (
              <Box
                borderWidth="1px"
                borderRadius="md"
                mt={2}
                maxH="200px"
                overflowY="auto"
                position="absolute"
                width="calc(100% - 140px)"
                bg="white"
                zIndex={10}
                boxShadow="md"
                p={2}
              >
                <SimpleGrid columns={2} spacing={2}>
                  {filteredCourses.map((course) => (
                    <Box
                      key={course.id}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                      onClick={() => handleAddCourse(course)}
                    >
                      <Flex align="center">
                        <Image
                          src={course.imagePreview}
                          boxSize="40px"
                          mr={3}
                        />
                        <Box>
                          <Text fontWeight="bold">{course.title}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {course.price.price}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {errors && errors[fieldName] && (
              <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
            )}

            <Box mt={4}>
              <Text mb={2}>Maximum courses in bundle: {maxCourses}</Text>

              {selectedCourses.length > 0 && (
                <Box>
                  <SimpleGrid columns={2} spacing={4}>
                    {selectedCourses.map((course) => (
                      <Flex
                        key={course.id}
                        borderWidth="1px"
                        borderRadius="md"
                        p={3}
                        align="center"
                        justify="space-between"
                      >
                        <Flex align="center">
                          <Image
                            src={course.imagePreview}
                            boxSize="40px"
                            mr={3}
                          />
                          <Box>
                            <Text fontWeight="bold">{course.title}</Text>
                            <Text>{course.price.price}</Text>
                          </Box>
                        </Flex>
                        <IconButton
                          aria-label="Remove course"
                          icon={<CloseIcon size={16} />}
                          size="sm"
                          onClick={() => handleRemoveCourse(course.id)}
                        />
                      </Flex>
                    ))}
                  </SimpleGrid>

                  <Flex mt={4} fontWeight="bold">
                    <Text>
                      Total{' '}
                      {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : '$0'}
                    </Text>
                  </Flex>
                </Box>
              )}
            </Box>
          </FormControl>
        )}
      />
    </Box>
  );
};

export default memo(SelectCourseField);
