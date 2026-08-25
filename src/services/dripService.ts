import { get, put } from '~/utils/httpRequest';

const SUFFIX_DRIP_API_URL = '/drips';
const canLearn = async (targetType, targetId) => {
  const path = `${SUFFIX_DRIP_API_URL}/can-learn`;
  const response = await get(path, {
    params: {
      targetType,
      targetId,
    },
  });

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getAllDripsByCourseId = async (courseId) => {
  const path = `${SUFFIX_DRIP_API_URL}/get-all-by-course/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateDrips = async (courseId, dripsUpdateRequest) => {
  const path = `${SUFFIX_DRIP_API_URL}/update-drips/${courseId}`;
  const response = await put(path, dripsUpdateRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};
const dripService = {
  getAllDripsByCourseId,
  canLearn,
  updateDrips,
};

export default dripService;
