import React from 'react';
import { Box, Center, Fade, Spinner, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

const LoaderPage = () => {
  const fontSize = useBreakpointValue({ base: 'lg', md: '2xl' });

  return (
    <Center height="100vh" flexDirection="column" borderRadius="md" boxShadow="lg">
      <VStack spacing={4}>
        <Fade in={true}>
          <Box position="relative" display="inline-block">
            <Spinner size="xl" color="cyan.600" speed="0.8s" thickness="10px" />
          </Box>
        </Fade>
        <Text
          fontSize={fontSize}
          fontWeight="semibold"
          color="cyan.600"
          textAlign="center"
          animation="pulse 2s infinite"
        >
          Please Wait...
        </Text>
      </VStack>
    </Center>
  );
};

export default LoaderPage;
