import { useToast } from '@chakra-ui/react';
import { useRef } from 'react';

const MAX_TOASTS = 3; // Define the maximum number of toasts allowed at once

const useCustomToast = () => {
  const toast = useToast();
  const toastQueueRef = useRef([]); // Queue to track active toasts

  const showToast = (message, status) => {
    // Check if we need to close the oldest toast
    if (toastQueueRef.current.length >= MAX_TOASTS) {
      const oldestToastId = toastQueueRef.current.shift(); // Remove the oldest toast from the queue
      toast.close(oldestToastId); // Close the oldest toast
    }

    // Show the new toast and add its ID to the queue
    const toastId = toast({
      title: message,
      status: status,
      position: 'top-right',
      isClosable: true,
      duration: 7000,
      onCloseComplete: () => {
        // Remove this toast ID from the queue when it closes
        toastQueueRef.current = toastQueueRef.current.filter(id => id !== toastId);
      },
    });

    // Add the new toast ID to the queue
    toastQueueRef.current.push(toastId);
  };

  const successToast = (message) => {
    showToast(message, 'success');
  };

  const errorToast = (message) => {
    showToast(message, 'error');
  };

  const infoToast = (message) => {
    showToast(message, 'info');
  };

  const warningToast = (message) => {
    showToast(message, 'warning');
  };

  return { successToast, errorToast, infoToast, warningToast };
};

export default useCustomToast;
