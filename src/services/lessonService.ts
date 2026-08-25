import { post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_LESSON_API_URL = '/lesson';

const fetchLessonById = async (lessonRequest) => {
  const path = `${SUFFIX_LESSON_API_URL}/get-lesson-by-id`;
  const response = await post(path, lessonRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createLesson = async (formData) => {
  const path = `${SUFFIX_LESSON_API_URL}/create-lesson`;
  const response = await post(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
    },
  });
  if (response?.status !== 200 && response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateLesson = async (formData) => {
  const path = `${SUFFIX_LESSON_API_URL}/update-lesson`;
  const response = await post(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
    },
  });
  if (response?.status !== 200 && response?.status !== 201) {
    return null;
  }
  return response.data;
};



const deleteLesson = async (lessonRequest) => {
  const path = `${SUFFIX_LESSON_API_URL}`;
  const response = await post(path, lessonRequest);
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const fetchLessons = async (lessonRequest) => {
  const path = `${SUFFIX_LESSON_API_URL}/get-all-lesson-by-section`;
  const response = await post(path, lessonRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};
const lessonService = {
  createLesson,
  updateLesson,
  fetchLessonById,
  fetchLessons,
  deleteLesson,
};

export default lessonService;