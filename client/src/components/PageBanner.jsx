// PageBanner.jsx - Component banner cho các trang
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useTheme } from '../contexts/CustomerThemeContext';

const PageBanner = ({ 
  icon: Icon,
  title, 
  subtitle,
  breadcrumbText,
  extraContent 
}) => {
  const { theme } = useTheme();
  const location = useLocation();

  // Tạo breadcrumb từ current path
  const getBreadcrumbs = () => {
    // Bỏ qua ký tự "/" đầu tiên và split path thành array
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Object map các path segment sang tên hiển thị
    const pathNames = {
      'products': 'Sản phẩm',
      'cart': 'Giỏ hàng',
      'checkout': 'Thanh toán',
      'order-history': 'Lịch sử đơn hàng',
      'wishlist': 'Yêu thích',
      'policy': 'Chính sách',
      'shipping': 'Vận chuyển',
      'nam': 'Nam',
      'nu': 'Nữ',
      'sale': 'Giảm giá',
      'sale-tet': 'Giảm giá Tết',
      'new-arrivals': 'Hàng mới về',
      'tet-collection': 'Thời trang Tết',
      'tet': 'Thời trang Tết',
      'news': 'Tin tức',
      'return': 'Đổi trả',
      'orders': 'Đơn hàng',
      'payment': 'Thanh toán',
      'support': 'Hỗ trợ',
      'about': 'Giới thiệu',
      'connect': 'Liên hệ',
      'faq': 'FAQ',
      'profile': 'Tài khoản',
      'size-guide': 'Hướng dẫn chọn size',
      'contact': 'Liên hệ',
      'promotion': 'Khuyến mãi'
    };

    // Tạo mảng breadcrumbs với path và label
    const breadcrumbs = pathSegments.map((segment, index) => {
      // Tạo full path cho segment này
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      // Lấy tên hiển thị từ map hoặc dùng segment gốc nếu không có trong map
      const label = pathNames[segment] || segment;

      return { path, label };
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="relative">
      {/* Banner chính */}
      <div className={`relative overflow-hidden ${
        theme === 'tet' 
          ? 'bg-gradient-to-r from-red-500/90 via-orange-500/90 to-yellow-500/90' 
          : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700'
      }`}>
        {/* Decorative background */}
        <div className="absolute inset-0">
          {/* Grid pattern - Tạo họa tiết lưới nhỏ */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMiAyaDJ2MkgyeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
          
          {/* Animated blobs - Hiệu ứng blob chuyển động */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Blob 1 - Góc trên bên trái */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full">
              <div className="absolute w-[800px] h-[800px] mix-blend-overlay opacity-30 animate-blob">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 blur-2xl transform-gpu" />
              </div>
            </div>
            {/* Blob 2 - Góc dưới bên phải */}
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full">
              <div className="absolute w-[800px] h-[800px] mix-blend-overlay opacity-30 animate-blob animation-delay-2000">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-purple-300 blur-2xl transform-gpu" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            {Icon && (
              <div className="flex items-center justify-center mb-4">
                <Icon className="w-16 h-16 text-white/90" />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xl text-white/90">
                {subtitle}
              </p>
            )}

            {/* Extra content nếu cần */}
            {extraContent}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-[#F8FAFC]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </div>

      {/* Breadcrumb - Đặt ở dưới banner và nổi lên trên wave */}
      <div className="container mx-auto px-4">
        <div className={`relative -mt-6 mb-8 inline-flex items-center gap-2 text-lg px-6 py-2 rounded-full shadow-lg backdrop-blur-sm ${
          theme === 'tet'
            ? 'bg-white/80 text-red-600'
            : 'bg-white/80 text-gray-600'
        }`}>
          <Link to="/" className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <FaHome className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <FaChevronRight className="w-3 h-3 opacity-50" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium">{crumb.label}</span>
              ) : (
                <Link 
                  to={crumb.path}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
