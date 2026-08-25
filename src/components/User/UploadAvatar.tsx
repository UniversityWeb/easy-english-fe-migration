import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Avatar,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import userService from '~/services/userService';
import useCustomToast from '~/hooks/useCustomToast';
import { motion } from 'framer-motion';
import ImagePreview from '~/components/ImagePreview';
import { useTranslation } from 'react-i18next';

const MotionAvatar = motion(Avatar);

const UploadAvatar = ({ user, setUser }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const { successToast, errorToast } = useCustomToast();
  const [isPreviewAvatarOpen, setPreviewAvatarOpen] = useState(false);

  // State for modal control
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmUpload = useCallback(async () => {
    if (newFile) {
      setLoading(true); // Start loading animation
      try {
        // Upload the avatar file and get the new file path or URL
        const uploadedPath = await userService.uploadAvatar(newFile); // Ensure this method exists in your userService

        // Update registerRequest with the new avatar path
        setUser((prevState) => ({
          ...prevState,
          avatarPath: uploadedPath, // Adjust if needed
        }));

        setAvatarKey(Date.now());
        setNewFile(null); // Clear the new file
        successToast('Avatar uploaded successfully.');
      } catch (error) {
        console.error('Failed to upload avatar:', error.message);
        errorToast('An error occurred while uploading the avatar.');
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  }, [newFile, setUser]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      // Check for image MIME type
      setNewFile(file);
      setIsOpen(true); // Open confirmation dialog
    } else {
      alert('Please upload a valid image file.');
    }
  }, []);

  const handleConfirm = () => {
    setIsOpen(false); // Close the dialog
    handleConfirmUpload(); // Proceed with the upload
  };

  const handleCancel = () => {
    setIsOpen(false); // Close the dialog
    setNewFile(null); // Clear the selected file
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept image files only
  });

  return (
    <Box
      p={8}
      width="100%"
      minH="100px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* Surrounding border for the avatar */}
      <Box
        border="1px solid" // Change border thickness here
        borderColor="gray.200" // Change border color as needed
        borderRadius="full" // Make the border circular
        overflow="hidden" // Ensures that the avatar fits within the rounded border
        onClick={() => {
          if (user?.avatarPath) {
            setPreviewAvatarOpen(true);
          }
        }}
        transition="border-color 0.3s" // Smooth transition for the border color
        mb={4}
      >
        <MotionAvatar
          size="2xl"
          name={user?.fullName}
          src={user?.avatarPath}
          key={avatarKey} // Use avatarKey to trigger re-mount
          initial={{ opacity: 0, scale: 0.8 }} // Initial state
          animate={{ opacity: 1, scale: 1 }} // Final state
          transition={{ duration: 0.3 }} // Animation duration
        />
      </Box>

      {/* Avatar upload area */}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        p={4}
        mt={4}
        textAlign="center"
        borderRadius="md"
        bg={isDragActive ? 'blue.50' : 'white'}
        boxShadow="md"
        transition="background-color 0.2s"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text color="blue.500" fontSize="sm">
            {t('profile.til_drop_img')}
          </Text>
        ) : (
          <Text color="gray.600" fontSize="sm">
            {t('profile.til_pick_img')}
          </Text>
        )}
      </Box>

      {loading && (
        <Box mt={4} textAlign="center">
          <Spinner size="lg" color="blue.500" />
          <Text mt={2}>Uploading...</Text>
        </Box>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Upload</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to upload this image?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleConfirm}>
              Yes
            </Button>
            <Button ml={3} onClick={handleCancel}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ImagePreview
        isOpen={isPreviewAvatarOpen}
        onClose={() => setPreviewAvatarOpen(false)}
        imageUrl={user?.avatarPath}
      />
    </Box>
  );
};

export default UploadAvatar;
