import { post } from '~/utils/httpRequest';

const SUFFIX_FAQ_API_URL = '/faq';

const createFAQ = async (faqRequest) => {
    const path = `${SUFFIX_FAQ_API_URL}/create-faq`;
    const response = await post(path, faqRequest);
    if (response?.status !== 200 && response?.status !== 201) {
        return null;
    }
    return response.data;
};

const updateFAQ = async (faqRequest) => {
    const path = `${SUFFIX_FAQ_API_URL}/update-faq`;
    const response = await post(path, faqRequest);
    if (response?.status !== 200 && response?.status !== 201) {
        return null;
    }
    return response.data;
};

const deleteFAQ = async (faqRequest) => {
    const path = `${SUFFIX_FAQ_API_URL}/delete-faq`;
    const response = await post(path, faqRequest);
    if (response?.status !== 200) {
        return null;
    }
    return response.data;
};

const fetchFAQByCourse = async (faqRequest) => {
    const path = `${SUFFIX_FAQ_API_URL}/get-all-faq-by-course`;
    const response = await post(path, faqRequest);
    if (response?.status !== 200) {
        return null;
    }

    return response.data;
};

const faqService = {
    createFAQ,
    updateFAQ,
    deleteFAQ,
    fetchFAQByCourse,
};

export default faqService;