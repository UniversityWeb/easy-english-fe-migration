import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';

const VerifyOtpModal = ({ isOpen, onClose, isSubmitLoading, onOtpSubmitted }) => {
  const [otp, setOtp] = useState('');

  const handleOtpSubmit = async () => {
    onOtpSubmitted(otp);
    setOtp('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify OTP</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Enter OTP</FormLabel>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            textColor="white"
            colorScheme="cyan"
            onClick={handleOtpSubmit}
            ml={3}
            isLoading={isSubmitLoading}
            disabled={!otp}
          >
            {isSubmitLoading ? <Spinner size="sm" /> : 'Verify OTP'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerifyOtpModal;