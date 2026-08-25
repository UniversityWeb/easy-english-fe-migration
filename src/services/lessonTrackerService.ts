import { get, post } from '~/utils/httpRequest';

const SUFFIX_LESSON_TRACKER_API_URL = '/lesson-trackers';

const createCompleteLesson = async (lessonData) => {
  const response = await post(
    `${SUFFIX_LESSON_TRACKER_API_URL}/add`,
    lessonData,
  );
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};
const getFirstUnlearnedLesson = async (courseId) => {
  const path = `${SUFFIX_LESSON_TRACKER_API_URL}/get-first-unlearned-lesson/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const lessonTrackerService = {
  createCompleteLesson,
  getFirstUnlearnedLesson,
};

export default lessonTrackerService;
