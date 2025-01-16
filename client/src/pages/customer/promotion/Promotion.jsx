import React from 'react';
import { useTheme } from '../../../contexts/CustomerThemeContext';
import PageBanner from '../../../components/PageBanner';
import { FaGift, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Promotion = () => {
  const { theme } = useTheme();

  const promotions = [
    {
      id: 1,
      title: 'Tết Rộn Ràng - Sale Ngập Tràn',
      description: 'Giảm giá lên đến 50% cho tất cả sản phẩm trong dịp Tết Nguyên Đán',
      startDate: '2025-01-13',
      endDate: '2025-01-14',
      type: 'Seasonal',
      discount: '50%',
      conditions: [
        'Áp dụng cho tất cả sản phẩm',
        'Không áp dụng cùng các chương trình khuyến mãi khác',
        'Số lượng có hạn'
      ],
      image: 'https://picsum.photos/400/664'
    },
    {
      id: 2,
      title: 'Sinh Nhật KTT Store',
      description: 'Mừng sinh nhật 2 năm, KTT Store gửi tặng voucher giảm giá đặc biệt',
      startDate: '2025-02-20',
      endDate: '2025-02-28',
      type: 'Event',
      discount: '30%',
      conditions: [
        'Áp dụng cho đơn hàng từ 500,000đ',
        'Mỗi khách hàng chỉ được sử dụng 1 lần',
        'Không áp dụng cho sản phẩm đã giảm giá'
      ],
      image: 'https://picsum.photos/400/665'
    },
    {
      id: 3,
      title: 'Mua Nhiều Giảm Nhiều',
      description: 'Chương trình ưu đãi dành cho khách hàng mua số lượng lớn',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      type: 'Regular',
      discount: '10-25%',
      conditions: [
        'Giảm 10% cho đơn từ 2 sản phẩm',
        'Giảm 15% cho đơn từ 3 sản phẩm',
        'Giảm 25% cho đơn từ 5 sản phẩm'
      ],
      image: 'https://picsum.photos/400/666'
    }
  ];

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
  };

  const getStatusColor = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'text-yellow-600 bg-yellow-100';
    } else if (now > end) {
      return 'text-red-600 bg-red-100';
    } else {
      return 'text-green-600 bg-green-100';
    }
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'Sắp diễn ra';
    } else if (now > end) {
      return 'Đã kết thúc';
    } else {
      return 'Đang diễn ra';
    }
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
          title="Khuyến Mãi"
          description="Các chương trình ưu đãi hấp dẫn từ KTT Store"
          className={theme === 'tet' ? 'bg-red-500' : 'bg-blue-500'}
        />

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm ${
                  theme === 'tet'
                    ? 'bg-white/90 hover:bg-red-50/90'
                    : 'bg-white/90 hover:bg-blue-50/90'
                }`}
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusColor(promo.startDate, promo.endDate)
                  }`}>
                    {getStatusText(promo.startDate, promo.endDate)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTag className={theme === 'tet' ? 'text-red-500' : 'text-blue-500'} />
                    <span className={`text-sm font-medium ${
                      theme === 'tet' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      Giảm {promo.discount}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-gray-600 mb-4">{promo.description}</p>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FaCalendarAlt />
                    <span>
                      {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                    </span>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <FaGift className={theme === 'tet' ? 'text-red-500' : 'text-blue-500'} />
                      Điều kiện áp dụng:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {promo.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className={`mt-12 p-6 rounded-2xl ${
            theme === 'tet'
              ? 'bg-red-50'
              : 'bg-blue-50'
          }`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaClock />
              Lưu ý:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Thời gian và điều kiện có thể thay đổi mà không báo trước</li>
              <li>Vui lòng đọc kỹ điều kiện áp dụng trước khi tham gia</li>
              <li>Mỗi khách hàng chỉ được áp dụng một chương trình khuyến mãi tại một thời điểm</li>
              <li>Số lượng ưu đãi có hạn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
