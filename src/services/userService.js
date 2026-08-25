import { handleResponse, post, put } from '~/utils/httpRequest';

const SUFFIX_USER_API_URL = '/users';

const updateOwnProfile = async (updateProfileRequest) => {
  const path = `${SUFFIX_USER_API_URL}/update-own-profile`;
  const response = await put(path, updateProfileRequest);
  return handleResponse(response, 200);
};

const uploadAvatar = async (avatar) => {
  const path = `${SUFFIX_USER_API_URL}/upload-avatar`;
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response = await put(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return handleResponse(response, 200);
};

const getUsersWithoutAdmin = async (filterReq) => {
  const path = `${SUFFIX_USER_API_URL}/admin/get`;
  const response = await post(path, filterReq);
  return handleResponse(response, 200);
};

const deleteUserForAdmin = async (username) => {
  const path = `${SUFFIX_USER_API_URL}/admin/delete/${username}`;
  const response = await put(path);
  return handleResponse(response, 204);
};

const updateUserForAdmin = async (username, userForAdminReq) => {
  const path = `${SUFFIX_USER_API_URL}/admin/update/${username}`;
  const response = await put(path, userForAdminReq);
  return handleResponse(response, 200);
};

const addUserForAdmin = async (userData) => {
  const response = await post(`${SUFFIX_USER_API_URL}/admin/add`, userData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateOwnSettings = async (updateReq) => {
  const path = `${SUFFIX_USER_API_URL}/update-own-settings`;
  const response = await put(path, updateReq);
  return handleResponse(response, 200);
};

const userService = {
  updateOwnProfile,
  uploadAvatar,
  getUsersWithoutAdmin,
  updateUserForAdmin,
  deleteUserForAdmin,
  addUserForAdmin,
  updateOwnSettings,
};

export default userService;
