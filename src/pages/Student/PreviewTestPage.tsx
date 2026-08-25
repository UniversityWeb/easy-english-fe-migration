import React from 'react';
import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';

const PreviewTestPage = ({ test, onStart }) => {
  return (
    <Box>
      <NavbarForStudent />

      <Box p={4}>
        {/* Test Title and Description */}
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            {test.title}
          </Text>
          <Text>{test.description}</Text>
          <Text fontSize="lg" color="gray.600">
            Course: {test.course.name}
          </Text>
          <Text fontSize="lg" color="gray.600">
            Duration: {test.durationInMilis / 60000} minutes
          </Text>
        </VStack>

        {/* Tabs showing each section of the test */}
        <Tabs variant="soft-rounded" mt="50px">
          <TabList>
            {test.sections.map((section) => (
              <Tab key={section.id}>{section.title}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {test.sections.map((section) => (
              <TabPanel key={section.id}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="xl" fontWeight="bold">
                    {section.title}
                  </Text>
                  <Text color="gray.600">Questions in this section:</Text>
                  {section.questions.map((question) => (
                    <Text key={question.id}>
                      {question.text} (Type: {question.type})
                    </Text>
                  ))}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Start Test Button */}
        <Button colorScheme="blue" size="lg" mt={6} onClick={onStart}>
          Start Test
        </Button>
      </Box>

      <Footer />
    </Box>
  );
};

export default PreviewTestPage;
