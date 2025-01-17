// ForgotPassword.jsx - Trang quên mật khẩu
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { useTheme } from '../../contexts/CustomerThemeContext';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Xử lý gửi email reset mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('api/auth/forgot-password', {
        email
      });

      setEmailSent(true);
      toast.success('Link đặt lại mật khẩu đã được gửi đến email của bạn!');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'tet' 
        ? 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100'
        : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'
    } flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Decorative circles */}
      <div className={`absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob ${
        theme === 'tet' ? 'bg-red-200' : 'bg-purple-200'
      }`}></div>
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 ${
        theme === 'tet' ? 'bg-orange-200' : 'bg-yellow-200'
      }`}></div>
      <div className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 ${
        theme === 'tet' ? 'bg-yellow-200' : 'bg-pink-200'
      }`}></div>

      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl relative z-10">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-center text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        {emailSent ? (
          <div className="text-center space-y-6">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              theme === 'tet' ? 'bg-red-100' : 'bg-indigo-100'
            }`}>
              <svg
                className={`h-6 w-6 ${theme === 'tet' ? 'text-red-600' : 'text-indigo-600'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
            </p>
            <div className="flex justify-center">
              <Link
                to="/login"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white ${
                  theme === 'tet'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-600'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === 'tet'
                    ? 'focus:ring-red-500'
                    : 'focus:ring-indigo-500'
                } transform transition-transform duration-200 hover:scale-[1.02]`}
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  theme === 'tet'
                    ? 'focus:ring-red-500'
                    : 'focus:ring-indigo-500'
                } focus:border-transparent bg-white/60`}
                placeholder="Email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                  theme === 'tet'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-600'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === 'tet'
                    ? 'focus:ring-red-500'
                    : 'focus:ring-indigo-500'
                } disabled:opacity-50 transform transition-transform duration-200 hover:scale-[1.02]`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : 'Gửi link đặt lại mật khẩu'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className={`font-medium hover:opacity-80 ${
                  theme === 'tet'
                    ? 'text-red-600 hover:text-red-500'
                    : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
