import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';

const AudioPicker = ({ title, audioPreview, setAudioPreview, setAudioFile, mb = 4 }) => {
  const [loading, setLoading] = useState(false); // State for loading animation
  const [progress, setProgress] = useState(0); // State for progress percentage

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); // Start loading animation
      setProgress(0); // Reset progress to 0

      // Simulate file processing/loading progress
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.loaded && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      reader.onloadend = () => {
        const previewURL = URL.createObjectURL(file);
        setAudioPreview(previewURL);
        setAudioFile(file);
        setLoading(false); // Stop loading animation after processing is done
      };

      reader.readAsDataURL(file); // Simulate file reading/loading
    }
  };

  const handleRemoveAudio = () => {
    setAudioPreview('');
    setAudioFile(null);
  };

  return (
    <FormControl mb={mb}>
      {title && <FormLabel>{title}</FormLabel>}
      <Box position="relative" width="100%" mx="auto">
        {audioPreview && !loading ? (
          <>
            <Box
              position="relative"
              width="100%"
              height="auto"
              cursor="pointer"
              overflow="hidden"
            >
              <audio
                src={audioPreview}
                controls
                style={{ width: '100%' }}
              />
            </Box>
            <Button
              mt="4"
              colorScheme="red"
              width="100%"
              onClick={handleRemoveAudio}
            >
              Remove Audio
            </Button>
          </>
        ) : (
          <Flex
            border="2px dashed gray"
            p="4"
            textAlign="center"
            cursor="pointer"
            height="150px"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            onClick={() => document.getElementById('audioUpload').click()}
          >
            {!loading ? (
              <>
                <Text>Drag and drop an audio file or upload it from your computer</Text>
                <Button mt="2" colorScheme="blue">
                  Upload an audio file
                </Button>
              </>
            ) : (
              <CircularProgress
                value={progress}
                size="100px"
                color="blue.500"
                thickness="8px"
              >
                <CircularProgressLabel>{progress}%</CircularProgressLabel>
              </CircularProgress>
            )}
            <Input
              id="audioUpload"
              type="file"
              accept="audio/*" // Accept only audio files
              onChange={handleAudioChange}
              display="none"
            />
          </Flex>
        )}
      </Box>
    </FormControl>
  );
};

export default AudioPicker;