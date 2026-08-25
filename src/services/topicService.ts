import { del, get, post, put } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_TOPIC_API_URL = '/topics';

const fetchAllTopic = async () => {
  const response = await get(`${SUFFIX_TOPIC_API_URL}/get-all`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getTopicById = async (topicId) => {
  const response = await get(`${SUFFIX_TOPIC_API_URL}/get-by-id/${topicId}`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createTopic = async (topicData) => {
  const response = await post(`${SUFFIX_TOPIC_API_URL}/add`, topicData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateTopic = async (topicId, topicData) => {
  const response = await put(
    `${SUFFIX_TOPIC_API_URL}/update/${topicId}`,
    topicData,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const deleteTopic = async (topicId) => {
  const response = await del(`${SUFFIX_TOPIC_API_URL}/delete/${topicId}`);
  if (response?.status !== 204) {
    return null;
  }
  return true;
};

const topicService = {
  fetchAllTopic,
  deleteTopic,
  getTopicById,
  createTopic,
  updateTopic,
};

export default topicService;
