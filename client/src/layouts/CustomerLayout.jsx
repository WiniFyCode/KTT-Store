// CustomerLayout.jsx - Layout chung cho phần customer của website
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSun, FaMoon, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '../contexts/CustomerThemeContext';
import { toast } from 'react-toastify';

const CustomerLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items dựa theo theme - Các mục menu sẽ thay đổi dựa vào theme hiện tại (Tết hoặc bình thường)
  const menuItems = theme === 'tet' ? [
    { name: 'THỜI TRANG TẾT', path: '/tet-collection' },
    { name: 'SẢN PHẨM', path: '/products' },
    { name: 'NAM', path: '/nam' },
    { name: 'NỮ', path: '/nu' },
    { name: 'GIẢM GIÁ TẾT', path: '/sale-tet' },
    { name: 'TIN TỨC', path: '/news' },
    { name: 'GIỚI THIỆU', path: '/about' },
  ] : [
    { name: 'HÀNG MỚI VỀ', path: '/new-arrivals' },
    { name: 'SẢN PHẨM', path: '/products' },
    { name: 'NAM', path: '/nam' },
    { name: 'NỮ', path: '/nu' },
    { name: 'GIẢM GIÁ', path: '/sale' },
    { name: 'TIN TỨC', path: '/news' },
    { name: 'GIỚI THIỆU', path: '/about' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Xử lý đổi theme và chuyển trang tương ứng với theme mới
  const handleThemeToggle = () => {
    const newTheme = theme === 'tet' ? 'normal' : 'tet'; // Sửa 'default' thành 'normal' cho đồng nhất
    toggleTheme();
    
    // Chuyển trang tương ứng với theme mới
    if (location.pathname === '/new-arrivals' && newTheme === 'tet') {
      navigate('/tet-collection');
    } else if (location.pathname === '/tet-collection' && newTheme === 'normal') {
      navigate('/new-arrivals');
    } else if (location.pathname === '/sale-tet' && newTheme === 'normal') {
      navigate('/sale');
    } else if (location.pathname === '/sale' && newTheme === 'tet') {
      navigate('/sale-tet');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerInfo');
    
    // Hiển thị thông báo
    toast.success('Đăng xuất thành công!');
    
    // Chuyển về trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Phần đầu trang cố định ở trên cùng */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        theme === 'tet' ? 'bg-red-600' : 'bg-gray-900'
      }`}>
        <nav className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Logo - 20% width */}
            <div className="w-[20%] min-w-[200px]">
              <Link to="/" className="relative group inline-block">
                <div className="flex items-center">
                  {/* Logo Text */}
                  <div className="relative">
                    <span className={`text-2xl font-bold ${
                      theme === 'tet' 
                        ? 'text-yellow-400' 
                        : 'text-white'
                    } transition-all duration-300 animate-pulse-slow`}>
                      KTT
                    </span>
                    <span className={`ml-2 text-2xl font-light ${
                      theme === 'tet'
                        ? 'text-white'
                        : 'text-gray-300'
                    } transition-all duration-300`}>
                      Store
                    </span>

                    {/* Glow Effect */}
                    <div className={`absolute inset-0 opacity-75 ${
                      theme === 'tet'
                        ? 'animate-glow-gold'
                        : 'animate-glow-blue'
                    }`} />

                    {/* Sparkles */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-sparkle-1" />
                      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-sparkle-2" />
                      <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-white rounded-full animate-sparkle-3" />
                    </div>

                    {/* Glowing Border */}
                    <div className={`absolute -inset-0.5 opacity-0 ${
                      theme === 'tet'
                        ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400'
                        : 'bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400'
                    } rounded-lg blur animate-border-glow`} />

                    {/* Glowing Dot */}
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      theme === 'tet'
                        ? 'bg-yellow-400'
                        : 'bg-blue-400'
                    } transition-all duration-300 animate-ping`} />
                  </div>

                  {/* Theme-based Decoration */}
                  {theme === 'tet' && (
                    <>
                      {/* Mai Flower */}
                      <div className="absolute -top-3 -right-6 text-yellow-400 animate-bounce-slow">
                        ✿
                      </div>
                      {/* Red Envelope */}
                      <div className="absolute -bottom-2 -right-4 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                        🧧
                      </div>
                    </>
                  )}
                </div>

                {/* Tooltip */}
                <div className={`absolute ml-4 -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  theme === 'tet'
                    ? 'bg-yellow-400 text-red-700'
                    : 'bg-blue-500 text-white'
                } opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}>
                  {theme === 'tet' ? 'Chúc Mừng Năm Mới' : 'Welcome to KTT Store'}
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes size={24} className="text-white" /> : <FaBars size={24} className="text-white" />}
            </button>

            {/* Desktop Navigation - 50% width */}
            <div className="hidden md:flex items-center justify-center space-x-8 w-[50%]">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`whitespace-nowrap hover:text-white/80 transition-colors ${
                    location.pathname === item.path
                      ? theme === 'tet'
                        ? 'text-yellow-300 font-semibold'
                        : 'text-blue-400 font-semibold'
                      : theme === 'tet'
                        ? 'text-yellow-400'
                        : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Icons - 30% width */}
            <div className="hidden md:flex items-center justify-end space-x-4 w-[30%] min-w-[300px]">
              {/* Search with dropdown */}
              <div className="relative group">
                <button className="text-white hover:opacity-80 transition-opacity p-2">
                  <FaSearch size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Wishlist with counter */}
              <Link
                to="/wishlist"
                className="relative group p-2"
              >
                <FaHeart size={20} className={`${theme === 'tet' ? 'text-yellow-400' : 'text-white'} hover:opacity-80 transition-opacity`} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">0</span>
              </Link>

              {/* Cart with counter */}
              <Link
                to="/cart"
                className="relative group p-2"
              >
                <FaShoppingCart size={20} className={`${theme === 'tet' ? 'text-yellow-400' : 'text-white'} hover:opacity-80 transition-opacity`} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">0</span>
              </Link>

              {/* Profile with dropdown */}
              <div className="relative group">
                <button className={`p-2 hover:opacity-80 transition-opacity ${theme === 'tet' ? 'text-yellow-400' : 'text-white'}`}>
                  <FaUser size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Tài khoản của tôi</Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Đơn hàng</Link>
                    <div className="border-t border-gray-200"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme toggle */}
              <button
                onClick={handleThemeToggle}
                className={`px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                  theme === 'tet'
                    ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {theme === 'tet' ? '🎋 Chế độ thường' : '🧧 Chế độ Tết'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? 'opacity-100 visible'
                : 'opacity-0 invisible pointer-events-none'
            }`}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>

            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span className={`text-2xl font-bold ${
                  theme === 'tet' 
                    ? 'text-yellow-400' 
                    : 'text-white'
                }`}>
                  KTT
                </span>
                <span className="ml-2 text-2xl font-light text-white">
                  Store
                </span>
              </Link>
            </div>

            <div className="h-[calc(100vh-80px)] overflow-y-auto">
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full px-4 py-2 pl-10 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              {/* Main Menu */}
              <div className="p-4 space-y-2">
                <div className="text-sm font-medium text-gray-400 uppercase mb-2">Menu</div>
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? theme === 'tet'
                          ? 'bg-red-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Actions */}
              <div className="p-4 border-t border-white/10">
                <div className="text-sm font-medium text-gray-400 uppercase mb-2">Tài khoản</div>
                <div className="space-y-2">
                  <Link 
                    to="/profile"
                    className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-3" size={16} />
                    <span>Tài khoản của tôi</span>
                  </Link>
                  <Link 
                    to="/orders"
                    className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaClipboardList className="mr-3" size={16} />
                    <span>Đơn hàng</span>
                  </Link>
                  <Link 
                    to="/wishlist"
                    className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative mr-3">
                      <FaHeart size={16} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">0</span>
                    </div>
                    <span>Yêu thích</span>
                  </Link>
                  <Link 
                    to="/cart"
                    className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative mr-3">
                      <FaShoppingCart size={16} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">0</span>
                    </div>
                    <span>Giỏ hàng</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaUser className="mr-3" size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={(e) => {
                    handleThemeToggle();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    theme === 'tet'
                      ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {theme === 'tet' ? (
                    <>
                      <FaSun className="mr-2" size={16} />
                      🎋 Chế độ thường
                    </>
                  ) : (
                    <>
                      <FaMoon className="mr-2" size={16} />
                      🧧 Chế độ Tết
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`${theme === 'tet' ? 'bg-red-900' : 'bg-gray-900'} text-white py-8`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Thông tin cửa hàng */}
            <div>
              <h3 className="text-lg font-bold mb-4">KTT STORE</h3>
              <p className="text-sm text-gray-300 mb-2">Địa chỉ: 123 Đường ABC, Quận XYZ</p>
              <p className="text-sm text-gray-300 mb-2">Điện thoại: (123) 456-7890</p>
              <p className="text-sm text-gray-300">Email: contact@kttstore.com</p>
            </div>

            {/* Footer Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Chính sách</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/policy" className="text-gray-300 hover:text-white transition-colors">
                    Tất cả chính sách
                  </Link>
                </li>
                <li>
                  <Link to="/policy/shipping" className="text-gray-300 hover:text-white transition-colors">
                    Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link to="/policy/return" className="text-gray-300 hover:text-white transition-colors">
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link to="/policy/payment" className="text-gray-300 hover:text-white transition-colors">
                    Chính sách thanh toán
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Hỗ trợ khách hàng</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/support" className="text-gray-300 hover:text-white transition-colors">
                    Trung tâm hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link to="/support/faq" className="text-gray-300 hover:text-white transition-colors">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link to="/support/size-guide" className="text-gray-300 hover:text-white transition-colors">
                    Hướng dẫn chọn size
                  </Link>
                </li>
                <li>
                  <Link to="/support/contact" className="text-gray-300 hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/connect" className="text-gray-300 hover:text-white transition-colors">
                  Tất cả kênh kết nối
                </Link>
                <div className="flex space-x-6 mt-2">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transform transition-all duration-300 hover:scale-110 text-gray-300 hover:text-[#1877F2]"
                  >
                    <FaFacebook className="text-2xl" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transform transition-all duration-300 hover:scale-110 text-gray-300 hover:text-[#E4405F]"
                  >
                    <FaInstagram className="text-2xl" />
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transform transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white"
                  >
                    <FaTiktok className="text-2xl" />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="transform transition-all duration-300 hover:scale-110 text-gray-300 hover:text-[#FF0000]"
                  >
                    <FaYoutube className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 KTT Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
