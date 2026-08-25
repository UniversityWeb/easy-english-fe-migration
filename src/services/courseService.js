import { get, handleResponse, post, put } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_COURSE_API_URL = '/course';

const fetchAllCourses = async () => {
  const response = await get(`${SUFFIX_COURSE_API_URL}/get-all-course`);
  return handleResponse(response, 200);
};

const createCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/create-course`,
    courseRequest,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return handleResponse(response, 201);
};

const updateCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/update-course`,
    courseRequest,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return handleResponse(response, 200);
};

const deleteCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/delete-course`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const fetchAllCourseOfTeacher = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-of-teacher`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getCourseByFilter = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-course-by-filter`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const getCourseOfFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-favorite-of-student`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const deleteCourseOfFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/remove-course-from-favorite`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const getEnrollCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-of-student`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const fetchMainCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-main-course`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const addCourseToFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/add-course-to-favorite`,
    courseRequest,
  );
  return handleResponse(response, 200);
};

const getAllCourseForAdmin = async (filterReq) => {
  const path = `${SUFFIX_COURSE_API_URL}/admin/get`;
  const response = await post(path, filterReq);
  return handleResponse(response, 200);
};

const updateCourseStatus = async (courseId, status) => {
  const path = `${SUFFIX_COURSE_API_URL}/update-status/${courseId}/${status}`;
  const response = await put(path);
  return handleResponse(response, 200);
};

const updateCourseNotice = async (courseRequest) => {
  const path = `${SUFFIX_COURSE_API_URL}/update-notice`;
  const response = await put(path, courseRequest);
  return handleResponse(response, 200);
};

const countView = async (courseId) => {
  const path = `${SUFFIX_COURSE_API_URL}/count-view/${courseId}`;
  const response = await put(path);
  return handleResponse(response, 200);
};

const getRelatedCourses = async (getRelatedCourseReq) => {
  const path = `${SUFFIX_COURSE_API_URL}/get-related-courses`;
  const response = await post(path, getRelatedCourseReq);
  return handleResponse(response, 200);
};

const getCourseDetailButtonStatus = async (courseId) => {
  const path = `${SUFFIX_COURSE_API_URL}/get-button-status/${courseId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const courseService = {
  updateCourseStatus,
  addCourseToFavourite,
  fetchAllCourseOfTeacher,
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchMainCourse,
  getCourseByFilter,
  getCourseOfFavourite,
  deleteCourseOfFavourite,
  getEnrollCourse,
  getAllCourseForAdmin,
  updateCourseNotice,
  countView,
  getRelatedCourses,
  getCourseDetailButtonStatus,
};

export default courseService;
