import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const TestPreview = ({ courseTitle, test }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    description,
    durationInMilis,
    passingGrade,
    createdAt,
    parts,
    isDone,
  } = test;

  const totalQuestions =
    parts?.reduce((sum, part) => {
      return (
        sum +
        part.questionGroups?.reduce((groupSum, group) => {
          return groupSum + (group.questions?.length || 0);
        }, 0)
      );
    }, 0) || 0;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
        {title || "Test Title"}
      </Text>
      {/* Rich Text Description */}
      <Box
        mt={2}
        color="gray.600"
        fontSize="sm"
        dangerouslySetInnerHTML={{
          __html: description || "<p>No description provided</p>",
        }}
      />
      <Stack spacing={2} mt={4}>
        {[
          { label: "Created At", value: formattedDate },
          { label: "Duration", value: formatDuration(durationInMilis || 0) },
          { label: "Passing Grade", value: `${passingGrade}%` },
          { label: "Total Questions", value: totalQuestions },
          {
            label: "Status",
            value: isDone ? "Completed" : "Not Completed",
            color: isDone ? "green.500" : "orange.500"
          },
        ].map((field, index) => (
          <Text key={index} fontSize="sm" color={field.color || "gray.600"}>
            <strong>{field.label}:</strong> {field.value}
          </Text>
        ))}
      </Stack>
      <Button colorScheme="blue" mt={6} onClick={() => {
        localStorage.setItem("previousPage", window.location.href);
        navigate(config.routes.take_test(id), {
          state: {
            returnUrl: config.routes.learn(test?.courseId, courseTitle) + `?type=TEST&id=${id}`
          }
        })
      }}>
        Start Test
      </Button>
    </Box>
  );
};

export default TestPreview;