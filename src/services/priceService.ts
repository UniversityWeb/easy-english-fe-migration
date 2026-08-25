import { post } from '~/utils/httpRequest';

const SUFFIX_SECTION_API_URL = '/price';


const updatePrice = async (priceRequest) => {
  const path = `${SUFFIX_SECTION_API_URL}/update-price`;
  const response = await post(path, priceRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};


const fetchPriceByCourse = async (priceRequest) => {
    const path = `${SUFFIX_SECTION_API_URL}/get-price-by-course`;
    const response = await post(path, priceRequest);
    if (response?.status !== 200) {
      return null;
    }
    return response.data;
  };
  

const priceService = {
  updatePrice,
  fetchPriceByCourse,
};

export default priceService;