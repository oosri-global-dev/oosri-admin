import { getDataInCookie } from '@/data-helpers/auth-session';
import axios from 'axios';

let userToken = null;

if (typeof window !== 'undefined') {
  userToken = getDataInCookie('access_token__admin');
}

export const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: userToken ? `Bearer ${userToken}` : '',
  },
});

export const formInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: userToken ? `Bearer ${userToken}` : '',
  },
});

// Attach latest token on every request
const attachToken = (config) => {
  const token = getDataInCookie('access_token__admin');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
};

instance.interceptors.request.use(attachToken, (err) => Promise.reject(err));
formInstance.interceptors.request.use(attachToken, (err) => Promise.reject(err));

// On 401, redirect to login — always reject so callers get a proper error
const handle401 = (err) => {
  if (err?.response?.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  return Promise.reject(err);
};

instance.interceptors.response.use((res) => res, handle401);
formInstance.interceptors.response.use((res) => res, handle401);
