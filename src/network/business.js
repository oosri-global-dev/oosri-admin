import axios from 'axios';
import { formInstance, instance } from './axios';

export const handleCreatePersonalBusiness = async (payload) => {
  const data = await formInstance.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/seller/business-registration`,
    payload
  );
  return data;
};
