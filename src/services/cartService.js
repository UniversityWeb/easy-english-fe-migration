import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_CART_API_URL = '/cart';

const getCart = async () => {
  const path = `${SUFFIX_CART_API_URL}/`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const countCartItems = async () => {
  const path = `${SUFFIX_CART_API_URL}/count-items`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const removeItemFromCart = async (courseId) => {
  const path = `${SUFFIX_CART_API_URL}/remove-item/${courseId}`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateItemFromCart = async (cartItemId) => {
  const path = `${SUFFIX_CART_API_URL}/update-item/${cartItemId}`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const clearCart = async () => {
  const path = `${SUFFIX_CART_API_URL}/clear`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const canAddToCart = async (courseId) => {
  const path = `${SUFFIX_CART_API_URL}/can-add-to-cart/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const addItemToCart = async (courseId) => {
  const path = `${SUFFIX_CART_API_URL}/add-item/${courseId}`;
  const response = await post(path);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const addBundleToCart = async (bundleId) => {
  const path = `${SUFFIX_CART_API_URL}/add-bundle/${bundleId}`;
  const response = await post(path);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const cartService = {
  canAddToCart,
  getCart,
  addItemToCart,
  updateItemFromCart,
  removeItemFromCart,
  clearCart,
  countCartItems,
  addBundleToCart,
};

export default cartService;
