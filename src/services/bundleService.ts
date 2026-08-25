import { get, post, put, del } from '~/utils/httpRequest';

const SUFFIX_BUNDLE_API_URL = '/bundles';

const getMyBundle = async (bundleRequest) => {
  const response = await post(
    `${SUFFIX_BUNDLE_API_URL}/get-my-bundles`,
    bundleRequest,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const getBundleById = async (bundleId) => {
  const path = `${SUFFIX_BUNDLE_API_URL}/get-by-id/${bundleId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateBundle = async (bundleId, bundleRequest) => {
  const path = `${SUFFIX_BUNDLE_API_URL}/update/${bundleId}`;
  const response = await put(path, bundleRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const createBundle = async (bundleRequest) => {
  const path = `${SUFFIX_BUNDLE_API_URL}/add`;
  const response = await post(path, bundleRequest);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const deleteBundle = async (bundleId) => {
  const path = `${SUFFIX_BUNDLE_API_URL}/delete/${bundleId}`;
  const response = await del(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getAllBundle = async () => {
  const bundleRequest = {
    name: '',
    pageNumber: 0,
    size: 1000,
  };

  const response = await post(
    `${SUFFIX_BUNDLE_API_URL}/students/get-bundles`,
    bundleRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};
const bundleService = {
  getMyBundle,
  getBundleById,
  updateBundle,
  createBundle,
  deleteBundle,
  getAllBundle,
};

export default bundleService;
