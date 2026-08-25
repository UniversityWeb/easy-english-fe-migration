import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

const ImagePicker = ({ title, imagePreview, setImagePreview, setImageFile, mb = 4 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleImageChange = (e) => {
    setIsLoading(true); // Set loading to true
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      setImageFile(file);
    }
    setIsLoading(false); // Set loading to false after processing
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  return (
    <FormControl mb={mb}>
      {title && <FormLabel>{title}</FormLabel>}
      <Box position="relative" width="100%" mx="auto">
        {imagePreview ? (
          <>
            <Box
              position="relative"
              width="100%"
              height="250px"
              cursor="pointer"
              overflow="hidden"
              onClick={onOpen}
            >
              <Image
                src={imagePreview}
                alt="Selected Image"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
            <Button
              mt="4"
              colorScheme="red"
              width="100%"
              onClick={handleRemoveImage}
            >
              Remove Image
            </Button>
          </>
        ) : (
          <Flex
            border="2px dashed gray"
            p="4"
            textAlign="center"
            cursor="pointer"
            height="250px"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            onClick={() => document.getElementById('imageUpload').click()}
          >
            {isLoading ? (
              <Spinner size="xl" color="blue.500" />
            ) : (
              <>
                <Text>Drag and drop an image or upload it from your computer</Text>
                <Button mt="2" colorScheme="blue">
                  Upload an image
                </Button>
              </>
            )}
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              display="none"
            />
          </Flex>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
        <ModalContent backgroundColor="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex="1" />
          <ModalBody p="0">
            <Image
              src={imagePreview}
              alt="Preview Image"
              width="100%"
              height="100vh"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

export default ImagePicker;