import { get, post, put, del } from '~/utils/httpRequest';

const SUFFIX_WRITING_TASK_API_URL = '/writing-tasks';

const submitWriting = async (writingRequest) => {
  const path = `${SUFFIX_WRITING_TASK_API_URL}/submit`;
  const response = await post(path, writingRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateWriting = async (writingId, writingRequest) => {
  const path = `${SUFFIX_WRITING_TASK_API_URL}/update/${writingId}`;
  const response = await put(path, writingRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const createWriting = async (writingRequest) => {
  const path = `${SUFFIX_WRITING_TASK_API_URL}/add`;
  const response = await post(path, writingRequest);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const getWriting = async (writingRequest) => {
  const response = await post(
    `${SUFFIX_WRITING_TASK_API_URL}/get-tasks`,
    writingRequest,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data.content;
};

const fetchWritingById = async (writingId) => {
  const path = `${SUFFIX_WRITING_TASK_API_URL}/get-by-id/${writingId}`;
  const response = await get(path);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const deleteWriting = async (topicId) => {
  const response = await del(
    `${SUFFIX_WRITING_TASK_API_URL}/delete/${topicId}`,
  );
  if (response?.status !== 204) {
    return null;
  }
  return true;
};

const writingService = {
  submitWriting,
  createWriting,
  updateWriting,
  getWriting,
  fetchWritingById,
  deleteWriting,
};

export default writingService;
