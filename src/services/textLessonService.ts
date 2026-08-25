import { post } from '~/utils/httpRequest';

const SUFFIX_TEXT_LESSON_API_URL = '/lesson';

const fetchLessonById = async (lessonRequest) => {
  const path = `${SUFFIX_TEXT_LESSON_API_URL}/get-lesson-by-id`;
  const response = await post(path, lessonRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createLesson = async (formData) => {
  const path = `${SUFFIX_TEXT_LESSON_API_URL}/create-lesson`;
  const response = await post(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
    },
  });
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateLesson = async (formData) => {
  const path = `${SUFFIX_TEXT_LESSON_API_URL}/update-lesson`;
  const response = await post(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
    },
  });
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const textLessonService = {
  fetchLessonById,
  createLesson,
  updateLesson,
};

export default textLessonService;