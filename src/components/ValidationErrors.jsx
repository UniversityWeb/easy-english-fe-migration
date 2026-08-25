import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

const ValidationErrors = ({ errors }) => (
  errors?.length > 0 && (
    <Box mb={4} textAlign="left">
      {/* Wrap the error messages in a motion.div for animation */}
      <motion.div
        key={errors.join('')} // Use a unique key to trigger animation when errors change
        initial={{ opacity: 0 }} // Start with opacity 0
        animate={{ opacity: 1 }} // Fade in to opacity 1
        exit={{ opacity: 0 }} // Fade out when errors are removed
        transition={{ duration: 0.5 }} // Adjust duration as needed
      >
        {errors.map((error, index) => (
          <Text key={index} color="red.500" fontSize="sm">
            {error}
          </Text>
        ))}
      </motion.div>
    </Box>
  )
);

export default ValidationErrors;