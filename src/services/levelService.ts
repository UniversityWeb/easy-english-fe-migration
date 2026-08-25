import { del, get, post, put } from '~/utils/httpRequest';

const SUFFIX_LEVEL_API_URL = '/levels';

const fetchAllLevelByTopic = async (levelRequest) => {
  const response = await post(`${SUFFIX_LEVEL_API_URL}/get-all-level-by-topic`,levelRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const fetchAllLevel = async () => {
  const response = await get(`${SUFFIX_LEVEL_API_URL}/get-all`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getLevelById = async (levelId) => {
  const response = await get(`${SUFFIX_LEVEL_API_URL}/get-by-id/${levelId}`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createLevel = async (levelData) => {
  const response = await post(`${SUFFIX_LEVEL_API_URL}/add`, levelData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateLevel = async (levelId, levelData) => {
  const response = await put(
    `${SUFFIX_LEVEL_API_URL}/update/${levelId}`,
    levelData,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const deleteLevel = async (levelId) => {
  const response = await del(`${SUFFIX_LEVEL_API_URL}/delete/${levelId}`);
  if (response?.status !== 204) {
    return null;
  }
  return true;
};

const levelService = {
  fetchAllLevel,
  deleteLevel,
  getLevelById,
  createLevel,
  updateLevel,
  fetchAllLevelByTopic
};

export default levelService;
