// Login.jsx - Trang đăng nhập
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axios'
import { useTheme } from '../../contexts/CustomerThemeContext'

const Login = () => {
  // State cho form đăng nhập
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('api/auth/login', {
        email: formData.email,
        password: formData.password
      })

      // Lưu token và thông tin user
      const { token, user } = response.data
      localStorage.setItem('customerToken', token)
      localStorage.setItem('customerInfo', JSON.stringify(user))
      
      // Dispatch event để thông báo thay đổi auth
      window.dispatchEvent(new Event('authChange'))
      
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
      }
    } finally {
      setLoading(false)
    }
  }

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

      <div className="max-w-4xl w-full flex rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm relative z-10">
        {/* Left side - Image */}
        <div className={`hidden lg:block w-1/2 p-12 rounded-l-2xl relative overflow-hidden ${
          theme === 'tet'
            ? 'bg-gradient-to-br from-red-600 to-orange-600'
            : 'bg-gradient-to-br from-indigo-600 to-purple-600'
        }`}>
          <div className={`absolute inset-0 ${
            theme === 'tet'
              ? 'bg-gradient-to-br from-red-600/90 to-orange-600/90'
              : 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90'
          }`}></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                {theme === 'tet' ? 'Chào Mừng Năm Mới!' : 'Chào mừng trở lại!'}
              </h2>
              <p className={`${theme === 'tet' ? 'text-orange-100' : 'text-indigo-100'} mb-8`}>
                Đăng nhập để tiếp tục mua sắm và nhận nhiều ưu đãi hấp dẫn
              </p>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center ${theme === 'tet' ? 'text-orange-100' : 'text-indigo-100'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  theme === 'tet' ? 'bg-orange-500/30' : 'bg-indigo-500/30'
                }`}>
                  ✓
                </span>
                <span>Miễn phí vận chuyển cho đơn hàng từ 500K</span>
              </div>
              <div className={`flex items-center ${theme === 'tet' ? 'text-orange-100' : 'text-indigo-100'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  theme === 'tet' ? 'bg-orange-500/30' : 'bg-indigo-500/30'
                }`}>
                  ✓
                </span>
                <span>Tích điểm đổi quà hấp dẫn</span>
              </div>
              <div className={`flex items-center ${theme === 'tet' ? 'text-orange-100' : 'text-indigo-100'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  theme === 'tet' ? 'bg-orange-500/30' : 'bg-indigo-500/30'
                }`}>
                  ✓
                </span>
                <span>Ưu đãi độc quyền cho thành viên</span>
              </div>
            </div>
          </div>
          {/* Decorative pattern */}
          <div className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2">
            <div className={`w-64 h-64 border-8 rounded-full ${
              theme === 'tet' ? 'border-orange-400/30' : 'border-indigo-400/30'
            }`}></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-600">Nhập thông tin tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  theme === 'tet'
                    ? 'focus:ring-red-500'
                    : 'focus:ring-indigo-500'
                } focus:border-transparent bg-white/60`}
                placeholder="Email"
              />
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  theme === 'tet'
                    ? 'focus:ring-red-500'
                    : 'focus:ring-indigo-500'
                } focus:border-transparent bg-white/60`}
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={`h-4 w-4 focus:ring-offset-2 border-gray-300 rounded ${
                    theme === 'tet'
                      ? 'text-red-600 focus:ring-red-500'
                      : 'text-indigo-600 focus:ring-indigo-500'
                  }`}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className={`font-medium hover:opacity-80 ${
                  theme === 'tet'
                    ? 'text-red-600 hover:text-red-500'
                    : 'text-indigo-600 hover:text-indigo-500'
                }`}>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                theme === 'tet'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
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
                  Đang đăng nhập...
                </div>
              ) : 'Đăng nhập'}
            </button>

            {/* Đăng ký */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className={`font-medium hover:opacity-80 ${
                  theme === 'tet'
                    ? 'text-red-600 hover:text-red-500'
                    : 'text-indigo-600 hover:text-indigo-500'
                }`}>
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login
