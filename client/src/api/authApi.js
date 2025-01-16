import axiosInstance from './axiosInstance';

// API dành cho Admin
export const loginAdmin = async (data) => {
   return await axiosInstance.post('/admins/login', data);
};

export const registerAdmin = async (data) => {
   return await axiosInstance.post('/admins/register', data);
};
