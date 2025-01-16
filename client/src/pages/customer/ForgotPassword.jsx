import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaKey } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axios'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: Nhập email, 2: Nhập OTP và mật khẩu mới
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  // Xử lý gửi email
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axiosInstance.post('/api/auth/customer/forgot-password', {
        email
      })

      toast.success('Mã OTP đã được gửi đến email của bạn')
      setStep(2)
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

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault()

    // Kiểm tra mật khẩu khớp nhau
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/api/auth/customer/reset-password', {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      })

      toast.success('Đặt lại mật khẩu thành công!')
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

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
            <p className="text-gray-600">
              {step === 1 
                ? 'Nhập email của bạn để nhận mã xác thực' 
                : 'Nhập mã OTP và mật khẩu mới'
              }
            </p>
          </div>

          {step === 1 ? (
            // Form nhập email
            <form onSubmit={handleSendOTP} className="space-y-6">
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
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                  placeholder="Email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </button>
            </form>
          ) : (
            // Form nhập OTP và mật khẩu mới
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                  placeholder="Nhập mã OTP"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                  placeholder="Mật khẩu mới"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/60"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* Right side - Introduction */}
        <div className="hidden lg:block w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-r-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Quên mật khẩu?
              </h2>
              <p className="text-indigo-100 mb-8">
                Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại mật khẩu một cách an toàn
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  1
                </span>
                <span>Nhập email đã đăng ký</span>
              </div>
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  2
                </span>
                <span>Nhập mã OTP được gửi đến email</span>
              </div>
              <div className="flex items-center text-indigo-100">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-4">
                  3
                </span>
                <span>Tạo mật khẩu mới an toàn</span>
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

export default ForgotPassword
