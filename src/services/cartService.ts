import { get, post, put } from '~/utils/httpRequest';
import { type ICartItem } from '~/types';

const SUFFIX_CART_API_URL = '/cart';

export interface ICartResponse {
  total: number;
  items: ICartItem[];
}

const getCart = async (): Promise<ICartResponse | null> => {
  const path = `${SUFFIX_CART_API_URL}/`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const countCartItems = async (): Promise<number | null> => {
  const path = `${SUFFIX_CART_API_URL}/count-items`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const removeItemFromCart = async (courseId: number) => {
  const path = `${SUFFIX_CART_API_URL}/remove-item/${courseId}`;
  const response = await put(path, undefined);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateItemFromCart = async (cartItemId: number) => {
  const path = `${SUFFIX_CART_API_URL}/update-item/${cartItemId}`;
  const response = await put(path, undefined);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const clearCart = async () => {
  const path = `${SUFFIX_CART_API_URL}/clear`;
  const response = await put(path, undefined);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const canAddToCart = async (courseId: number): Promise<boolean | null> => {
  const path = `${SUFFIX_CART_API_URL}/can-add-to-cart/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const addItemToCart = async (courseId: number) => {
  const path = `${SUFFIX_CART_API_URL}/add-item/${courseId}`;
  const response = await post(path, undefined);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const addBundleToCart = async (bundleId: number) => {
  const path = `${SUFFIX_CART_API_URL}/add-bundle/${bundleId}`;
  const response = await post(path, undefined);

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
