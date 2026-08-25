import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  IconButton,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaPause, FaPlay } from 'react-icons/fa';
import {
  MdFullscreen,
  MdFullscreenExit,
  MdViewHeadline,
  MdVolumeUp,
} from 'react-icons/md';
import { CiPaperplane } from 'react-icons/ci';
import {
  TbLayoutColumns,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from 'react-icons/tb';
import testResultService from '~/services/testResultService';
import {
  clearSavedTest,
  generateSubmitTestRequest,
  getCourseId,
  getTest,
} from '~/utils/testUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import axios from 'axios';
import { isPlayableMp3 } from '~/utils/methods';

const CountdownTimer = ({ testId, resetKey, onFinished }) => {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState(2100); // Default time in seconds (35 minutes)

  useEffect(() => {
    const savedTest = getTest(testId);
    if (savedTest && savedTest.startedAt && savedTest.durationInMilis) {
      const startedAt = new Date(savedTest.startedAt).getTime();
      const durationInMilis = savedTest.durationInMilis;
      const currentTime = Date.now();
      const endTime = startedAt + durationInMilis;
      const remainingTime = Math.max(
        Math.floor((endTime - currentTime) / 1000),
        0,
      );
      setTimeLimit(remainingTime);
    }
  }, [testId, resetKey]);

  useEffect(() => {
    if (timeLimit <= 0) {
      if (onFinished) onFinished();
      const courseId = getCourseId(testId);
      clearSavedTest(testId);
      navigate(config.routes.learn(courseId));
      setTimeLimit(60);
      return;
    }

    const timer = setInterval(() => {
      setTimeLimit((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, onFinished, testId, timeLimit]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedHours =
      hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Text fontSize="lg" fontWeight="bold" textAlign="center">
      {formatTime(timeLimit)} remaining
    </Text>
  );
};

function TakeTestHeader({
  backLearn = true,
  resetCountDown,
  testId,
  audioPath,
  isSplitLayout,
  onToggleLayout,
}) {
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [resetTimeCountDown, setResetTimeCountDown] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playable, setPlayable] = useState(null);

  useEffect(() => {
    const check = async () => {
      const result = await isPlayableMp3(audioUrl);
      setPlayable(result);
    };
    check();
  }, [audioUrl]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        if (audioPath) {
          const response = await axios.get(audioPath, {
            responseType: 'blob', // Fetch binary data
          });

          const file = new Blob([response.data], {
            type: response.headers['content-type'],
          });
          const url = URL.createObjectURL(file);
          setAudioUrl(url); // Set the blob URL

          // Simulate a file object to display metadata
          const simulatedFile = new File([file], audioPath.split('/').pop(), {
            type: file.type,
          });
          setAudioFile(simulatedFile);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
        setAudioUrl(null); // Set to null if fetch fails
      }
    };

    fetchAudio();
  }, [audioPath]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl; // Use `audioUrl` instead of `audioFile`
      audioRef.current.load(); // Ensure the audio file is loaded
    }
  }, [audioUrl]);

  useEffect(() => {
    setResetTimeCountDown((prev) => prev + 1);
  }, [resetCountDown]);

  const saveCurrentTime = useCallback((time) => {
    const key = `audioCurrentTime/${testId}`;
    localStorage.setItem(key, time);
  }, [testId]);

  const getCurrentTime = useCallback(() => {
    const key = `audioCurrentTime/${testId}`;
    return parseFloat(localStorage.getItem(key)) || 0;
  }, [testId]);

  useEffect(() => {
    if (audioRef.current) {
      const currentAudio = audioRef.current;
      currentAudio.volume = volume;
      const savedTime = getCurrentTime();
      if (savedTime && savedTime < currentAudio.duration) {
        currentAudio.currentTime = savedTime;
      }

      const updateCurrentTime = () => {
        setCurrentTime(currentAudio.currentTime);
        saveCurrentTime(currentAudio.currentTime);
      };

      currentAudio.addEventListener('timeupdate', updateCurrentTime);

      return () => {
        if (currentAudio) {
          currentAudio.removeEventListener('timeupdate', updateCurrentTime);
        }
      };
    }
  }, [getCurrentTime, saveCurrentTime, volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration || 0,
        audioRef.current.currentTime + 5,
      );
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5,
      );
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleTimeDisplay = () => {
    setShowRemainingTime(!showRemainingTime);
  };

  const handleSubmit = async () => {
    const answers = getTest(testId)?.userAnswers;
    if (!Array.isArray(answers) || answers.length === 0) {
      errorToast('You have not answered any questions');
      return;
    }

    setLoading(true);
    try {
      const submitRequest = generateSubmitTestRequest(testId);
      const testResultResponse = await testResultService.submit(submitRequest);
      successToast('Test submitted successfully');
      const courseId = getCourseId(testId);
      clearSavedTest(testId);
      localStorage.removeItem(`audioCurrentTime/${testId}`);
      if (testResultResponse?.id && backLearn === true) {
        navigate(config.routes.test_result(testResultResponse?.id), {
          state: { returnUrl: config.routes.learn(courseId) },
        });
      } else if (testResultResponse?.id && backLearn === false) {
        navigate(config.routes.entrance_test_result(testResultResponse?.id));
      } else {
        handleBackClick();
      }
    } catch (error) {
      errorToast('Error submitting test');
    } finally {
      setLoading(false);
    }
    setIsSubmitConfirmOpen(false);
  };

  const handleBackClick = () => {
    if (backLearn === true) {
      const courseId = getCourseId(testId);
      navigate(config.routes.learn(courseId));
    } else {
      navigate(-1);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error('Error attempting to exit full-screen mode:', err);
        });
    }
  };

  // Update the current time of the audio when it is playing
  const updateCurrentTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <Box w="100%" p={4} bg="white" boxShadow="md" ref={containerRef}>
      <SimpleGrid columns={3} spacing={4} alignItems="center">
        <IconButton
          aria-label="Back"
          icon={<AiOutlineArrowLeft />}
          onClick={handleBackClick} // Handle the click action
          boxSize="50px"
        />

        <CountdownTimer
          testId={testId}
          resetKey={resetTimeCountDown}
          onFinished={handleSubmit}
        />

        <HStack justifyContent="flex-end" p={4}>
          {/* Fullscreen Button */}
          <IconButton
            aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            icon={isFullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
            colorScheme="teal"
            variant="outline"
            onClick={toggleFullScreen}
          />

          <IconButton
            aria-label={
              isSplitLayout
                ? 'Switch to Reading Mode'
                : 'Switch to Split Layout'
            }
            icon={isSplitLayout ? <MdViewHeadline /> : <TbLayoutColumns />}
            colorScheme="teal"
            variant="outline"
            onClick={onToggleLayout}
          />
          <Button
            colorScheme="teal"
            rightIcon={<CiPaperplane />}
            onClick={() => setIsSubmitConfirmOpen(true)}
          >
            Submit
          </Button>
        </HStack>
      </SimpleGrid>

      {audioFile && audioFile !== '' && playable && (
        <HStack mt={6} spacing={4} alignItems="center">
          {/* Control buttons */}
          {audioUrl ? (
            <audio
              controls
              ref={audioRef}
              onTimeUpdate={updateCurrentTime}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setAudioDuration(audioRef.current.duration);
                }
              }}
              hidden
            >
              <source src={audioUrl} type={audioFile?.type || 'audio/mpeg'} />
            </audio>
          ) : (
            <Text color="red.500">Error loading audio file</Text>
          )}

          <IconButton
            size={'sm'}
            aria-label="Rewind"
            icon={<TbPlayerTrackPrevFilled />}
            onClick={handlePrev}
          />
          <IconButton
            size={'sm'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlayPause}
          />
          <IconButton
            size={'sm'}
            aria-label="Forward"
            icon={<TbPlayerTrackNextFilled />}
            onClick={handleNext}
          />

          {/* Time Display */}
          <Text onClick={toggleTimeDisplay} cursor="pointer">
            {showRemainingTime
              ? `-${formatTime(audioRef.current.duration - currentTime)}`
              : formatTime(currentTime)}
          </Text>

          <Slider
            aria-label="time-slider"
            value={currentTime}
            max={audioDuration}
            onChange={(value) => {
              audioRef.current.currentTime = value;
              setCurrentTime(value);
            }}
            flex="1"
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>

          {/* Volume Control */}
          <MdVolumeUp />
          <Slider
            aria-label="volume-slider"
            defaultValue={volume * 100}
            onChange={handleVolumeChange}
            maxW="100px"
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </HStack>
      )}

      <AlertDialog
        isOpen={isSubmitConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsSubmitConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Submission</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to submit the test?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsSubmitConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleSubmit}
                ml={3}
                disabled={loading}
                rightIcon={loading ? null : <CiPaperplane />}
              >
                {loading ? <Spinner size="sm" /> : 'Submit'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default TakeTestHeader;
