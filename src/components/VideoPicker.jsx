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

const VideoPicker = ({ videoPreview, setVideoPreview, setVideoFile }) => {
  const [loading, setLoading] = useState(false); // State for loading animation
  const [progress, setProgress] = useState(0); // State for progress percentage

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); // Start loading animation
      setProgress(0); // Reset progress to 0

      // Simulating file processing/loading progress
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.loaded && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      reader.onloadend = () => {
        const previewURL = URL.createObjectURL(file);
        setVideoPreview(previewURL);
        setVideoFile(file);
        setLoading(false); // Stop loading animation after processing is done
      };

      reader.readAsDataURL(file); // Simulate file reading/loading
    }
  };

  const handleRemoveVideo = () => {
    setVideoPreview('');
    setVideoFile(null);
  };

  return (
    <FormControl mb="4">
      <FormLabel>Video Picker</FormLabel>
      <Box position="relative" width="100%" mx="auto">
        {videoPreview && !loading ? (
          <>
            <Box
              position="relative"
              width="100%"
              height="auto"
              cursor="pointer"
              overflow="hidden"
            >
              <video
                src={videoPreview}
                width="100%"
                height="auto"
                style={{ objectFit: 'contain' }}
                controls
                //autoPlay
              />
            </Box>
            <Button
              mt="4"
              colorScheme="red"
              width="100%"
              onClick={handleRemoveVideo}
            >
              Remove Video
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
            onClick={() => document.getElementById('videoUpload').click()}
          >
            {!loading ? (
              <>
                <Text>
                  Drag and drop a video or upload it from your computer
                </Text>
                <Button mt="2" colorScheme="blue">
                  Upload a video
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
              id="videoUpload"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              display="none"
            />
          </Flex>
        )}
      </Box>
    </FormControl>
  );
};

export default VideoPicker;
