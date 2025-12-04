import axios from 'axios';
import { instance, publicInstance } from './axios';

export const handleRegistration = async (payload) => {
  const data = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/seller/sign-up`,
    payload
  );
  return data;
};

export const handleOTP = async (payload) => {
  const data = await publicInstance.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/seller/verify-otp`,
    payload
  );
  return data;
};

export const handleResendOTP = async (payload) => {
  const data = await publicInstance.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/seller/resend-otp`,
    payload
  );
  return data;
};

export const handleLogin = async (payload) => {
  const data = await instance.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/admin/login`,
    payload
  );
  return data;
};

export const handleVerifyLoginOTP = async (payload) => {
  const data = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/admin/verify-2fa`,
    payload
  );
  return data;
};

export const handleFetchUser = async () => {
  const data = await instance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/admin/current-user`
  );
  return data;
};
