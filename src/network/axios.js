import { getDataInCookie, storeDataInCookie, deleteDataInCookie } from '@/data-helpers/auth-session';
import axios from 'axios';

const ACCESS_TOKEN_KEY = 'access_token__admin';
const REFRESH_TOKEN_KEY = 'refresh_token__admin';

const getAccessToken = () =>
  typeof window !== 'undefined' ? getDataInCookie(ACCESS_TOKEN_KEY) : null;

const getRefreshToken = () =>
  typeof window !== 'undefined' ? getDataInCookie(REFRESH_TOKEN_KEY) : null;

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const formInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' },
});

const attachToken = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
};

instance.interceptors.request.use(attachToken, (error) => Promise.reject(error));
formInstance.interceptors.request.use(attachToken, (error) => Promise.reject(error));

const clearAdminSession = () => {
  deleteDataInCookie(ACCESS_TOKEN_KEY);
  deleteDataInCookie(REFRESH_TOKEN_KEY);
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.location.replace('/');
  }
};

const handleTokenRefresh = async (originalConfig, axiosInstance) => {
  originalConfig._retry = true;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAdminSession();
    redirectToLogin();
    return Promise.reject(new Error('No refresh token available'));
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/admin/refresh-token`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newAccessToken = res?.data?.body?.accessToken;
    if (!newAccessToken) throw new Error('Refresh response missing accessToken');

    storeDataInCookie(ACCESS_TOKEN_KEY, newAccessToken, 30);
    originalConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
    return axiosInstance(originalConfig);
  } catch {
    clearAdminSession();
    redirectToLogin();
    return Promise.reject(new Error('Session expired. Please log in again.'));
  }
};

const makeResponseInterceptor = (axiosInstance) => [
  (res) => res,
  async (err) => {
    const originalConfig = err?.config;

    if (
      err?.response?.status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url?.includes('/auth/admin/refresh-token')
    ) {
      return handleTokenRefresh(originalConfig, axiosInstance);
    }

    return Promise.reject(err);
  },
];

instance.interceptors.response.use(...makeResponseInterceptor(instance));
formInstance.interceptors.response.use(...makeResponseInterceptor(formInstance));
