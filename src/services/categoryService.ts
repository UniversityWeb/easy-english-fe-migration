import { del, get, post, put } from '~/utils/httpRequest';

const SUFFIX_CATEGORY_API_URL = '/categories';

const fetchAllCategory = async () => {
  const response = await get(`${SUFFIX_CATEGORY_API_URL}/get-all`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getCategoryById = async (categoryId) => {
  const response = await get(
    `${SUFFIX_CATEGORY_API_URL}/get-by-id/${categoryId}`,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await post(`${SUFFIX_CATEGORY_API_URL}/add`, categoryData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateCategory = async (categoryId, categoryData) => {
  const response = await put(
    `${SUFFIX_CATEGORY_API_URL}/update/${categoryId}`,
    categoryData,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await del(`${SUFFIX_CATEGORY_API_URL}/delete/${categoryId}`);
  if (response?.status !== 204) {
    return null;
  }
  return true;
};

const categoryService = {
  fetchAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
