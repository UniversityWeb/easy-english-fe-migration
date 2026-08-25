import { del, get, handleResponse, post, put } from '~/utils/httpRequest';

const SUFFIX_TEST_PART_API_URL = '/test-parts';

const create = async (addTestRequest) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/add`;
  const response = await post(path, addTestRequest);
  return handleResponse(response, 201);
};

const update = async (id, updateTestRequest) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/update/${id}`;
  const response = await put(path, updateTestRequest);
  return handleResponse(response, 200);
};

const getAll = async () => {
  const path = `${SUFFIX_TEST_PART_API_URL}/get-all`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const getById = async (testId) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/get-by-id/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const remove = async (testId) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/delete/${testId}`;
  const response = await del(path);
  return handleResponse(response, 204);
}

const getTestPartsByTestId = async (testId) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/get-by-test/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const swapPart = async (partId1, partId2) => {
  const path = `${SUFFIX_TEST_PART_API_URL}/swap/${partId1}/${partId2}`;
  const response = await put(path);
  return handleResponse(response, 204);
};

const testPartService = {
  create,
  update,
  getAll,
  getById,
  remove,
  getTestPartsByTestId,
  swapPart
};

export default testPartService;