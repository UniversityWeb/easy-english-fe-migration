import { del, get, post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_FAVOURITE_API_URL = '/favourites';

const getAllFavorites = async (page = 0, size = 8) => {
  const path = `${SUFFIX_FAVOURITE_API_URL}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size,
    },
  });
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const deleteFavourite = async (courseId) => {
  const response = await del(`${SUFFIX_FAVOURITE_API_URL}/delete/${courseId}`);
  if (response?.status !== 204) {
    return null;
  }

  return response.data;
};

const addFavourite = async (courseId) => {
  const response = await post(`${SUFFIX_FAVOURITE_API_URL}/add/${courseId}`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getFavouriteByFilter = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_FAVOURITE_API_URL}/filter`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const checkCourseInFavourite = async (courseId) => {
  const response = await post(
    `${SUFFIX_FAVOURITE_API_URL}/check-course-in-favorite/${courseId}`,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const favoriteService = {
  getAllFavorites,
  deleteFavourite,
  addFavourite,
  getFavouriteByFilter,
  checkCourseInFavourite,
};

export default favoriteService;
