import { post, put } from '~/utils/httpRequest';

const SUFFIX_PAYMENT_API_URL = '/payment';

const createPaymentOrder = async (paymentRequest) => {
  const path = `${SUFFIX_PAYMENT_API_URL}/create-payment`;
  const response = await post(path, paymentRequest);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
}

const getResult = async (method, params) => {
  const path = `${SUFFIX_PAYMENT_API_URL}/result/${method}`;
  const response = await put(path, null, {
    params
  });

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const payService = {
  createPaymentOrder,
  getResult,
}

export default payService;