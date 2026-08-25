import { post } from '~/utils/httpRequest';

const SUFFIX_SECTION_API_URL = '/section';

const createSection = async (sectionRequest) => {
  const path = `${SUFFIX_SECTION_API_URL}/create-section`;
  const response = await post(path, sectionRequest);
  if (response?.status !== 200 && response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateSection = async (sectionRequest) => {
  const path = `${SUFFIX_SECTION_API_URL}/update-section`;
  const response = await post(path, sectionRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const deleteSection = async (sectionRequest) => {
  const path = `${SUFFIX_SECTION_API_URL}/delete-section`;
  const response = await post(path, sectionRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const fetchSectionsByCourse = async (sectionRequest) => {
  const path = `${SUFFIX_SECTION_API_URL}/get-all-section-by-course`;
  const response = await post(path, sectionRequest);
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const sectionService = {
  createSection,
  updateSection,
  deleteSection,
  fetchSectionsByCourse,
};

export default sectionService;