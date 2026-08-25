import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

const NotFound = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      bg="white"
    >
      <VStack spacing={6} textAlign="center">
        <Heading
          as="h1"
          size="4xl"
          color="cyan.600"
        >404</Heading>
        <Text fontSize="lg" fontWeight="bold" color="cyan.500">
          Page Not Found
        </Text>
        <Text color="cyan.500" fontSize="lg">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Link to="/">
          <Button
            colorScheme="cyan"
            bg="cyan.400"
            _hover={{ bg: "cyan.500" }}
            color="white"
            variant="solid"
            size="lg"
          >
            Go Back to Home
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default NotFound;
