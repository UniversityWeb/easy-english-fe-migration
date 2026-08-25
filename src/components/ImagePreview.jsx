import React from 'react';
import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

const ImagePreview = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="0"
        boxShadow="none"
        height="100%"
        width="100%"
        backgroundColor="transparent" // Make modal content transparent
      >
        <ModalCloseButton
          position="absolute"
          top={4}
          right={4}
          zIndex="1"
          color="white"
          size="lg"
        />
        <ModalBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.5)" // Semi-transparent black background for contrast
        >
          <Box
            position="relative"
            overflow="hidden"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image src={imageUrl} alt="Image Preview" objectFit="contain" />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreview;
