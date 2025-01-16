// ProductDetail.jsx - Trang chi tiết sản phẩm
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaMinus, FaPlus, FaArrowRight, FaHome, FaChevronRight } from 'react-icons/fa';
import { getProductsData } from '../../data/ProductsData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import { useTheme } from '../../contexts/CustomerThemeContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

const ProductDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Lấy thông tin sản phẩm từ ProductsData
  const allProducts = getProductsData(theme).products;
  const product = allProducts.find(p => p.id === parseInt(id));

  // Xử lý khi không tìm thấy sản phẩm
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  // Tính giá sau khi giảm
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div className={`min-h-screen ${theme === 'tet' ? 'bg-red-50' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex mb-8 text-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <FaHome className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <FaChevronRight className="w-3 h-3 text-gray-400" />
                <Link to="/products" className="ml-1 md:ml-2 text-gray-700 hover:text-gray-900">
                  Sản phẩm
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <FaChevronRight className="w-3 h-3 text-gray-400" />
                <span className={`ml-1 md:ml-2 ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`}>
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Images & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="relative">
            {/* Main Swiper */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay, Thumbs, EffectFade]}
              effect="fade"
              speed={800}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              loop={true}
              thumbs={{ swiper: thumbsSwiper }}
              className={`product-main-swiper h-[500px] rounded-2xl overflow-hidden mb-4 group ${theme === 'tet' ? 'ring-2 ring-red-200' : 'ring-1 ring-gray-200'}`}
            >
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    <img
                      src={`${product.image}?random=${index}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 ${theme === 'tet' ? 'bg-gradient-to-b from-transparent to-red-900/20' : 'bg-gradient-to-b from-transparent to-black/20'}`}></div>
                  </div>
                </SwiperSlide>
              ))}
              {/* Custom navigation buttons */}
              <div className={`swiper-button-prev after:!text-base !w-10 !h-10 !backdrop-blur-sm ${theme === 'tet' ? '!bg-red-500/20 hover:!bg-red-500/30' : '!bg-white/20 hover:!bg-white/30'} !rounded-full -translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300 !left-4`}></div>
              <div className={`swiper-button-next after:!text-base !w-10 !h-10 !backdrop-blur-sm ${theme === 'tet' ? '!bg-red-500/20 hover:!bg-red-500/30' : '!bg-white/20 hover:!bg-white/30'} !rounded-full translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300 !right-4`}></div>

              {/* Custom pagination */}
              <div className="swiper-pagination !bottom-4"></div>
            </Swiper>

            {/* Thumbs Swiper */}
            <div className="px-2">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Navigation, Thumbs, Autoplay]}
                spaceBetween={16}
                slidesPerView={4}
                watchSlidesProgress
                speed={800}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                loop={true}
                className="thumbs-swiper mt-4"
              >
                {[...Array(5)].map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${theme === 'tet' ? 'hover:ring-2 hover:ring-red-500' : 'hover:ring-2 hover:ring-gray-500'} h-24`}>
                      <img
                        src={`${product.image}?random=${index}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-75 transition-all duration-300"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className={`text-3xl font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} />
                ))}
              </div>
              <span className="text-gray-500">(150 đánh giá)</span>
            </div>

            <div className="space-x-2">
              <span className={`text-2xl font-bold ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>
                {formatPrice(discountedPrice)}đ
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}đ
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Kích thước</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-center rounded-md ${selectedSize === size
                      ? `${theme === 'tet' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`
                      : `${theme === 'tet' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Màu sắc</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-2 text-center rounded-md ${selectedColor === color
                      ? `${theme === 'tet' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`
                      : `${theme === 'tet' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Số lượng</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert('Đã thêm vào giỏ hàng')}
                className={`flex items-center justify-center w-full px-6 py-3 rounded-full transition-all duration-300 ${theme === 'tet'
                    ? 'bg-red-600 text-white border-border-red-600 hover:bg-red-800'
                    : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-800'
                  }`}
              >
                <FaShoppingCart className="mr-2 text-lg" />
                Thêm vào giỏ
              </button>
              <button
                className={`w-full px-6 py-3 rounded-full font-medium transition-all duration-300 ${theme === 'tet'
                    ? 'bg-red-600 text-white hover:bg-red-800'
                    : 'bg-blue-600 text-white hover:bg-blue-800'
                  }`}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`relative py-4 text-sm font-medium transition-colors duration-200
                  ${activeTab === 'description'
                    ? `${theme === 'tet' 
                        ? 'text-red-600' 
                        : 'text-blue-600'}`
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                Mô tả sản phẩm
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-colors duration-200
                  ${activeTab === 'description'
                    ? `${theme === 'tet' 
                        ? 'bg-red-600' 
                        : 'bg-blue-600'}`
                    : 'bg-transparent'
                  }
                `}></span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`relative py-4 text-sm font-medium transition-colors duration-200
                  ${activeTab === 'reviews'
                    ? `${theme === 'tet' 
                        ? 'text-red-600' 
                        : 'text-blue-600'}`
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span>Đánh giá</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full 
                    ${theme === 'tet'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                    }`
                  }>
                    150
                  </span>
                </div>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-colors duration-200
                  ${activeTab === 'reviews'
                    ? `${theme === 'tet' 
                        ? 'bg-red-600' 
                        : 'bg-blue-600'}`
                    : 'bg-transparent'
                  }
                `}></span>
              </button>
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' ? (
              <div className="prose max-w-none">
                <p>{product.description}</p>
                {/* Thêm nội dung mô tả chi tiết */}
                <h3>Đặc điểm nổi bật</h3>
                <ul>
                  <li>Chất liệu cao cấp</li>
                  <li>Thiết kế hiện đại</li>
                  <li>Đường may tỉ mỉ</li>
                  <li>Phù hợp nhiều dịp</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Mock Reviews */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full ${theme === 'tet' ? 'bg-red-100' : 'bg-gray-100'}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>Khách hàng {index + 1}</h4>
                      <div className="flex text-yellow-400 my-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4" />
                        ))}
                      </div>
                      <p className={`text-gray-600 ${theme === 'tet' ? 'text-red-500' : 'text-gray-500'}`}>
                        Sản phẩm rất đẹp, chất lượng tốt, đóng gói cẩn thận.
                      </p>
                      <p className={`text-sm text-gray-500 mt-1 ${theme === 'tet' ? 'text-red-400' : 'text-gray-400'}`}>
                        Đánh giá vào ngày 01/01/2024
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className={`text-2xl font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Link
                key={index}
                to={`/products/${index}`}
                className="group"
              >
                <div className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4 ${theme === 'tet' ? 'ring-2 ring-red-200' : 'ring-1 ring-gray-200'}`}>
                  <img
                    src="https://picsum.photos/200/300"
                    alt="Product Image"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <h3 className={`text-lg font-medium ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>Sản phẩm {index + 1}</h3>
                <div className="space-x-2">
                  <span className={`text-lg font-bold ${theme === 'tet' ? 'text-red-600' : 'text-gray-900'}`}>100.000đ</span>
                  <span className="text-sm text-gray-500 line-through">150.000đ</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
