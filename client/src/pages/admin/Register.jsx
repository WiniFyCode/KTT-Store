import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { BsShop } from "react-icons/bs";
import { motion } from 'framer-motion';

// Component trang đăng ký cho Admin
const Register = () => {
  // State để lưu thông tin đăng ký
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // State để lưu trạng thái lỗi cho từng trường
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // State cho loading và hiển thị mật khẩu
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hàm kiểm tra dữ liệu nhập vào
  const validateInput = (name, value) => {
    // Xóa thông báo lỗi cũ
    let newError = '';

    // Kiểm tra từng trường hợp
    if (value.trim() === '') {
      newError = 'Vui lòng không để trống trường này';
    } else {
      switch (name) {
        case 'username':
          if (value.length < 3) {
            newError = 'Tên người dùng phải có ít nhất 3 ký tự';
          }
          break;

        case 'email':
          if (!value.includes('@')) {
            newError = 'Email không hợp lệ';
          }
          break;

        case 'phone':
          if (!/^[0-9]{10}$/.test(value)) {
            newError = 'Số điện thoại phải có 10 chữ số';
          }
          break;

        case 'password':
          if (value.length < 6) {
            newError = 'Mật khẩu phải có ít nhất 6 ký tự';
          }
          break;

        case 'confirmPassword':
          if (value !== formData.password) {
            newError = 'Mật khẩu không khớp';
          }
          break;
      }
    }

    return newError;
  };

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật giá trị form
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Kiểm tra và cập nhật lỗi
    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Nếu đang nhập mật khẩu, kiểm tra lại trường xác nhận mật khẩu
    if (name === 'password') {
      const confirmError = formData.confirmPassword ?
        (value === formData.confirmPassword ? '' : 'Mật khẩu không khớp') : '';
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  // Hàm kiểm tra form trước khi gửi
  const isFormValid = () => {
    // Kiểm tra tất cả các trường
    const newErrors = {};
    let isValid = true;

    // Kiểm tra từng trường trong form
    Object.keys(formData).forEach(field => {
      const error = validateInput(field, formData[field]);
      newErrors[field] = error;
      if (error) {
        isValid = false;
      }
    });

    // Cập nhật state lỗi
    setErrors(newErrors);
    return isValid;
  };

  // Hàm xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra form trước khi gửi
    if (!isFormValid()) {
      setError('Vui lòng điền đầy đủ thông tin và sửa các lỗi');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await axios.post('http://localhost:5000/api/admins/register', submitData);
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo và Header */}
        <div className="logo-container">
          <BsShop className="logo-icon text-4xl" />
          <h1 className="text-4xl font-bold text-center logo-text">
            KTT STORE
          </h1>
          <div className="logo-shine" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          ĐĂNG KÍ ADMIN
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Điền thông tin để tạo admin mới
        </p>
        {/* Form đăng ký */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="p-4 rounded-md bg-red-50 text-red-700 text-base flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}

          {/* Input tên người dùng */}
          <div>
            <label htmlFor="username" className="block text-base font-medium text-gray-700">
              Tên người dùng
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`appearance-none block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base`}
                placeholder="Nhập tên người dùng"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-base text-red-600">{errors.username}</p>
              )}
            </div>
          </div>

          {/* Input email */}
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base`}
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-base text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Input số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-base font-medium text-gray-700">
              Số điện thoại
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`appearance-none block w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base`}
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="mt-1 text-base text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Input mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className={`appearance-none block w-full pr-10 px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="group relative h-full px-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 transition-colors duration-200" />
                  ) : (
                    <FiEye className="h-5 w-5 transition-colors duration-200" />
                  )}
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                    {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </span>
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-base text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Input xác nhận mật khẩu */}
          <div>
            <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className={`appearance-none block w-full pr-10 px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="group relative h-full px-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 transition-colors duration-200" />
                  ) : (
                    <FiEye className="h-5 w-5 transition-colors duration-200" />
                  )}
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                    {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </span>
                </button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-base text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Nút đăng ký */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>

          {/* Link đăng nhập */}
          <div className="text-base text-center">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link to="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
