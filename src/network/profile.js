import { formInstance, instance } from './axios';

// export const UpdateProfilePicture = async (payload, params = '') => {
//   const data = await formInstance.post(`/profile/admin/profile-image`, payload);
//   return data;
// };

export const UpdateProfilePicture = async (payload) => {
  const formData = new FormData();
  formData.append('profileImage', payload.profilePicture);
  const data = await formInstance.post(`/profile/admin/profile-image`, formData);
  return data;
};

export const updateProfileData = async (payload) => {
  const { data } = await instance.put(`/profile/admin/update-profile`, payload);
  return data;
};

export const updateAdminEmail = async (payload) => {
  const { data } = await instance.put(`/profile/admin/update-email`, payload);
  return data;
};
