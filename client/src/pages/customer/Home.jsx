// Home.jsx - Trang chủ của website thói trang Tết
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaArrowRight, FaGift, FaShippingFast, FaUndo, FaPhoneAlt, FaBolt } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useTheme } from '../../contexts/CustomerThemeContext';
import { getPromotionContent } from '../../data/PromotionContent';
import { getSubscriptionContent } from '../../data/SubscriptionContent';
import { getSliderData } from '../../data/SliderData';
import { getProducts } from '../../data/ProductData';
import { getBannerData } from '../../data/BannerData';
import { getFlashSaleData } from '../../data/FlashSaleData';
import CountdownTimer from '../../components/CountdownTimer';

const Home = () => {
  const { theme } = useTheme();
  const { sliderContent, benefits } = getPromotionContent(theme);
  const subscriptionContent = getSubscriptionContent(theme);
  const sliderData = getSliderData(theme);
  const products = getProducts(theme);
  const banners = getBannerData(theme);
  const flashSaleData = getFlashSaleData(theme || 'default'); // Thêm giá trị mặc định

  // Format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tính giá sau khi giảm
  const calculateDiscountPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };
  
  // State để theo dõi trạng thái flash sale
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);

  // Kiểm tra trạng thái flash sale
  useEffect(() => {
    const checkFlashSaleStatus = () => {
      const now = new Date().getTime();
      const isActive = now >= flashSaleData.startTime && now <= flashSaleData.endTime;
      setIsFlashSaleActive(isActive);
    };

    // Kiểm tra ngay khi component mount
    checkFlashSaleStatus();

    // Kiểm tra mỗi phút
    const interval = setInterval(checkFlashSaleStatus, 60000);

    return () => clearInterval(interval);
  }, [flashSaleData.startTime, flashSaleData.endTime]);

  // Tính giá flash sale
  const calculateFlashSalePrice = (originalPrice, discount) => {
    if (!isFlashSaleActive) return originalPrice;
    return Math.round(calculateDiscountPrice(originalPrice, discount) * 100) / 100;
  };

  return (
    <div className="flex flex-col">
      {/* Dòng chạy thông báo */}
      <div className={`w-full py-3 ${
        theme === 'tet' 
          ? 'bg-gradient-to-r from-red-800 to-red-700 border-y border-yellow-400' 
          : 'bg-gradient-to-r from-blue-700 to-blue-600 border-y border-blue-400'
      }`}>
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className={`inline-block ${
              theme === 'tet' 
                ? 'text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' 
                : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'
            } text-lg font-medium mx-8 tracking-wide`}>
              🎉 Chào mừng đến với cửa hàng thói trang của chúng tôi! 
            </span>
            <span className={`inline-block ${
              theme === 'tet' 
                ? 'text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' 
                : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'
            } text-lg font-medium mx-8 tracking-wide`}>
              🌟 Giảm giá đặc biệt cho các sản phẩm mới! 
            </span>
            <span className={`inline-block ${
              theme === 'tet' 
                ? 'text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' 
                : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'
            } text-lg font-medium mx-8 tracking-wide`}>
              🎁 Miễn phí vận chuyển cho đơn hàng trên 500,000đ!
            </span>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      {sliderContent.map((slide, index) => (
        <div 
          key={index}
          className={`relative min-h-[100vh] md:min-h-[600px] flex items-center justify-center text-white ${slide.backgroundColor}`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center px-4 py-8 md:py-12 w-full max-w-4xl mx-auto">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 ${
              theme === 'tet' ? 'text-yellow-400' : 'text-white'
            }`}>
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12">{slide.subtitle}</p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
              {slide.benefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className={`p-4 md:p-6 rounded-lg backdrop-blur-sm ${
                    theme === 'tet' 
                      ? 'bg-red-900/50 border border-yellow-400'
                      : 'bg-blue-900/50'
                  }`}
                >
                  <div className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${
                    theme === 'tet' ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {benefit.value}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base">{benefit.description}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/products"
              className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all ${
                theme === 'tet'
                  ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Hero Section với Slider */}
      <section className="relative h-[calc(100vh-4rem)]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            enabled: false,
            hideOnClick: true
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false
          }}
          loop={true}
          className="h-full"
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <div className={`absolute inset-0 ${
                  theme === 'tet' 
                    ? 'bg-gradient-to-r from-red-900/80 to-transparent'
                    : 'bg-gradient-to-r from-gray-900/80 to-transparent'
                }`} />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-xl space-y-4 md:space-y-6">
                      <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight ${
                        theme === 'tet' ? 'text-yellow-300' : 'text-white'
                      }`}
                          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl text-white/90">
                        {slide.subtitle}
                      </p>
                      <Link
                        to={slide.buttonLink}
                        className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 transition duration-300 font-medium text-base sm:text-lg rounded-md ${
                          theme === 'tet'
                            ? 'text-red-700 bg-yellow-400 hover:bg-yellow-300'
                            : 'text-white bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {slide.buttonText}
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Dịch vụ */}
      <section className={`py-10 ${theme === 'tet' ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaShippingFast className={`text-4xl ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`} />
              <div>
                <h3 className="font-medium text-gray-800">Miễn phí vận chuyển</h3>
                <p className="text-sm text-gray-600">Cho đơn từ 699K</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaGift className={`text-4xl ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`} />
              <div>
                <h3 className="font-medium text-gray-800">
                  {theme === 'tet' ? 'Lì xì may mắn' : 'Quà tặng hấp dẫn'}
                </h3>
                <p className="text-sm text-gray-600">Tặng kèm đơn hàng</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaUndo className={`text-4xl ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`} />
              <div>
                <h3 className="font-medium text-gray-800">Đổi trả miễn phí</h3>
                <p className="text-sm text-gray-600">Trong 15 ngày</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaPhoneAlt className={`text-4xl ${theme === 'tet' ? 'text-red-600' : 'text-blue-600'}`} />
              <div>
                <h3 className="font-medium text-gray-800">Hỗ trợ 24/7</h3>
                <p className="text-sm text-gray-600">Hotline: 1900 xxxx</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {banners.map((banner) => (
              <div key={banner.id} className="relative overflow-hidden group rounded-lg">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-[400px] object-cover transition duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${banner.gradientColor} to-transparent`}>
                  <div className="absolute bottom-10 left-10">
                    <h2 className={`text-4xl font-light ${theme === 'tet' ? '' : 'text-white'} mb-4`}>
                      {banner.title}
                    </h2>
                    <p className={`${banner.textColor} mb-6`}>{banner.description}</p>
                    <Link
                      to={banner.link}
                      className={`inline-flex items-center ${banner.buttonColor} transition-colors`}
                    >
                      {banner.buttonText}
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header với icon sấm sét và đồng hồ đếm ngược */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <FaBolt className={`text-3xl md:text-4xl ${flashSaleData.style.labelText} animate-pulse`} />
            <h2 className="text-3xl md:text-4xl font-light text-red-800">{flashSaleData.title}</h2>
            <div className="ml-4">
              <CountdownTimer startTime={flashSaleData.startTime} endTime={flashSaleData.endTime} />
            </div>
          </div>
          {/* Subtitle */}
          <p className="text-red-600 text-center mb-8 md:mb-12">{flashSaleData.subtitle}</p>
          
          {/* Grid sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.slice(0, flashSaleData.displayLimit).map((product) => {
              // Tính toán giảm giá và giá hiện tại
              const discount = Math.floor(
                Math.random() * (flashSaleData.maxDiscount - flashSaleData.minDiscount) + 
                flashSaleData.minDiscount
              );
              const currentPrice = calculateFlashSalePrice(product.price, discount);

              return (
                <Link key={product.id} to={`/products/${product.id}`} className="group">
                  {/* Phần hình ảnh sản phẩm */}
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    {/* Hình ảnh sản phẩm với hiệu ứng zoom khi hover */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[300px] md:h-[400px] xl:h-[500px] object-cover transition duration-700 group-hover:scale-110"
                    />
                    {isFlashSaleActive && (
                      <>
                        {/* Label "SALE SỐC" với hiệu ứng nhấp nháy */}
                        <div className={`absolute top-2 md:top-4 left-2 md:left-4 ${flashSaleData.style.labelBg} ${flashSaleData.style.labelText} px-2 md:px-3 py-1 rounded text-sm md:text-base animate-pulse`}>
                          {flashSaleData.labelText}
                        </div>
                        {/* Phần trăm giảm giá */}
                        <div className={`absolute top-2 md:top-4 right-2 md:right-4 ${flashSaleData.style.discountBg} ${flashSaleData.style.discountText} px-2 md:px-3 py-1 rounded font-medium text-sm md:text-base`}>
                          -{discount}%
                        </div>
                      </>
                    )}
                    {/* Overlay khi hover với nút "Mua ngay" */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center">
                        <button className={`${flashSaleData.style.buttonBg} ${flashSaleData.style.buttonText} px-4 md:px-6 py-2 rounded-full font-medium ${flashSaleData.style.buttonHoverBg} transition duration-300 text-sm md:text-base`}>
                          {flashSaleData.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="text-center">
                    {/* Tên sản phẩm */}
                    <h3 className="text-base md:text-lg mb-2 text-gray-800 font-medium">{product.name}</h3>
                    {/* Giá sản phẩm */}
                    <div className="space-x-2">
                      <span className="text-base md:text-lg text-red-700 font-bold">
                        {formatPrice(currentPrice)}đ
                      </span>
                      {isFlashSaleActive && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}đ
                        </span>
                      )}
                    </div>

                    {/* Hiển thị khi flash sale đang diễn ra */}
                    {isFlashSaleActive && (
                      <>
                        {/* Progress bar hiển thị số lượng còn lại */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          {/* Thanh tiến độ với width random từ 60-90% */}
                          <div
                            className={`${flashSaleData.style.progressBar} h-2 rounded-full`}
                            style={{ width: `${Math.floor(Math.random() * 30 + 60)}%` }}
                          />
                        </div>
                        {/* Số lượng đã bán random từ 50-100 */}
                        <p className="text-xs text-red-600 mt-1">Đã bán {Math.floor(Math.random() * 50 + 50)}</p>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Nút xem tất cả flash sale */}
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/flash-sale"
              className={`inline-flex items-center ${flashSaleData.style.buttonBg} ${flashSaleData.style.buttonText} px-6 md:px-8 py-2 md:py-3 rounded-full ${flashSaleData.style.buttonHoverBg} transition duration-300 text-sm md:text-base`}
            >
              XEM TẤT CẢ FLASH SALE
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className={`py-12 md:py-20 ${flashSaleData.featuredStyle.bg}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-light ${flashSaleData.featuredStyle.title} text-center mb-3 md:mb-4`}>
            {flashSaleData.featuredTitle}
          </h2>
          <p className={`${flashSaleData.featuredStyle.subtitle} text-center mb-8 md:mb-12`}>
            {flashSaleData.featuredSubtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[300px] md:h-[400px] xl:h-[500px] object-cover transition duration-700 group-hover:scale-110"
                  />
                  {product.discount > 0 && (
                    <div className={`absolute top-2 md:top-4 left-2 md:left-4 ${flashSaleData.style.labelBg} ${flashSaleData.style.labelText} px-2 md:px-3 py-1 rounded text-sm md:text-base`}>
                      -{product.discount}%
                    </div>
                  )}
                  {product.tag && (
                    <div className={`absolute top-2 md:top-4 right-2 md:right-4 ${flashSaleData.style.discountBg} ${flashSaleData.style.discountText} px-2 md:px-3 py-1 rounded font-medium text-sm md:text-base`}>
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center">
                      <button className={`${flashSaleData.style.buttonBg} ${flashSaleData.style.buttonText} px-4 md:px-6 py-2 rounded-full font-medium ${flashSaleData.style.buttonHoverBg} transition duration-300 text-sm md:text-base`}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className={`text-xs md:text-sm ${flashSaleData.featuredStyle.subtitle} mb-1`}>
                    {product.category}
                  </p>
                  <h3 className="text-base md:text-lg mb-2 text-gray-800 font-medium">
                    {product.name}
                  </h3>
                  <div className="space-x-2">
                    <span className={`text-base md:text-lg ${flashSaleData.style.buttonBg} ${flashSaleData.style.buttonText} font-bold`}>
                      {formatPrice(calculateDiscountPrice(product.price, product.discount))}đ
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs md:text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}đ
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link
              to={flashSaleData.featuredButtonLink}
              className={`inline-flex items-center ${flashSaleData.featuredStyle.button} px-6 md:px-8 py-2 md:py-3 transition duration-300 text-sm md:text-base`}
            >
              {flashSaleData.featuredButtonText}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ưu đãi Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={theme === 'tet' ? '/images/tet-bg.jpg' : '/images/summer-bg.jpg'}
            alt={theme === 'tet' ? 'Tết 2025' : 'Summer Sale'}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${
            theme === 'tet'
              ? 'bg-gradient-to-r from-red-900/90 to-red-900/70'
              : 'bg-gradient-to-r from-blue-900/90 to-blue-900/70'
          }`} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            {/* Tiêu đề */}
            <h2 className={`text-4xl font-light mb-6 ${
              theme === 'tet' ? 'text-yellow-300' : 'text-white'
            }`}>
              {theme === 'tet' ? (
                <>LÌ XÌ MAY MẮN ĐẦU NĂM 🧧</>
              ) : (
                <>SUMMER SALE 2025 ⛱️</>
              )}
            </h2>

            {/* Mô tả */}
            <p className={`text-xl mb-12 ${
              theme === 'tet' ? 'text-yellow-100' : 'text-gray-200'
            }`}>
              {theme === 'tet'
                ? 'Mừng Xuân Ất Tỵ, KTT Store gửi tặng những phần quà đặc biệt:'
                : 'Đón hè rực rỡ với những ưu đãi hấp dẫn từ KTT Store:'}
            </p>

            {/* Grid ưu đãi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg backdrop-blur-sm ${
                    theme === 'tet'
                      ? 'bg-white/10 border border-yellow-400/30'
                      : 'bg-white/10 border border-blue-400/30'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-4 ${
                    theme === 'tet' ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {benefit.value}
                  </div>
                  <p className={
                    theme === 'tet' ? 'text-yellow-100' : 'text-gray-200'
                  }>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/promotion"
              className={`inline-flex items-center px-8 py-4 rounded-lg transition duration-300 font-medium text-lg ${
                theme === 'tet'
                  ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              {theme === 'tet' ? 'NHẬN ƯU ĐÃI NGAY' : 'KHÁM PHÁ NGAY'}
              <FaArrowRight className="ml-2" />
            </Link>

            {/* Thời gian áp dụng */}
            <p className={`mt-8 text-sm ${
              theme === 'tet' ? 'text-yellow-200' : 'text-gray-300'
            }`}>
              {theme === 'tet'
                ? '* Áp dụng từ 25/01/2025 đến hết mùng 5 Tết'
                : '* Áp dụng từ 01/06/2025 đến 31/08/2025'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className={`py-16 ${subscriptionContent.backgroundColor} relative overflow-hidden`}>
        {/* Hiệu ứng nền */}
        <div className="absolute inset-0">
          {theme === 'tet' && (
            <>
              <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
                <img src="/images/tet-ornament-1.png" alt="Tết ornament" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                <img src="/images/tet-ornament-2.png" alt="Tết ornament" className="w-full h-full object-contain" />
              </div>
            </>
          )}
        </div>

        {/* Nội dung */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'tet' ? 'text-yellow-400' : 'text-white'
          }`}>
            {subscriptionContent.title}
          </h2>
          <p className="text-white mb-8">{subscriptionContent.description}</p>
          
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder={subscriptionContent.placeholder}
              className="flex-1 px-6 py-3 rounded-full focus:outline-none"
            />
            <button
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                theme === 'tet'
                  ? 'bg-yellow-400 text-red-700 hover:bg-yellow-300'
                  : 'bg-white text-blue-700 hover:bg-gray-100'
              }`}
            >
              {subscriptionContent.buttonText}
            </button>
          </div>

          {/* Thêm hiệu ứng cho theme Tết */}
          {/* {theme === 'tet' && (
            <div className="mt-8 text-yellow-400 text-sm">
              * Áp dụng cho khách hàng đăng ký mới từ nay đến mùng 5 Tết
            </div>
          )} */}
        </div>
      </section>
    </div>
  );
};

export default Home;
