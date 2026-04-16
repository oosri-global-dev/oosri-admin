import { instance } from './axios';

export const getUploadSignature = async (folder = 'uploads') => {
    const data = await instance.get(`/upload/signature?folder=${folder}`);
    return data;
};

export const uploadToCloudinary = async (file, folder = 'uploads') => {
    // 1. Get Signature
    const sigRes = await getUploadSignature(folder);
    if (!sigRes?.data?.success) {
        throw new Error('Failed to get upload signature');
    }

    const { signature, timestamp, apiKey, cloudName } = sigRes.data.data;

    // 2. Prepare FormData for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    // 3. Post to Cloudinary using fetch to bypass Axios interceptors
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || 'Failed to upload to Cloudinary');
    }

    return uploadData.secure_url;
};
