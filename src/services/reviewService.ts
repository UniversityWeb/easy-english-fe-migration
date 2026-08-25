import { post } from '~/utils/httpRequest';

const SUFFIX_REVIEW_API_URL = '/review';

const fetchReviewByCourse = async (reviewRequest) => {
  const path = `${SUFFIX_REVIEW_API_URL}/get-all-review-by-course`;
  const response = await post(path, reviewRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};



const createReviewToCourse = async (reviewRequest) => {
  const path = `${SUFFIX_REVIEW_API_URL}/create-review`;
  const response = await post(path, reviewRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createResponseOnReview = async (reviewRequest) => {
  const path = `${SUFFIX_REVIEW_API_URL}/create-response`;
  const response = await post(path, reviewRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const reviewService = {
  createResponseOnReview,
  fetchReviewByCourse,
  createReviewToCourse,
};

export default reviewService;
