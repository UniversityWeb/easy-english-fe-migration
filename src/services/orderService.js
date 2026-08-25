import { get, handleResponse } from '~/utils/httpRequest';

const SUFFIX_ORDER_API_URL = '/orders';

const getOrdersByUsername = async (username, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${username}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return handleResponse(response, 200);
};

const getOrderById = async (orderId) => {
  const path = `${SUFFIX_ORDER_API_URL}/get-by-id/${orderId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const getOrdersByStatus = async (username, status, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${username}/status/${status}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return handleResponse(response, 200);
};

const getOrderItemsByOrderId = async (orderId, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${orderId}/items`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return handleResponse(response, 200);
};

const orderService = {
  getOrdersByUsername,
  getOrderById,
  getOrdersByStatus,
  getOrderItemsByOrderId,
};

export default orderService;
