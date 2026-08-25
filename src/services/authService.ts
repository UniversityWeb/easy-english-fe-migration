import { getToken, isLoggedIn, saveLoginResponse } from '~/utils/authUtils';
import { get, handleResponse, post, put } from '~/utils/httpRequest';
import { USER_STATUSES } from '~/utils/constants';
import { type IUser } from '~/types';

const SUFFIX_AUTH_API_URL = '/auth';

export interface ILoginRequest {
  username?: string;
  password?: string;
}

export interface ILoginResponse extends IUser {
  token: string;
}

const getCurUser = async (): Promise<IUser | null> => {
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

const login = async (loginRequest: ILoginRequest): Promise<ILoginResponse | null> => {
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

const register = async (registerRequest: any) => {
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

const activeAccount = async (activeAccountRequest: any) => {
  const path = `${SUFFIX_AUTH_API_URL}/active-account`;
  const response = await put(path, activeAccountRequest);
  return handleResponse(response, 200);
}

const resendOTPToActiveAccount = async (username: string) => {
  const path = `${SUFFIX_AUTH_API_URL}/resend-otp-to-active-account/${username}`;
  const response = await post(path);
  return handleResponse(response, 200);
}

const generateOtpToUpdatePassword = async (generateOtpRequest: any) => {
  const path = `${SUFFIX_AUTH_API_URL}/generate-otp-to-update-password`;
  const response = await post(path, generateOtpRequest);
  return handleResponse(response, 200);
};

const updatePasswordWithOtp = async (updatePasswordWithOtp: any) => {
  const path = `${SUFFIX_AUTH_API_URL}/update-password-with-otp`;
  const response = await put(path, updatePasswordWithOtp);
  return handleResponse(response, 200);
}

const generateOtpToResetPassword = async (email: string) => {
  const path = `${SUFFIX_AUTH_API_URL}/generate-otp-to-reset-password/${email}`;
  const response = await post(path);
  return handleResponse(response, 200);
};

const resetPasswordWithOtp = async (resetPasswordWithOtp: any) => {
  const path = `${SUFFIX_AUTH_API_URL}/reset-password-with-otp`;
  const response = await put(path, resetPasswordWithOtp);
  return handleResponse(response, 200);
}

const loginWithGoogle = async (token: string): Promise<ILoginResponse | null> => {
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
