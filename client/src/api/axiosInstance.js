import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: 'http://localhost:5000/api', // URL của server backend, thay đổi nếu cần
   headers: {
      'Content-Type': 'application/json',
   },
});

export default axiosInstance;
