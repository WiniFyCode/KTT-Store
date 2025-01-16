// Wishlist.jsx - Trang danh sách yêu thích
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash, FaRegHeart, FaTags, FaBoxOpen, FaChevronRight, FaHome } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';

const Wishlist = () => {
  const { theme } = useTheme();
  
  // Dữ liệu mẫu cho wishlist
  const sampleWishlistItems = [
    {
      id: 1,
      name: 'Áo Thun Unisex',
      price: 199000,
      image: 'https://picsum.photos/400/637',
      category: 'Áo thun',
      brand: 'Local Brand',
      color: 'Đen',
      size: 'L'
    },
    {
      id: 2,
      name: 'Quần Jean Nam Ống Suông',
      price: 399000,
      image: 'https://picsum.photos/400/638',
      category: 'Quần jean',
      brand: 'Local Brand',
      color: 'Xanh đậm',
      size: '32'
    },
    {
      id: 3,
      name: 'Áo Khoác Dù Unisex',
      price: 299000,
      image: 'https://picsum.photos/400/639',
      category: 'Áo khoác',
      brand: 'Local Brand',
      color: 'Đen',
      size: 'XL'
    },
    {
      id: 4,
      name: 'Áo Polo Nam',
      price: 249000,
      image: 'https://picsum.photos/400/640',
      category: 'Áo polo',
      brand: 'Local Brand',
      color: 'Trắng',
      size: 'M'
    }
  ];

  // Khởi tạo state với dữ liệu mẫu
  const [wishlistItems, setWishlistItems] = useState([]);

  // Khởi tạo dữ liệu mẫu khi component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (!savedWishlist || JSON.parse(savedWishlist).length === 0) {
      setWishlistItems(sampleWishlistItems);
      localStorage.setItem('wishlist', JSON.stringify(sampleWishlistItems));
    } else {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Cập nhật localStorage khi wishlist thay đổi
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Xóa sản phẩm khỏi danh sách yêu thích
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={`min-h-screen ${
      theme === 'tet' 
        ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <PageBanner
        theme={theme}
        icon={FaHeart}
        title={theme === 'tet' ? 'Danh Sách Yêu Thích Tết' : 'Danh Sách Yêu Thích'}
        breadcrumbText="Danh sách yêu thích"
        extraContent={
          <div className="flex items-center justify-center gap-3 text-xl text-white/90">
            <FaRegHeart className="w-6 h-6" />
            <p>
              {wishlistItems.length} sản phẩm trong danh sách của bạn
            </p>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className={`text-center py-20 px-6 rounded-3xl ${
            theme === 'tet' 
              ? 'bg-white shadow-red-100/50' 
              : 'bg-white shadow-blue-100/50'
          } shadow-xl backdrop-blur-sm bg-opacity-60`}>
            <div className={`w-24 h-24 mx-auto mb-8 animate-bounce ${
              theme === 'tet' ? 'text-red-300' : 'text-blue-300'
            }`}>
              <FaBoxOpen className="w-full h-full" />
            </div>
            <p className="text-gray-500 text-xl mb-8">Danh sách yêu thích của bạn đang trống</p>
            <Link
              to="/products"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-white transition-all transform hover:scale-105 hover:-translate-y-1 ${
                theme === 'tet' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-red-200' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-200'
              } shadow-lg`}
            >
              <FaTags className="w-5 h-5" />
              <span>Khám phá sản phẩm</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
                  theme === 'tet' ? 'hover:shadow-red-100/50' : 'hover:shadow-blue-100/50'
                }`}
              >
                {/* Ảnh sản phẩm */}
                <Link to={`/products/${item.id}`} className="block relative pt-[100%] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    theme === 'tet' 
                      ? 'bg-gradient-to-t from-red-900/20 to-transparent' 
                      : 'bg-gradient-to-t from-blue-900/20 to-transparent'
                  }`} />
                </Link>

                {/* Thông tin sản phẩm */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      theme === 'tet' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.category}
                    </div>
                    <Link
                      to={`/products/${item.id}`}
                      className={`block text-xl font-bold line-clamp-2 hover:underline decoration-2 underline-offset-2 ${
                        theme === 'tet' ? 'hover:text-red-600' : 'hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-500">
                      <span className="font-medium mr-2">Màu sắc:</span>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block w-4 h-4 rounded-full border ${
                          item.color.toLowerCase() === 'trắng' ? 'bg-white border-gray-300' :
                          item.color.toLowerCase() === 'đen' ? 'bg-black' :
                          item.color.toLowerCase() === 'xanh đậm' ? 'bg-blue-800' :
                          'bg-gray-500'
                        }`} />
                        {item.color}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="font-medium mr-2">Size:</span>
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        theme === 'tet' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        {item.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <p className={`text-2xl font-bold ${
                      theme === 'tet' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {formatPrice(item.price)}đ
                    </p>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      theme === 'tet' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.brand}
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {/* Thêm vào giỏ hàng */}}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-medium transition-all transform hover:scale-105 ${
                        theme === 'tet' 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                      }`}
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      <span>Thêm vào giỏ</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className={`p-3 rounded-2xl transition-all transform hover:scale-105 ${
                        theme === 'tet'
                          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                          : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      <FaTrash className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
