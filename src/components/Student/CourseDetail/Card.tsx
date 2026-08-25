import React, { useState } from 'react';
import { Box, Button, ChakraProvider, Divider, Flex, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuChartBar, LuEye } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import { PiStudent } from 'react-icons/pi';

const courses = [
    {
        id: 1,
        image: "https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg",
        category: "Communication",
        title: "Basics of Masterstudy? Tutorial go to Pro",
        rating: 5,
        price: "Free",
        students: 1200,  // Number of students
        views: 1500,     // Number of views
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-3.jpg",
        category: "Electronic",
        title: "How to be a DJ? Make Electronic Music",
        rating: 3,
        price: "$49.99",
        students: 900,
        views: 1000,
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-2.jpg",
        category: "Communication",
        title: "Minimalism, How to make things simpler",
        rating: 4,
        price: "Free",
        students: 700,
        views: 800,
    },
    {
        id: 4,
        image: "https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-2.jpg",
        category: "Communication",
        title: "Minimalism, How to make things simpler",
        rating: 1,
        price: "Free",
        students: 450,
        views: 600,
    },
];

// Rating component to display stars based on rating value
const Rating = ({ rating }) => {
    return (
        <HStack spacing="1">
            {Array(5)
                .fill("")
                .map((_, i) => (
                    <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
                ))}
            <Text fontSize="sm" ml="2">
                {rating}
            </Text>
        </HStack>
    );
};

const Search = () => {
    const [likedCourses, setLikedCourses] = useState(courses.map(course => ({ id: course.id, liked: false })));
    const [hoveredCourseId, setHoveredCourseId] = useState(null); // Track the currently hovered course

    const toggleWishlist = (id) => {
        setLikedCourses((prev) =>
            prev.map((course) =>
                course.id === id ? { ...course, liked: !course.liked } : course
            )
        );
    };

    return (

        <ChakraProvider>
            <Box p={5} >
                <HStack spacing={5} wrap="wrap" justify="center" width="1300px">
                    {courses.map((course) => {
                        const isLiked = likedCourses.find((c) => c.id === course.id)?.liked;

                        return (
                            <Box
                                key={course.id}
                                width="300px"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="md"
                                height="420px"
                                position="relative"
                                onMouseEnter={() => setHoveredCourseId(course.id)} // Set hovered course ID
                                onMouseLeave={() => setHoveredCourseId(null)} // Reset hovered course ID
                            >
                                {/* Course Image */}
                                <Box height="200px" overflow="hidden">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        objectFit="cover"
                                        width="100%"
                                        height="100%"
                                    />
                                </Box>

                                <Box p={6}>
                                    <VStack align="start" spacing={2}>
                                        {/* CategoryPage */}
                                        <Text fontSize="sm" color="gray.500">
                                            {course.category}
                                        </Text>

                                        {/* Title */}
                                        <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                                            {course.title}
                                        </Text>

                                        {/* Students and Views */}
                                        <Flex justify="space-between" align="center" width="100%" marginTop="5px" marginBottom="5px">
                                            <HStack spacing="1">
                                                <Icon as={PiStudent} boxSize={5} color="gray.600" />
                                                <Text fontSize="sm" fontWeight="medium" color="gray.500"> {/* Lighter color */}
                                                    {course.students} Students
                                                </Text>
                                            </HStack>
                                            <HStack spacing="1">
                                                <Icon as={LuEye} boxSize={5} color="gray.600" />
                                                <Text fontSize="sm" fontWeight="medium" color="gray.500"> {/* Lighter color */}
                                                    {course.views} Views
                                                </Text>
                                            </HStack>
                                        </Flex>

                                        <Divider borderColor="gray.300" />

                                        {/* Rating and Price */}
                                        <Flex justify="space-between" align="center" width="100%" marginTop="10px">
                                            <Rating rating={course.rating} />
                                            <Text
                                                fontWeight="bold"
                                                fontSize="lg"
                                                color="gray.700"
                                                _hover={{ color: "blue.500" }} // Change color on hover
                                            >
                                                {course.price}
                                            </Text>
                                        </Flex>

                                        {/* Hover Box for details */}
                                        {hoveredCourseId === course.id && ( // Only show details if this course is hovered
                                            <Box
                                                position="absolute"
                                                top="0"
                                                left="0"
                                                width="100%"
                                                height="100%"
                                                bg="white"
                                                p="6"
                                                borderRadius="lg"
                                                boxShadow="md"
                                                zIndex="10"
                                            >
                                                {/* Teacher */}
                                                <Text fontSize="sm" fontWeight="bold" mb="2">
                                                    Demo Instructor
                                                </Text>

                                                {/* Course Title */}
                                                <Text fontWeight="bold" fontSize="lg" mb="3">
                                                    {course.title}
                                                </Text>

                                                {/* Rating */}
                                                <Rating rating={course.rating} />

                                                {/* Course description placeholder */}
                                                <Text fontSize="sm" mt="3" noOfLines={3}>
                                                    You can live a healthy, calm, and relaxing minimalist lifestyle. Imagine everything in your home is clean, beautiful, and devoid of clutter.
                                                </Text>

                                                {/* Other course details */}
                                                <Flex mt="6" alignItems="center" justify="space-between">
                                                    <HStack spacing="1">
                                                        <Icon as={LuChartBar} boxSize={5} color="gray.600" />
                                                        <Text fontSize="sm">Beginner</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <Icon as={IoBookOutline} boxSize={5} color="gray.600" />
                                                        <Text fontSize="sm">9 Lectures</Text>
                                                    </HStack>
                                                    <HStack spacing="1">
                                                        <Icon as={TbClockHour4} boxSize={5} color="gray.600" />
                                                        <Text fontSize="sm">5 hours</Text>
                                                    </HStack>
                                                </Flex>

                                                {/* Preview Button */}
                                                <Button
                                                    mt="7"
                                                    colorScheme="blue"
                                                    size="sm"
                                                    width="full"
                                                    onClick={() => console.log("Preview this course")}
                                                >
                                                    PREVIEW THIS COURSE
                                                </Button>

                                                {/* Remove from Wishlist / Add to Wishlist */}
                                                <Flex mt="5" justify="space-between">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme={isLiked ? "red" : "gray"}
                                                        onClick={() => toggleWishlist(course.id)}
                                                        leftIcon={
                                                            <Icon as={FaHeart} color={isLiked ? "red.500" : "gray.500"} />
                                                        }
                                                    >
                                                        {isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                                                    </Button>
                                                    <Text
                                                        fontWeight="bold"
                                                        color="gray.700"
                                                    >
                                                        {course.price}
                                                    </Text>
                                                </Flex>
                                            </Box>
                                        )}
                                    </VStack>
                                </Box>
                            </Box>
                        );
                    })}
                </HStack>
            </Box>

        </ChakraProvider>
    );
};

export default Search;
