import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/CustomerThemeContext';
import PageBanner from '../../../components/PageBanner';
import { FaQuestionCircle, FaRuler, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';

const Support = () => {
  const { theme } = useTheme();

  const supportOptions = [
    {
      icon: <FaQuestionCircle className="text-4xl" />,
      title: 'Câu hỏi thường gặp',
      description: 'Tìm câu trả lời nhanh cho các câu hỏi phổ biến về sản phẩm, đơn hàng, vận chuyển và nhiều hơn nữa.',
      link: '/support/faq',
      linkText: 'Xem FAQ'
    },
    {
      icon: <FaRuler className="text-4xl" />,
      title: 'Hướng dẫn chọn size',
      description: 'Tìm size phù hợp với bạn thông qua bảng size chi tiết và công cụ tính size thông minh.',
      link: '/support/size-guide',
      linkText: 'Chọn size'
    },
    {
      icon: <FaPhoneAlt className="text-4xl" />,
      title: 'Liên hệ với chúng tôi',
      description: 'Gặp khó khăn? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.',
      link: '/support/contact',
      linkText: 'Liên hệ ngay'
    }
  ];

  return (
    <div className={`min-h-screen relative ${
      theme === 'tet'
        ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circles */}
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 ${
          theme === 'tet' ? 'bg-red-300' : 'bg-blue-300'
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20 ${
          theme === 'tet' ? 'bg-yellow-300' : 'bg-purple-300'
        }`} />
        
        {/* Floating elements */}
        {theme === 'tet' ? (
          <>
            <div className="absolute top-1/4 left-10 w-4 h-4 bg-red-400 rounded-full animate-float-slow" />
            <div className="absolute top-1/3 right-12 w-3 h-3 bg-yellow-400 rounded-full animate-float-slower" />
            <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-float" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400 rounded-full animate-float-slow" />
            <div className="absolute top-1/3 right-12 w-3 h-3 bg-indigo-400 rounded-full animate-float-slower" />
            <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float" />
          </>
        )}
      </div>

      <div className="relative">
        <PageBanner 
          title="Trung tâm hỗ trợ"
          description="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
        />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm ${
                  theme === 'tet'
                    ? 'bg-white/90 hover:bg-red-50/90'
                    : 'bg-white/90 hover:bg-blue-50/90'
                }`}
              >
                <div className={`mb-4 ${
                  theme === 'tet' ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <Link
                  to={option.link}
                  className={`inline-flex items-center gap-2 font-medium ${
                    theme === 'tet'
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                >
                  <span>{option.linkText}</span>
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Contact */}
          <div className={`mt-12 p-8 rounded-2xl text-center ${
            theme === 'tet'
              ? 'bg-red-50'
              : 'bg-blue-50'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ ngay?</h2>
            <p className="text-gray-600 mb-6">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:1900xxxx"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  theme === 'tet'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <FaPhoneAlt />
                <span>1900 xxxx</span>
              </a>
              <Link
                to="/support/contact"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  theme === 'tet'
                    ? 'bg-white hover:bg-red-50 text-red-500'
                    : 'bg-white hover:bg-blue-50 text-blue-500'
                }`}
              >
                <span>Gửi tin nhắn</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
