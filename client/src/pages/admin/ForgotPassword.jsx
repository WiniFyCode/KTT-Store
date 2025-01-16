import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsShop } from "react-icons/bs";
import axios from 'axios';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    // State để lưu email và trạng thái
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Hàm xử lý gửi yêu cầu reset mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/admins/forgot-password', { email });
            setStatus({
                type: 'success',
                message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.'
            });
            // Reset form
            setEmail('');
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
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
                    Quên mật khẩu
                </h2>
                <p className="mt-2 text-center text-lg text-gray-600">
                    Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
                </p>

                {/* Form quên mật khẩu */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Hiển thị thông báo */}
                    {status.message && (
                        <motion.div
                            className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                } text-base flex items-center justify-center`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <svg
                                className={`w-5 h-5 mr-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                {status.type === 'success' ? (
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                )}
                            </svg>
                            {status.message}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Nút gửi */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </button>
                    </div>

                    {/* Link quay lại đăng nhập */}
                    <div className="text-base text-center">
                        <Link
                            to="/admin/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
