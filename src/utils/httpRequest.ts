import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { getToken } from './authUtils';

const httpRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpRequest.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

httpRequest.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - possibly due to an invalid token.');
    }
    if (error.response && error.response.status === 403) {
      console.error('Forbidden - you do not have permission to access this resource.');
    }
    if (error.response && error.response.status === 500) {
      console.error('Server error - something went wrong on the server.');
    }
    return Promise.reject(error);
  },
);

export const get = async (path: string, options: AxiosRequestConfig = {}) => {
  try {
    return await httpRequest.get(path, options);
  } catch (e: any) {
    console.error(`Error fetching data from ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const post = async (path: string, data?: any, options: AxiosRequestConfig = {}) => {
  try {
    return await httpRequest.post(path, data, options);
  } catch (e: any) {
    console.error(`Error posting data to ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const put = async (path: string, data?: any, options: AxiosRequestConfig = {}) => {
  try {
    return await httpRequest.put(path, data, options);
  } catch (e: any) {
    console.error(`Error updating data on ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const del = async (path: string, options: AxiosRequestConfig = {}) => {
  try {
    return await httpRequest.delete(path, options);
  } catch (e: any) {
    console.error(`Error deleting data from ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const handleResponse = (response: any, successCode: number) => {
  return response?.status === successCode ? response.data : null;
};