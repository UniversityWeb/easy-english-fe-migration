import { handleResponse, post, put } from '~/utils/httpRequest';
import { type IUser, type IPaginatedResponse } from '~/types';

const SUFFIX_USER_API_URL = '/users';

const updateOwnProfile = async (updateProfileRequest: any) => {
  const path = `${SUFFIX_USER_API_URL}/update-own-profile`;
  const response = await put(path, updateProfileRequest);
  return handleResponse(response, 200);
};

const uploadAvatar = async (avatar: File) => {
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

const getUsersWithoutAdmin = async (filterReq: any): Promise<IPaginatedResponse<IUser> | null> => {
  const path = `${SUFFIX_USER_API_URL}/admin/get`;
  const response = await post(path, filterReq);
  return handleResponse(response, 200);
};

const deleteUserForAdmin = async (username: string) => {
  const path = `${SUFFIX_USER_API_URL}/admin/delete/${username}`;
  const response = await put(path, undefined);
  return handleResponse(response, 204);
};

const updateUserForAdmin = async (username: string, userForAdminReq: any) => {
  const path = `${SUFFIX_USER_API_URL}/admin/update/${username}`;
  const response = await put(path, userForAdminReq);
  return handleResponse(response, 200);
};

const addUserForAdmin = async (userData: any): Promise<IUser | null> => {
  const response = await post(`${SUFFIX_USER_API_URL}/admin/add`, userData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const updateOwnSettings = async (updateReq: any) => {
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
