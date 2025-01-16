// NotFound.jsx - Trang 404 Not Found
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Hình ảnh 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-indigo-600 animate-bounce">404</div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-indigo-100 rounded-full opacity-50 animate-ping"></div>
            </div>
            <div className="relative z-10">
              <svg className="mx-auto h-32 w-32 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Thông báo lỗi */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Trang không tồn tại
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Các nút điều hướng */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            <FaHome className="mr-2" />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
        </div>

        {/* Gợi ý liên hệ */}
        <p className="mt-8 text-sm text-gray-500">
          Nếu bạn cho rằng đây là lỗi, vui lòng{' '}
          <Link to="/support/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
            liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
