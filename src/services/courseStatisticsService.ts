import { get, handleResponse, post } from '~/utils/httpRequest';

const SUFFIX_COURSE_ANA_API_URL = '/course-statistics';

const getRevenueByYear = async (year) => {
  const url = `${SUFFIX_COURSE_ANA_API_URL}/top3/by-year/${year}`;
  const response = await get(url);
  return handleResponse(response, 200);
};
const getRevenueByMonthAndYear = async (
  teacherUsername,
  month,
  year,
  page,
  size,
) => {
  const url = `${SUFFIX_COURSE_ANA_API_URL}/top-revenue/${month}/${year}`;
  const response = await get(url, {
    params: {
      teacherUsername,
      page,
      size,
    },
  });
  return handleResponse(response, 200);
};

const getTopCourse = async (
  month = 11,
  year = 2024,
  page = 0,
  size = 4,
  criteria = 'REVENUE',
) => {
  const path = `${SUFFIX_COURSE_ANA_API_URL}/get-top?criteria=${criteria}`;
  const response = await post(
    path,
    {
      month: month,
      year: year,
      page: page,
      size: size,
    }, // Pass CourseFilterReq as the body
  );
  return handleResponse(response, 200);
};

const getAllTeachers = async () => {
  const url = `${SUFFIX_COURSE_ANA_API_URL}/admin/get-teacher-usernames`;
  const response = await get(url);
  return handleResponse(response, 200);
};

const courseStatisticsService = {
  getRevenueByYear,
  getRevenueByMonthAndYear,
  getTopCourse,
  getAllTeachers,
};

export default courseStatisticsService;
