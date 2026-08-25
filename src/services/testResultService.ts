import { del, get, handleResponse, post } from '~/utils/httpRequest';

const SUFFIX_TEST_RESULT_API_URL = '/test-results';

const getById = async (testResultId) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/get-by-id/${testResultId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const submit = async (submitTestRequest) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/submit-test`;
  const response = await post(path, submitTestRequest);
  return handleResponse(response, 200);
};

const getTestHistory = async (testId, page, size) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/get-test-history-by-test-id`;
  const response = await get(path, {
    params: {
      testId: testId,
      page: page,
      size: size,
    }
  });
  return handleResponse(response, 200);
};

const remove = async (testResultId) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/delete/${testResultId}`;
  const response = await del(path);
  return handleResponse(response, 200);
}

const getByCurUser = async () => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const testResultService = {
  getById,
  submit,
  getTestHistory,
  remove,
  getByCurUser,
};

export default testResultService;