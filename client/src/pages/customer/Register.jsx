// Register.jsx - Trang đăng ký
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaUserAlt, FaEnvelope, FaPhone, FaVenusMars, FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axios'

const Register = () => {
  // State cho form đăng ký
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sex: 'Nam', // Mặc định là Nam
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    // Kiểm tra đồng ý điều khoản
    if (!formData.agreeToTerms) {
      toast.error('Vui lòng đồng ý với điều khoản sử dụng')
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/api/auth/customer/register', {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        sex: formData.sex
      })

      toast.success('Đăng ký thành công!')
      navigate('/login')
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl w-full flex rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm relative z-10">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-600">Điền thông tin của bạn để bắt đầu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Họ tên */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserAlt className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                placeholder="Họ và tên"
              />
            </div>

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
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                placeholder="Email"
              />
            </div>

            {/* Số điện thoại */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                placeholder="Số điện thoại"
              />
            </div>

            {/* Giới tính */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaVenusMars className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
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
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
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

            {/* Xác nhận mật khẩu */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                placeholder="Xác nhận mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Điều khoản */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với{' '}
                <Link to="/policy" className="font-medium text-indigo-600 hover:text-indigo-500">
                  điều khoản sử dụng
                </Link>
              </label>
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform transition-transform duration-200 hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng ký...
                </div>
              ) : 'Đăng ký'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toast.info('Tính năng đang phát triển')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:scale-[1.02]"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={() => toast.info('Tính năng đang phát triển')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:scale-[1.02]"
              >
                <FaFacebook className="h-5 w-5 text-blue-600 mr-2" />
                Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </div>

        {/* Right side - Introduction */}
        <div className="hidden lg:block w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-r-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Chào mừng bạn đến với KTT Store
              </h2>
              <p className="text-indigo-100 mb-8">
                Tạo tài khoản để trải nghiệm mua sắm tuyệt vời cùng chúng tôi
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  ✓
                </span>
                <span>Miễn phí vận chuyển cho đơn hàng từ 500K</span>
              </div>
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  ✓
                </span>
                <span>Tích điểm đổi quà hấp dẫn</span>
              </div>
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  ✓
                </span>
                <span>Ưu đãi độc quyền cho thành viên</span>
              </div>
            </div>
          </div>
          {/* Decorative pattern */}
          <div className="absolute bottom-0 left-0 transform translate-y-1/2 -translate-x-1/2">
            <div className="w-64 h-64 border-8 border-indigo-400/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
