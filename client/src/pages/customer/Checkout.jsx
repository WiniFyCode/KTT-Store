// Checkout.jsx - Trang thanh toán
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/CustomerThemeContext';
import { FaMapMarkerAlt, FaPhone, FaUser, FaTruck, FaCreditCard, FaMoneyBill, FaCheck, FaArrowLeft, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { theme } = useTheme();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    email: '' // Thêm trường email
  });
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('preferredPayment') || 'cod';
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({}); // Thêm state cho errors
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  // Danh sách ngân hàng hỗ trợ
  const banks = [
    { id: 'vcb', name: 'VIETCOMBANK', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank-768x740.png' },
    { id: 'agr', name: 'AGRICBANK', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-Agribank-768x768.png' },
    { id: 'mb', name: 'MBBANK', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Logo-MB-Bank-MBB-768x346.png' },
    { id: 'vpb', name: 'VPBANK', logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-VPBank-768x653.png' }
  ];

  // QR Code data cho từng ngân hàng
  const bankQRData = {
    vcb: {
      accountNumber: '1234567890',
      accountName: 'NGUYEN VAN A',
      qrImage: '/images/qrchuyenkhoan.jpg'
    },
    agr: {
      accountNumber: '0987654321',
      accountName: 'NGUYEN VAN A',
      qrImage: '/images/qrchuyenkhoan.jpg'
    },
    mb: {
      accountNumber: '1357924680',
      accountName: 'NGUYEN VAN A',
      qrImage: '/images/qrchuyenkhoan.jpg'
    },
    vpb: {
      accountNumber: '2468013579',
      accountName: 'NGUYEN VAN A',
      qrImage: '/images/qrchuyenkhoan.jpg'
    }
  };

  // Lưu phương thức thanh toán ưa thích
  useEffect(() => {
    if (savePaymentMethod) {
      localStorage.setItem('preferredPayment', paymentMethod);
      if (paymentMethod === 'banking') {
        localStorage.setItem('preferredBank', selectedBank);
      }
    }
  }, [savePaymentMethod, paymentMethod, selectedBank]);

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone
  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  // Validate shipping info
  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!shippingInfo.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(shippingInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    if (shippingInfo.email && !validateEmail(shippingInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format phone number while typing
  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 10) {
      return phone;
    }
    return phone.slice(0, 10);
  };

  // Handle shipping info change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setShippingInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle next step with validation
  const handleNextStep = () => {
    if (step === 1) {
      if (validateShipping()) {
        setStep(2);
      }
    } else {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  // Handle place order with success animation
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccessAnimation(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(3);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
      setShowSuccessAnimation(false);
    }
  };

  // Giả lập dữ liệu giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: 'Áo thun basic',
      price: 250000,
      quantity: 2,
      size: 'L',
      color: 'Trắng',
      image: 'https://picsum.photos/200/300'
    },
    {
      id: 2, 
      name: 'Quần jean nam',
      price: 450000,
      quantity: 1,
      size: 'M',
      color: 'Xanh',
      image: 'https://picsum.photos/200/301'
    }
  ];

  // Format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 30000; // Phí ship
  const total = subtotal + shipping;

  // Progress steps
  const steps = [
    { id: 1, name: 'Thông tin giao hàng' },
    { id: 2, name: 'Phương thức thanh toán' },
    { id: 3, name: 'Xác nhận đơn hàng' }
  ];

  // Tính toán phần trăm hoàn thành
  const progressPercentage = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Back button */}
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-200 hover:text-gray-900 mb-4 sm:mb-6">
        <FaArrowLeft className="w-4 h-4" />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="min-w-[300px] px-4">
            {/* Progress Bar with Labels */}
            <div className="relative">
              {/* Background Line */}
              <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200" />
              
              {/* Progress Line */}
              <div
                className={`absolute top-3 left-0 h-0.5 transition-all duration-500 ease-in-out ${
                  theme === 'tet' ? 'bg-red-600' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 mb-1.5 transition-colors ${
                        step >= s.id
                          ? theme === 'tet'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}
                    >
                      {step > s.id ? <FaCheck className="w-3 h-3" /> : s.id}
                    </div>
                    {/* Label */}
                    <span
                      className={`text-xs font-medium text-center ${
                        step >= s.id
                          ? theme === 'tet'
                            ? 'text-red-600'
                            : 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {step === 3 ? (
          // Confirmation step
          <div className="text-center py-8 sm:py-12">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center mb-4 sm:mb-6 ${
              theme === 'tet' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <FaCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ với bạn.
            </p>
            <div className="max-w-md mx-auto p-4 sm:p-6 bg-gray-100 rounded-xl">
              <h3 className="font-semibold mb-4">Thông tin đơn hàng:</h3>
              <div className="space-y-2 text-left">
                <p><span className="text-gray-500">Họ tên:</span> {shippingInfo.fullName}</p>
                <p><span className="text-gray-500">Số điện thoại:</span> {shippingInfo.phone}</p>
                <p><span className="text-gray-500">Địa chỉ:</span> {shippingInfo.address}</p>
                <p><span className="text-gray-500">Phương thức thanh toán:</span> {
                  paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'
                }</p>
                <p><span className="text-gray-500">Tổng tiền:</span> {formatPrice(total)}đ</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Left Column - Thông tin giao hàng và thanh toán */}
            <div className="flex-1 space-y-6 sm:space-y-8">
              {step === 1 && (
                // Shipping Info
                <section className="bg-gray-100 rounded-2xl p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                    <FaTruck className="text-gray-400" />
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <FaUser className="text-gray-400" />
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        placeholder="Nhập họ và tên người nhận"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <FaPhone className="text-gray-400" />
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        placeholder="Nhập số điện thoại"
                        maxLength="10"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        placeholder="Nhập email (không bắt buộc)"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        Địa chỉ giao hàng *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        placeholder="Nhập địa chỉ giao hàng"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <textarea
                        name="note"
                        value={shippingInfo.note}
                        onChange={handleShippingChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                      />
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                // Payment Method
                <section className="bg-gray-100 rounded-2xl p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-gray-400" />
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {/* COD Option */}
                    <label className="flex items-center p-3 sm:p-4 bg-white border rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setSelectedBank('');
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-4 flex items-center gap-3 flex-1">
                        <FaMoneyBill className="text-gray-400 text-xl" />
                        <div className="flex-1">
                          <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                        </div>
                        {paymentMethod === 'cod' && localStorage.getItem('preferredPayment') === 'cod' && (
                          <span className="text-yellow-500 flex items-center">
                            <FaStar className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Banking Option */}
                    <label className="flex items-center p-3 sm:p-4 bg-white border rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                      <input
                        type="radio"
                        name="payment"
                        value="banking"
                        checked={paymentMethod === 'banking'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="ml-4 flex items-center gap-3 flex-1">
                        <FaCreditCard className="text-gray-400 text-xl" />
                        <div className="flex-1">
                          <p className="font-medium">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản ngân hàng</p>
                        </div>
                        {paymentMethod === 'banking' && localStorage.getItem('preferredPayment') === 'banking' && (
                          <span className="text-yellow-500 flex items-center">
                            <FaStar className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </label>

                    {/* Bank Selection */}
                    {paymentMethod === 'banking' && (
                      <div className="mt-4 space-y-4">
                        <p className="font-medium text-sm text-gray-600">Chọn ngân hàng:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {banks.map((bank) => (
                            <div
                              key={bank.id}
                              onClick={() => setSelectedBank(bank.id)}
                              className={`p-3 border rounded-xl cursor-pointer transition-all ${
                                selectedBank === bank.id
                                  ? theme === 'tet'
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={bank.logo}
                                alt={bank.name}
                                className="h-8 object-contain mx-auto mb-2"
                              />
                              <p className="text-xs text-center font-medium text-gray-600">{bank.name}</p>
                            </div>
                          ))}
                        </div>

                        {/* Bank Transfer Info */}
                        {selectedBank && (
                          <div className="mt-4 p-4 bg-white border rounded-xl space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">Thông tin chuyển khoản:</h3>
                              <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                  theme === 'tet'
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                                onClick={() => {
                                  // Copy to clipboard function
                                  navigator.clipboard.writeText(
                                    `Ngân hàng: ${banks.find(b => b.id === selectedBank)?.name}\n` +
                                    `Số tài khoản: ${bankQRData[selectedBank].accountNumber}\n` +
                                    `Chủ tài khoản: ${bankQRData[selectedBank].accountName}\n` +
                                    `Số tiền: ${formatPrice(total)}đ\n` +
                                    `Nội dung: Thanh toan don hang`
                                  ).then(() => {
                                    toast.success('Đã sao chép thông tin chuyển khoản!', {
                                      position: "top-right",
                                      autoClose: 2000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                    });
                                  }).catch(() => {
                                    toast.error('Không thể sao chép thông tin!');
                                  });
                                }}
                              >
                                Sao chép
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500">Ngân hàng:</span> {banks.find(b => b.id === selectedBank)?.name}</p>
                                <p><span className="text-gray-500">Số tài khoản:</span> {bankQRData[selectedBank].accountNumber}</p>
                                <p><span className="text-gray-500">Chủ tài khoản:</span> {bankQRData[selectedBank].accountName}</p>
                                <p><span className="text-gray-500">Số tiền:</span> {formatPrice(total)}đ</p>
                                <p><span className="text-gray-500">Nội dung CK:</span> Thanh toan don hang</p>
                              </div>

                              <div className="flex items-center justify-center">
                                <img
                                  src={bankQRData[selectedBank].qrImage}
                                  alt="QR Code"
                                  className="w-32 h-32 object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save Payment Method */}
                    <label className="flex items-center mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={savePaymentMethod}
                        onChange={(e) => setSavePaymentMethod(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Lưu phương thức thanh toán này cho lần sau
                      </span>
                    </label>
                  </div>
                </section>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 font-medium transition-colors hover:bg-gray-50"
                  >
                    Quay lại
                  </button>
                )}
                {step < 2 ? (
                  <button
                    onClick={handleNextStep}
                    className={`flex-1 py-2.5 sm:py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                      theme === 'tet'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`flex-1 py-2.5 sm:py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                      theme === 'tet'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Đang xử lý...' : `Đặt hàng (${formatPrice(total)}đ)`}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Tổng kết đơn hàng */}
            <div className="lg:w-[400px]">
              <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 sticky top-24">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Tổng kết đơn hàng</h2>

                {/* Danh sách sản phẩm */}
                <div className="space-y-4 mb-4 sm:mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.size} / {item.color}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}đ</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chi tiết thanh toán */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(subtotal)}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển:</span>
                    <span className="font-medium">{formatPrice(shipping)}đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Tổng cộng:</span>
                    <span className={theme === 'tet' ? 'text-red-600' : 'text-blue-600'}>
                      {formatPrice(total)}đ
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center max-w-sm w-full">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${
              theme === 'tet' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <FaCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="text-base sm:text-lg font-medium text-center">Đang xử lý đơn hàng...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
