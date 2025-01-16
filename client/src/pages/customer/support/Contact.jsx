import React, { useState } from 'react';
import { useTheme } from '../../../contexts/CustomerThemeContext';
import PageBanner from '../../../components/PageBanner';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookMessenger, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      title: 'Hotline',
      content: '1900 xxxx\n0123 456 789',
      action: 'tel:1900xxxx'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'support@kttstore.com\ninfo@kttstore.com',
      action: 'mailto:support@kttstore.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ\nTP. Hồ Chí Minh',
      action: 'https://maps.google.com'
    },
    {
      icon: <FaFacebookMessenger />,
      title: 'Facebook',
      content: 'fb.com/kttstore\nNhắn tin trực tiếp 24/7',
      action: 'https://m.me/kttstore'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    toast.success('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

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
          title="Liên hệ"
          description="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
          className={theme === 'tet' ? 'bg-red-500' : 'bg-blue-500'}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.action}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm ${
                  theme === 'tet'
                    ? 'bg-white/90 hover:bg-red-50/90'
                    : 'bg-white/90 hover:bg-blue-50/90'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  theme === 'tet'
                    ? 'bg-red-100 text-red-500'
                    : 'bg-blue-100 text-blue-500'
                }`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </a>
            ))}
          </div>

          {/* Working Hours */}
          <div className={`p-6 rounded-2xl mb-12 ${
            theme === 'tet'
              ? 'bg-red-50'
              : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <FaClock className={
                theme === 'tet' ? 'text-red-500' : 'text-blue-500'
              } />
              <h3 className="text-xl font-bold">Giờ làm việc</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <p className="font-medium">Thứ 2 - Thứ 6:</p>
                <p>8:00 - 21:00</p>
              </div>
              <div>
                <p className="font-medium">Thứ 7 - Chủ nhật:</p>
                <p>9:00 - 21:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-2xl ${
            theme === 'tet'
              ? 'bg-white/80'
              : 'bg-white/80'
          }`}>
            <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                    placeholder="Nhập chủ đề"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                  placeholder="Nhập nội dung tin nhắn"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-medium text-white transition-colors ${
                    theme === 'tet'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
