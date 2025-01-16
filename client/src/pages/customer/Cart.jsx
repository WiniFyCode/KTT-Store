// Cart.jsx - Trang giỏ hàng
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowRight, FaGift, FaTimes, FaChevronRight, FaHome } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Cart = () => {
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo thun nam",
      price: 250000,
      image: "https://picsum.photos/200/300",
      size: "L",
      color: "Trắng",
      quantity: 2,
      note: ""
    },
    {
      id: 2,
      name: "Quần jean nam",
      price: 450000,
      image: "https://picsum.photos/200/300",
      size: "32",
      color: "Xanh đậm",
      quantity: 1,
      note: ""
    },
    {
      id: 3,
      name: "Áo thun nam",
      price: 250000,
      image: "https://picsum.photos/200/300",
      size: "L",
      color: "Trắng",
      quantity: 2,
      note: ""
    },
    {
      id: 4,
      name: "Quần jean nam",
      price: 450000,
      image: "https://picsum.photos/200/300",
      size: "32",
      color: "Xanh đậm",
      quantity: 1,
      note: ""
    },
    {
      id: 6,
      name: "Áo thun nam",
      price: 250000,
      image: "https://picsum.photos/200/300",
      size: "L",
      color: "Trắng",
      quantity: 2,
      note: ""
    },
    {
      id: 7,
      name: "Quần jean nam",
      price: 450000,
      image: "https://picsum.photos/200/300",
      size: "32",
      color: "Xanh đậm",
      quantity: 1,
      note: ""
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestedProducts] = useState([...Array(8)].map((_, index) => ({
    id: 1 + index,
    name: "Sản phẩm gợi ý " + (index + 1),
    price: 250000 + index * 50000,
    image: "https://picsum.photos/200/300",
  })));

  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewPosition, setQuickViewPosition] = useState({ x: 0, y: 0 });
  const [swiperRef, setSwiperRef] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = total - discount;

  // Thay đổi số lượng
  const updateQuantity = async (id, change) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Loading effect

    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
    setLoading(false);
  };

  // Xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Cập nhật ghi chú
  const updateNote = (id, note) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, note };
      }
      return item;
    }));
  };

  // Áp dụng mã giảm giá
  const applyCoupon = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Giả lập kiểm tra mã giảm giá
    if (couponCode.toUpperCase() === 'SALE10') {
      setDiscount(total * 0.1);
    } else if (couponCode.toUpperCase() === 'SALE20') {
      setDiscount(total * 0.2);
    } else if (couponCode.toUpperCase() === 'SALE100') {
      setDiscount(total * 1);
    } else {
      alert('Mã giảm giá không hợp lệ!');
      setDiscount(0);
    }
    setLoading(false);
  };

  // Xử lý click vào sản phẩm
  const handleProductClick = (product, event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.left, window.innerWidth - 340);
    const y = Math.min(rect.top, window.innerHeight - 400);
    setQuickViewPosition({ x, y });
    setHoveredProduct(product);
    if (swiperRef) {
      swiperRef.autoplay.stop();
    }
  };

  // Xử lý khi ẩn quick view
  const handleCloseQuickView = () => {
    setHoveredProduct(null);
    if (swiperRef) {
      swiperRef.autoplay.start();
    }
  };

  // Thêm vào giỏ hàng từ quick view
  const addToCartFromQuickView = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }
    if (!selectedColor) {
      alert('Vui lòng chọn màu sắc');
      return;
    }

    const newItem = {
      id: hoveredProduct.id,
      name: hoveredProduct.name,
      price: hoveredProduct.price,
      image: hoveredProduct.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      note: ''
    };

    setCartItems([...cartItems, newItem]);
    handleCloseQuickView();
    // Reset state
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  return (
    <div className={`min-h-screen ${theme === 'tet' ? 'bg-red-50' : 'bg-gray-50'}`}>
      <PageBanner
        theme={theme}
        icon={FaShoppingCart}
        title={theme === 'tet' ? 'Giỏ Hàng Tết' : 'Giỏ Hàng'}
        subtitle={`${cartItems.length} sản phẩm trong giỏ hàng của bạn`}
        breadcrumbText="Giỏ hàng"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div 
                key={item.id} 
                className={`${theme === 'tet' ? 'bg-white ring-1 ring-red-100' : 'bg-white shadow-sm'} rounded-lg p-6 transform transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Size: {item.size} | Màu: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                          theme === 'tet'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className={`p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                            theme === 'tet'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <FaMinus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-600 w-8 text-center">
                          {loading ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className={`p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                            theme === 'tet'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`}>
                        {formatPrice(item.price * item.quantity)}đ
                      </div>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        placeholder="Thêm ghi chú cho sản phẩm này..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className={`text-center py-12 ${theme === 'tet' ? 'bg-white ring-1 ring-red-100' : 'bg-white shadow-sm'} rounded-lg`}>
                <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                <Link
                  to="/products"
                  className={`inline-block mt-4 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    theme === 'tet'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className={`${theme === 'tet' ? 'bg-white ring-1 ring-red-100' : 'bg-white shadow-sm'} rounded-lg p-6 sticky top-24`}>
                <h3 className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'} mb-4`}>
                  Tổng giỏ hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(total)}đ</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span> 
                  </div>

                  {/* Mã giảm giá */}
                  <div className="space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={loading}
                        className={`px-4 py-2 rounded-r-full transition-all duration-300 hover:opacity-90 ${theme === 'tet'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-800'
                          }`}
                      >
                        <FaGift className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 animate-fade-in">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(discount)}đ</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Tổng cộng</span>
                      <span className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`}>
                        {formatPrice(finalTotal)}đ
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/checkout"
                    className={`block w-full text-center py-3 px-4 rounded-full text-white font-medium transition-all duration-300 hover:opacity-90 ${
                      theme === 'tet'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Thanh toán
                  </Link>
                  <Link
                    to="/products"
                    className={`block w-full text-center py-3 px-4 rounded-full font-medium transition-colors ${
                      theme === 'tet'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Products */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-2xl font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'} mb-8`}>
              Có thể bạn cũng thích
            </h2>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              onSwiper={setSwiperRef}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="suggested-products-swiper"
            >
              {suggestedProducts.map(product => (
                <SwiperSlide key={product.id}>
                  <div 
                    className={`${theme === 'tet' ? 'bg-white ring-1 ring-red-100' : 'bg-white shadow-sm'} rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative cursor-pointer`}
                    onClick={(e) => handleProductClick(product, e)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'} mb-2`}>
                      {product.name}
                    </h3>
                    <p className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatPrice(product.price)}đ
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Thêm vào giỏ hàng logic
                      }}
                      className={`w-full mt-4 py-2 px-4 rounded-full text-white font-medium transition-all duration-300 ${
                        theme === 'tet'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Quick View Popup */}
            {hoveredProduct && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                  onClick={handleCloseQuickView}
                />
                
                {/* Popup */}
                <div 
                  className="fixed z-[9999] bg-white rounded-xl shadow-2xl p-4 sm:p-8 w-[95%] sm:w-[800px] max-h-[90vh] overflow-y-auto"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Nút đóng */}
                  <button 
                    onClick={handleCloseQuickView}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 h-8 border rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-300 transition-all duration-300"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    {/* Ảnh sản phẩm */}
                    <div className="w-full sm:w-1/2">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={hoveredProduct.image}
                          alt={hoveredProduct.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="w-full sm:w-1/2 flex flex-col">
                      <h3 className={`text-xl sm:text-2xl font-semibold ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>
                        {hoveredProduct.name}
                      </h3>
                      
                      <div className="mt-2 sm:mt-4">
                        <p className="text-sm text-gray-500 mb-1">Giá bán:</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`}>
                          {formatPrice(hoveredProduct.price)}đ
                        </p>
                      </div>

                      <p className="text-gray-600 mt-4 sm:mt-6 leading-relaxed text-sm sm:text-base">
                        Mô tả ngắn về sản phẩm sẽ được hiển thị ở đây...
                      </p>

                      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                        {/* Phần chọn kích thước */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Kích thước:</p>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {['S', 'M', 'L', 'XL'].map(size => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-10 sm:w-12 h-10 sm:h-12 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                                  selectedSize === size
                                    ? theme === 'tet'
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:border-blue-600'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Phần chọn màu sắc */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Màu sắc:</p>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {['Đen', 'Trắng', 'Xám'].map(color => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`h-10 sm:h-12 px-4 sm:px-6 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                                  selectedColor === color
                                    ? theme === 'tet'
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:border-blue-600'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Phần chọn số lượng */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Số lượng:</p>
                          <div className="flex items-center">
                            <div className="inline-flex items-center border border-gray-200 rounded-lg">
                              {/* Nút giảm */}
                              <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="sm: h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 border-r border-gray-300 bg-white"
                              >
                                <FaMinus className="w-2.5 h-2.5" />
                              </button>

                              {/* Input số lượng */}
                              <input 
                                type="text" 
                                value={quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1) {
                                    setQuantity(value);
                                  }
                                }}
                                className="w-10 sm:w-12 h-10 text-center focus:outline-none text-gray-700 border-none" 
                              />

                              {/* Nút tăng */}
                              <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="sm: h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 border-l border-gray-300"
                              >
                                <FaPlus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Các nút hành động */}
                      <div className="mt-6 sm:mt-auto pt-4 sm:pt-8 flex gap-2 sm:gap-4">
                        <button
                          onClick={addToCartFromQuickView}
                          className={`flex-1 h-12 sm:h-14 rounded-xl text-white font-medium text-base sm:text-lg transition-all duration-300 ${
                            theme === 'tet'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          Thêm vào giỏ
                        </button>
                        <Link
                          to={`/products/${hoveredProduct.id}`}
                          className={`flex-1 h-12 sm:h-14 rounded-xl font-medium text-base sm:text-lg text-center flex items-center justify-center transition-all duration-300 ${
                            theme === 'tet'
                              ? 'text-red-600 border-2 border-red-600 hover:bg-red-50'
                              : 'text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                          }`}
                          onClick={handleCloseQuickView}
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
