import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Progress,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import reviewService from '~/services/reviewService';
import { getUsername } from '~/utils/authUtils';

const Reviews = ({ courseId, instructorName, onReviewUpdate, buttonState }) => {
  const canWriteReview = buttonState === 'COMPLETED';
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const username = getUsername();
  const [ratingsCount, setRatingsCount] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    owner: username,
  });
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [response, setResponse] = useState({ id: null, text: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewService.fetchReviewByCourse({
          courseId: courseId,
        });
        if (response) {
          setReviews(response);
          const userHasReviewed = response.some(
            (review) => review.owner === username,
          );
          setHasReviewed(userHasReviewed);
          if (response.length > 0) {
            calculateAverageRating(response);
          } else {
            setAverageRating(0);
            setRatingsCount({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  const calculateAverageRating = (reviews) => {
    const count = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const total = reviews.reduce((acc, review) => {
      count[review.rating] += 1;
      return acc + review.rating;
    }, 0);
    setRatingsCount(count);
    setAverageRating((total / reviews.length).toFixed(1));
  };

  const handleSubmitReview = async () => {
    if (newReview.comment.trim() === '' || newReview.rating === 0) {
      alert('Please enter a comment and a rating.');
      return;
    }

    const reviewRequest = {
      courseId: courseId,
      rating: newReview.rating,
      comment: newReview.comment,
      user: username,
    };

    try {
      const response = await reviewService.createReviewToCourse(reviewRequest);

      if (response) {
        const updatedReviews = [
          ...reviews,
          {
            ...newReview,
            id: reviews.length + 1,
            response: '',
            showResponseInput: false,
          },
        ];
        setReviews(updatedReviews);
        setNewReview({ rating: 0, comment: '', owner: username });
        setIsWritingReview(false);
        setHasReviewed(true);
        calculateAverageRating(updatedReviews);
        if (onReviewUpdate) {
          await onReviewUpdate();
        }
      } else {
        alert('Failed to submit the review. Please try again.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResponseSubmit = async (id) => {
    if (response.text.trim() === '') {
      alert('Please enter a response.');
      return;
    }

    const responseRequest = {
      id, // The review ID
      response: response.text, // The response text
    };

    const apiResponse =
      await reviewService.createResponseOnReview(responseRequest);

    if (apiResponse) {
      setReviews(
        reviews.map((review) =>
          review.id === id
            ? { ...review, response: response.text, showResponseInput: false }
            : review,
        ),
      );
      setResponse({ id: null, text: '' });
    } else {
      alert('Failed to submit the response. Please try again.');
    }
  };

  const toggleResponseInput = (id) => {
    const selectedReview = reviews.find((review) => review.id === id);
    if (!selectedReview.response) {
      setReviews(
        reviews.map((review) =>
          review.id === id
            ? { ...review, showResponseInput: !review.showResponseInput }
            : review,
        ),
      );
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box mt={4}>
      {/* Average Rating and Review Count */}
      <HStack spacing={4} align="center">
        <Text fontSize="4xl" fontWeight="bold">
          {averageRating > 0 ? averageRating : '0.0'}
        </Text>
        <VStack align="flex-start">
          <HStack>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                as={FaStar}
                color={
                  i < Math.floor(averageRating)
                    ? 'orange.400'
                    : i < averageRating
                      ? 'gray.300'
                      : 'gray.300'
                }
              />
            ))}
          </HStack>
          <Text fontSize="sm">{reviews.length} review(s)</Text>
        </VStack>

        {canWriteReview && !hasReviewed && (
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => setIsWritingReview(true)}
          >
            Write Review
          </Button>
        )}
      </HStack>

      {/* Star Rating Distribution */}
      <Box mt={4}>
        <VStack spacing={2} align="stretch">
          {[5, 4, 3, 2, 1].map((star) => (
            <HStack key={star} justify="space-between">
              <Text>Stars {star}</Text>
              <Progress
                value={(ratingsCount[star] / (reviews.length || 1)) * 100}
                size="sm"
                colorScheme="blue"
                w="70%"
              />
              <Text>{ratingsCount[star]}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Review List */}
      <Box mt={6}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Box key={review.id} mt={4}>
              <HStack>
                {[...Array(review.rating)].map((_, i) => (
                  <Icon key={i} as={FaStar} color="orange.400" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <Icon key={i} as={FaStar} color="gray.300" />
                ))}
              </HStack>
              <Text mt={2} fontWeight="bold">
                {review.comment}
              </Text>
              <Text mt={2}>by {review.owner}</Text>

              {review.response ? (
                <Box mt={2} ml={4} p={2} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">Response:</Text>
                  <Text>{review.response}</Text>
                </Box>
              ) : (
                username === instructorName && (
                  <Button
                    variant="link"
                    onClick={() => toggleResponseInput(review.id)}
                  >
                    Respond
                  </Button>
                )
              )}

              {review.showResponseInput && !review.response && (
                <>
                  <Textarea
                    placeholder="Write your response here..."
                    value={response.id === review.id ? response.text : ''}
                    onChange={(e) =>
                      setResponse({ id: review.id, text: e.target.value })
                    }
                    mt={2}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={() => handleResponseSubmit(review.id)}
                    mt={2}
                  >
                    Submit Response
                  </Button>
                </>
              )}

              {review.id < reviews.length && <Divider mt={4} />}
            </Box>
          ))
        ) : (
          <Text>No reviews available for this course.</Text>
        )}
      </Box>

      {/* Write a Review Section */}
      {isWritingReview && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            Write a Review
          </Text>
          <HStack spacing={4} mt={2}>
            <Text>Rating:</Text>
            <HStack>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={FaStar}
                  color={newReview.rating >= star ? 'orange.400' : 'gray.300'}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  cursor="pointer"
                />
              ))}
            </HStack>
          </HStack>
          <Textarea
            placeholder="Write your comment here..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            mt={2}
          />
          <Button colorScheme="blue" onClick={handleSubmitReview} mt={4}>
            Submit Review
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsWritingReview(false)}
            mt={4}
            ml={2}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Reviews;
