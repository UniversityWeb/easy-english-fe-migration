import { del, get, handleResponse, post, put } from '~/utils/httpRequest';

const SUFFIX_TEST_QUESTION_API_URL = '/test-questions';

const create = async (addTestRequest) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/add`;
  const response = await post(path, addTestRequest);
  return handleResponse(response, 201);
};

const update = async (id, updateTestRequest) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/update/${id}`;
  const response = await put(path, updateTestRequest);
  return handleResponse(response, 200);
};

const getAll = async () => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-all`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const getById = async (testId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-by-id/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const remove = async (testId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/delete/${testId}`;
  const response = await del(path);
  return handleResponse(response, 204);
}

const getByQuestionGroup = async (questionGroupId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-by-question-group/${questionGroupId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const createNewQuestionForQuizType = async (addQuizQuestionRequest) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/create-new-question-for-quiz`;
  const response = await post(path, addQuizQuestionRequest);
  return handleResponse(response, 201);
};

const getAllQuestionsForQuizType = async (testId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-questions-for-quiz/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};
const swapQuestions = async (questionId1, questionId2) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/swap/${questionId1}/${questionId2}`;
  const response = await put(path); // Không cần dữ liệu payload
  return handleResponse(response, 204);
};

const testQuestionService = {
  create,
  update,
  getAll,
  getById,
  remove,
  getByQuestionGroup,
  createNewQuestionForQuizType,
  getAllQuestionsForQuizType,
  swapQuestions,
};

export default testQuestionService;