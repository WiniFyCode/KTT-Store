import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const instance = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor cho request
instance.interceptors.request.use(
    (config) => {
        // Kiểm tra URL để xác định loại token cần thêm
        const isAdminRoute = config.url.includes('/admin/');
        const token = localStorage.getItem(isAdminRoute ? 'adminToken' : 'customerToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor cho response
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi chung
        if (error.response) {
            // Lỗi từ server (status code không phải 2xx)
            switch (error.response.status) {
                case 401:
                    // Kiểm tra URL để xác định nơi chuyển hướng
                    const isAdminRoute = error.config.url.includes('/admin/');
                    if (isAdminRoute) {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('adminInfo');
                    } else {
                        localStorage.removeItem('customerToken');
                        localStorage.removeItem('customerInfo');
                    }
                    break;
                case 403:
                    console.error('Không có quyền truy cập');
                    break;
                case 404:
                    console.error('Không tìm thấy tài nguyên');
                    break;
                case 500:
                    console.error('Lỗi server');
                    break;
                default:
                    console.error('Có lỗi xảy ra');
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
