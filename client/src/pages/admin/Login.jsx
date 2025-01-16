import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BsShop } from "react-icons/bs";

// Component trang đăng nhập cho Admin
const Login = () => {
   // State để lưu thông tin đăng nhập
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false
   });

   // State để hiển thị lỗi và loading
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();

   // Hàm xử lý khi người dùng nhập liệu
   const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({
         ...formData,
         [e.target.name]: value
      });
   };

   // Hàm xử lý đăng nhập
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
         const response = await axios.post('http://localhost:5000/api/auth/admin/login', formData);
         // Lưu token vào localStorage
         localStorage.setItem('adminToken', response.data.token);
         if (formData.rememberMe) {
            localStorage.setItem('adminEmail', formData.email);
         } else {
            localStorage.removeItem('adminEmail');
         }
         // Chuyển hướng đến trang dashboard
         navigate('/admin/dashboard');
      } catch (err) {
         setError(err.response?.data?.message || 'Đăng nhập thất bại');
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
               ĐĂNG NHẬP ADMIN
            </h2>
            <p className="mt-2 text-center text-lg text-gray-600">
               Vui lòng đăng nhập để tiếp tục
            </p>
            {/* Form đăng nhập */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               {error && (
                  <motion.div
                     className="p-3 rounded-md bg-red-50 text-red-500 text-base flex items-center justify-center"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                  >
                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                     </svg>
                     {error}
                  </motion.div>
               )}

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
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleChange}
                     />
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
                        className={`appearance-none block w-full pr-10 px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'
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
               </div>

               {/* Remember me checkbox */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center">
                     <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                     />
                     <label htmlFor="remember-me" className="ml-2 block text-base text-gray-900">
                        Ghi nhớ đăng nhập
                     </label>
                  </div>
               </div>

               {/* Nút đăng nhập */}
               <div>
                  <button
                     type="submit"
                     disabled={loading}
                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                  >
                     {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : null}
                     {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
               </div>

               {/* Link đăng ký và quên mật khẩu */}
               <div className="flex items-center justify-between">
                  <div className="text-base">
                     <Link to="/admin/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        Đăng ký tài khoản mới
                     </Link>
                  </div>
                  <div className="text-base">
                     <Link to="/admin/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                        Quên mật khẩu?
                     </Link>
                  </div>
               </div>
            </form>
         </motion.div>
      </div>
   );
};

export default Login;
