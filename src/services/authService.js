import { getToken, isLoggedIn, saveLoginResponse } from '~/utils/authUtils';
import { get, handleResponse, post, put } from '~/utils/httpRequest';
import { USER_STATUSES } from '~/utils/constants';

const SUFFIX_AUTH_API_URL = '/auth';

const getCurUser = async () => {
  if (!isLoggedIn()) {
    return null;
  }

  const path = `${SUFFIX_AUTH_API_URL}/get-user-by-token`;
  const tokenStr = getToken();
  const response = await get(path, {
    params: { tokenStr }
  });

  return handleResponse(response, 200);
};

const login = async (loginRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/login`;
  const response = await post(path, loginRequest);

  if (response?.status !== 200) {
    return null;
  }

  const loginResponse = await response.data;
  if (loginResponse?.accountStatus === USER_STATUSES.ACTIVE) {
    saveLoginResponse(loginResponse);
  }
  return loginResponse;
};

const register = async (registerRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/register`;
  const response = await post(path, registerRequest);
  return handleResponse(response, 201);
};

const logout = async () => {
  try {
    const path = `${SUFFIX_AUTH_API_URL}/logout`;
    const response = await post(path);
    return handleResponse(response, 200);
  } catch (e) {
    console.error(e);
    return {};
  }
};

const activeAccount = async (activeAccountRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/active-account`;
  const response = await put(path, activeAccountRequest);
  return handleResponse(response, 200);
}

const resendOTPToActiveAccount = async (username) => {
  const path = `${SUFFIX_AUTH_API_URL}/resend-otp-to-active-account/${username}`;
  const response = await post(path);
  return handleResponse(response, 200);
}

const generateOtpToUpdatePassword = async (generateOtpRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/generate-otp-to-update-password`;
  const response = await post(path, generateOtpRequest);
  return handleResponse(response, 200);
};

const updatePasswordWithOtp = async (updatePasswordWithOtp) => {
  const path = `${SUFFIX_AUTH_API_URL}/update-password-with-otp`;
  const response = await put(path, updatePasswordWithOtp);
  return handleResponse(response, 200);
}

const generateOtpToResetPassword = async (email) => {
  const path = `${SUFFIX_AUTH_API_URL}/generate-otp-to-reset-password/${email}`;
  const response = await post(path);
  return handleResponse(response, 200);
};

const resetPasswordWithOtp = async (resetPasswordWithOtp) => {
  const path = `${SUFFIX_AUTH_API_URL}/reset-password-with-otp`;
  const response = await put(path, resetPasswordWithOtp);
  return handleResponse(response, 200);
}

const loginWithGoogle = async (token) => {
  const path = `${SUFFIX_AUTH_API_URL}/login-with-google`;
  const response = await post(path, {token: token});

  if (response?.status !== 200) {
    return null;
  }

  const loginResponse = await response.data;
  if (loginResponse?.accountStatus === USER_STATUSES.ACTIVE) {
    saveLoginResponse(loginResponse);
  }
  return loginResponse;
};

const AuthService = {
  getCurUser,
  login,
  register,
  logout,
  activeAccount,
  resendOTPToActiveAccount,
  generateOtpToUpdatePassword,
  updatePasswordWithOtp,
  generateOtpToResetPassword,
  resetPasswordWithOtp,
  loginWithGoogle,
};

export default AuthService;
