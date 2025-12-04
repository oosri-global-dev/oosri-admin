import { formInstance, instance } from './axios';

// export const UpdateProfilePicture = async (payload, params = '') => {
//   const data = await formInstance.post(`/profile/admin/profile-image`, payload);
//   return data;
// };

export const UpdateProfilePicture = async (payload) => {
  const formData = new FormData();
  formData.append('profileImage', payload.profilePicture);
  console.log(payload?.profilePicture, 'UPLOADED PICTURE HERE');

  const data = await formInstance.post(
    `/profile/admin/profile-image`,
    formData
  );
  console.log('PROFILE IMAGE UPDATE', data);
  return data;
};

export const updateProfileData = async (payload) => {
  try {
    const data = await instance.put(`/profile/admin/update-profile`, payload);
    console.log;
    return data;
  } catch (error) {
    console.error('Error updating profile data:', error);
  }
};
