import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Pagination from '~/components/Student/Search/Page'; // Import the Pagination component
import categoryService from '~/services/categoryService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout'; // Import the category service

// Hardcoded details for categories (to be used in API response)
const defaultCategoryDetails = {
  description: 'Category detail',
  courses: 10,
  earnings: '$1000',
  image: 'http://10.147.20.214:9000/easy-english/image/course2.jpg',
};

const CategoryPage = () => {
  // State for categories
  const [categories, setCategories] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Default items per page

  // State for search input and search result
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // State for modal (add/update categories)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryData, setCategoryData] = useState({
    id: null,
    name: '',
    description: '',
  });

  // Fetch categories from the API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await categoryService.fetchAllCategory();
      if (fetchedCategories) {
        const enrichedCategories = fetchedCategories.map((category) => ({
          ...category,
        }));
        setCategories(enrichedCategories);
        setSearchResults(enrichedCategories); // Initialize search results
      }
    };

    fetchCategories();
  }, []);

  // Handle search logic
  const handleSearch = () => {
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(filteredCategories);
    setCurrentPage(1); // Reset to first page after search
  };

  // Handle Add/Edit CategoryPage
  const handleAddCategory = async () => {
    if (isEditMode) {
      // Update category
      const updatedCategory = await categoryService.updateCategory(
        categoryData.id,
        categoryData,
      );
      if (updatedCategory) {
        const updatedCategories = categories.map((cat) =>
          cat.id === categoryData.id
            ? { ...updatedCategory, ...defaultCategoryDetails }
            : cat,
        );
        setCategories(updatedCategories);
        setSearchResults(updatedCategories); // Update search results
      }
    } else {
      // Add new category
      const newCategory = await categoryService.createCategory(categoryData);
      if (newCategory) {
        const newCategories = [
          ...categories,
          { ...newCategory, ...defaultCategoryDetails },
        ];
        setCategories(newCategories);
        setSearchResults(newCategories); // Update search results
      }
    }
    onClose();
    resetCategoryData();
  };

  // Handle Edit Button Click
  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setCategoryData(category);
    onOpen();
  };

  // Handle Delete CategoryPage
  const handleDeleteCategory = async (categoryId) => {
    const success = await categoryService.deleteCategory(categoryId);
    if (success) {
      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId,
      );
      setCategories(updatedCategories);
      setSearchResults(updatedCategories); // Update search results
    }
  };

  // Reset category data
  const resetCategoryData = () => {
    setCategoryData({
      id: null,
      name: '',
      description: '',
    });
    setIsEditMode(false);
  };

  // Calculate total pages based on search results
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // Determine the categories to display on the current page
  const currentCategories = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <RoleBasedPageLayout>
      <Box p={5} mt={10}>
        {/* Header: Add CategoryPage Button (left) and Search Bar (right) */}
        <HStack justify="space-between" mb={4}>
          <Button
            colorScheme="blue"
            onClick={() => {
              resetCategoryData();
              onOpen();
            }}
          >
            Add Category
          </Button>
          <HStack>
            <Input
              placeholder="Enter category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="300px"
            />
            <Button colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
          </HStack>
        </HStack>

        {/* CategoryPage table */}
        <Table variant="simple" mt={5}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>CATEGORIES</Th>
              <Th isNumeric>TOTAL COURSES</Th>
              <Th isNumeric>TOTAL EARNINGS</Th>
              <Th>ACTIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentCategories && currentCategories.length > 0 ? (
              currentCategories.map((category) => (
                <Tr key={category.id}>
                  <Td>
                    <Checkbox />
                  </Td>
                  <Td>
                    <HStack spacing={4}>
                      <Box>
                        <Text fontWeight="bold">{category.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {category.description}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td isNumeric>{category.courses}</Td>
                  <Td isNumeric>{category.earnings}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        onClick={() => handleEditCategory(category)}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteCategory(category.id)}
                        variant="ghost"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No categories found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
        />

        {/* Modal for Adding/Editing CategoryPage */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditMode ? 'Edit CategoryPage' : 'Add CategoryPage'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="categoryName" isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input
                  placeholder="Category Name"
                  value={categoryData.name}
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="categoryDescription" mt={4}>
                <FormLabel>Category Description</FormLabel>
                <Input
                  placeholder="Category Description"
                  value={categoryData.description}
                  onChange={(e) =>
                    setCategoryData({
                      ...categoryData,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddCategory}>
                {isEditMode ? 'Update CategoryPage' : 'Add CategoryPage'}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CategoryPage;
