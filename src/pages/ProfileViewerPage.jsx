import React from 'react';
import {
  Avatar,
  Box,
  Button,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';

const userInfo = {
  username: "john",
  fullName: "john",
  email: "john@gmail.com",
  phoneNumber: "+84972640891",
  bio: "A student.",
  gender: "MALE",
  dob: "2024-08-05",
  role: "ADMIN",
  createdAt: "2024-08-05T13:47:06.794Z",
  avatarPath: "string", // Use this for the avatar image URL
};

function ProfileViewer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Box p={10}>
        <Flex
          bg="white"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          maxW="900px"
          mx="auto"
        >
          {/* Left Sidebar */}
          <Box
            flex="1"
            bg="gray.50"
            p={6}
            textAlign="center"
            position="relative"
          >
            <Box position="relative" w="150px" h="150px" mx="auto">
              <Tooltip label="Click to preview avatar" aria-label="Avatar tooltip">
                <Avatar
                  size="full"
                  name={userInfo.fullName}
                  src={
                    userInfo.avatarPath !== "string"
                      ? userInfo.avatarPath
                      : "https://via.placeholder.com/150"
                  }
                  cursor="pointer"
                  onClick={onOpen}
                />
              </Tooltip>
              <IconButton
                icon={<ViewIcon />}
                position="absolute"
                bottom="0"
                right="0"
                borderRadius="full"
                colorScheme="purple"
                onClick={onOpen}
                aria-label="View Avatar"
              />
            </Box>

            {/* Display information from userInfo */}
            <Heading size="md" mt={4}>
              {userInfo.fullName}
            </Heading>
            <Text color="gray.500">{userInfo.email}</Text>
            <Text color="gray.500" mb={4}>
              {userInfo.phoneNumber}
            </Text>
          </Box>

          {/* Right Form Section */}
          <Box flex="2" p={8}>
            <Heading size="md" mb={6}>
              Profile Information
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Username */}
              <GridItem colSpan={2}>
                <VStack align="start">
                  <Text fontWeight="bold">Username:</Text>
                  <Text>{userInfo.username}</Text>
                </VStack>
              </GridItem>

              {/* Full Name */}
              <GridItem>
                <VStack align="start">
                  <Text fontWeight="bold">Full Name:</Text>
                  <Text>{userInfo.fullName}</Text>
                </VStack>
              </GridItem>

              {/* Email */}
              <GridItem>
                <VStack align="start">
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{userInfo.email}</Text>
                </VStack>
              </GridItem>

              {/* Phone Number */}
              <GridItem>
                <VStack align="start">
                  <Text fontWeight="bold">Phone Number:</Text>
                  <Text>{userInfo.phoneNumber}</Text>
                </VStack>
              </GridItem>

              {/* Date of Birth */}
              <GridItem>
                <VStack align="start">
                  <Text fontWeight="bold">Date of Birth:</Text>
                  <Text>{dayjs(userInfo.dob).format("YYYY-MM-DD")}</Text>
                </VStack>
              </GridItem>

              {/* Role */}
              <GridItem>
                <VStack align="start">
                  <Text fontWeight="bold">Role:</Text>
                  <Text>{userInfo.role}</Text>
                </VStack>
              </GridItem>

              {/* Created At */}
              <GridItem colSpan={2}>
                <VStack align="start">
                  <Text fontWeight="bold">Profile Created At:</Text>
                  <Text>{dayjs(userInfo.createdAt).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </VStack>
              </GridItem>

              {/* Bio */}
              <GridItem colSpan={2}>
                <VStack align="start">
                  <Text fontWeight="bold">Bio:</Text>
                  {/* Rich Text Display */}
                  <Box
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    width="100%"
                  >
                    <Text>{userInfo.bio}</Text>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </Box>

      {/* Avatar Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Avatar Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Avatar
              size="2xl"
              name={userInfo.fullName}
              src={
                userInfo.avatarPath !== "string"
                  ? userInfo.avatarPath
                  : "https://via.placeholder.com/150"
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default ProfileViewer;