import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import userService from '~/services/userService';
import useCustomToast from '~/hooks/useCustomToast';

const GENDER_OPTIONS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

const ROLE_OPTIONS = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

const STATUS_OPTIONS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

function ProfileEdit({ user, mode, onSuccess, onError }) {
  const { successToast, errorToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempData, setTempData] = useState({ ...user, dob: user.dob || '' });

  useEffect(() => {
    setTempData({ ...user, dob: user.dob || '' });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData((prev) => ({
          ...prev,
          avatarPath: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById('avatarUpload').click();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (mode === 'edit') {
        await userService.updateUserForAdmin(tempData.username, tempData);
        successToast(
          `User ${tempData.username} has been updated successfully.`,
        );
      } else {
        const newUser = await userService.addUserForAdmin(tempData);
        if (!newUser) {
          throw new Error('Failed to add user');
        }
        successToast(`User ${newUser.username} has been added successfully.`);
      }

      onSuccess?.(tempData);
    } catch (error) {
      const errorMessage =
        error?.message ||
        `An error occurred while ${mode === 'edit' ? 'updating' : 'adding'} the user.`;
      errorToast(errorMessage);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    // Define required fields based on mode
    const requiredFields =
      mode === 'edit'
        ? ['fullName', 'email'] // Update mode: username and password not required
        : ['username', 'password', 'fullName', 'email']; // Create mode: all fields required

    return requiredFields.every((field) => tempData[field]);
  };

  return (
    <Box p={10}>
      <Flex bg="transparent" overflow="hidden" maxW="900px" mx="auto">
        {/* Avatar and User Info */}
        <Box
          flex="1"
          bg="transparent"
          p={6}
          textAlign="center"
          position="relative"
        >
          <Box position="relative" w="150px" h="150px" mx="auto">
            <Avatar
              size="full"
              name={tempData.fullName}
              src={tempData.avatarPath || 'https://via.placeholder.com/150'}
              cursor="pointer"
              onClick={handleAvatarClick}
            />
            <IconButton
              icon={<AddIcon />}
              position="absolute"
              bottom="0"
              right="0"
              borderRadius="full"
              colorScheme="purple"
              onClick={handleAvatarClick}
              aria-label="Upload Avatar"
            />
          </Box>
          <Input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            display="none"
          />
          <Heading size="md" mt={4}>
            {tempData.fullName}
          </Heading>
          <Text color="gray.500">{tempData.email}</Text>
          <Text color="gray.500" mb={4}>
            {tempData.phoneNumber}
          </Text>
        </Box>

        {/* Profile Edit Form */}
        <Box flex="2" p={8}>
          <Heading size="md" mb={6}>
            {mode === 'edit' ? 'Edit Profile' : 'Add User'}
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              <FormControl isRequired={mode !== 'edit'}>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={tempData.username}
                  onChange={handleChange}
                  isReadOnly={mode === 'edit'}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired={mode !== 'edit'}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder={
                    mode === 'edit'
                      ? 'Leave blank to keep current password'
                      : ''
                  }
                  value={tempData.password || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  value={tempData.fullName}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input
                  name="bio"
                  value={tempData.bio}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={tempData.phoneNumber}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={tempData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={tempData.gender}
                  onChange={handleChange}
                >
                  {Object.entries(GENDER_OPTIONS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={tempData.role}
                  onChange={handleChange}
                >
                  {Object.entries(ROLE_OPTIONS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={tempData.status}
                  onChange={handleChange}
                >
                  {Object.entries(STATUS_OPTIONS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  name="dob"
                  type="date"
                  value={tempData.dob}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Button
            mt={6}
            colorScheme="purple"
            size="lg"
            width="100%"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!validateForm()}
          >
            {mode === 'edit' ? 'Save Profile' : 'Add User'}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default ProfileEdit;
