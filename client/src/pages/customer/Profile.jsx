// Profile.jsx - Trang thông tin cá nhân
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, 
  FaVenusMars, FaTrash, FaShoppingBag, FaHeart, FaStar, 
  FaBox, FaTruck, FaCheck, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';
import { toast } from 'react-toastify';

const Profile = () => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    address: '',
    isDefault: false
  });
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State cho thông tin user
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phone: '',
    sex: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  // Thống kê
  const statsItems = [
    {
      icon: FaShoppingBag,
      label: "Đơn hàng",
      value: "12",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: FaHeart,
      label: "Yêu thích",
      value: "8",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      icon: FaStar,
      label: "Đánh giá",
      value: "4.8",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  // Trạng thái đơn hàng
  const orderStats = [
    {
      icon: FaBox,
      status: "Chờ xác nhận",
      count: 2,
      color: "yellow"
    },
    {
      icon: FaTruck,
      status: "Đang giao",
      count: 1,
      color: "blue" 
    },
    {
      icon: FaCheck,
      status: "Hoàn thành",
      count: 8,
      color: "green"
    }
  ];

  // Hoạt động gần đây
  const recentActivities = [
    {
      type: "order",
      title: "Đặt hàng thành công",
      time: "2 giờ trước",
      detail: "Đơn hàng #123456"
    },
    {
      type: "review",
      title: "Đánh giá sản phẩm",
      time: "1 ngày trước", 
      detail: "Áo thun nam basic"
    }
  ];

  // Mock data và các hàm xử lý (giữ nguyên)
  useEffect(() => {
    const mockAddresses = [
      {
        id: 1,
        address: '123 Đường ABC, Quận 1, TP.HCM',
        isDefault: true,
        isDelete: false
      },
      {
        id: 2,
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        isDefault: false,
        isDelete: false
      }
    ];
    setAddresses(mockAddresses);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const mockUserData = {
          fullname: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789',
          sex: 'Nam',
        };
        setUserData(prevData => ({
          ...prevData,
          ...mockUserData
        }));
      } catch (error) {
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      toast.success('Cập nhật thông tin thành công');
      setIsEditing(false);
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setAddressForm({
      id: null,
      address: '',
      isDefault: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (addr) => {
    setAddressForm({
      id: addr.id,
      address: addr.address,
      isDefault: addr.isDefault
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (!addressForm.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }

    if (addressForm.id) {
      // Cập nhật địa chỉ
      setAddresses(addresses.map(addr => 
        addr.id === addressForm.id 
          ? { ...addressForm }
          : addressForm.isDefault 
            ? { ...addr, isDefault: false }
            : addr
      ));
      toast.success('Cập nhật địa chỉ thành công');
    } else {
      // Thêm địa chỉ mới
      const newAddress = {
        ...addressForm,
        id: addresses.length + 1,
      };
      if (addressForm.isDefault) {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: false })).concat(newAddress));
      } else {
        setAddresses([...addresses, newAddress]);
      }
      toast.success('Thêm địa chỉ thành công');
    }
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (addressId) => {
    const address = addresses.find(addr => addr.id === addressId);
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAddress = () => {
    // TODO: Gọi API xóa địa chỉ
    toast.success('Đã xóa địa chỉ thành công');
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
    setAddresses(addresses.filter(addr => addr.id !== addressToDelete.id));
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === addressId) {
        return { ...addr, isDefault: true };
      }
      return { ...addr, isDefault: false };
    }));
  };

  return (
    <div className={`min-h-screen ${theme === 'tet' ? 'bg-red-50' : 'bg-gray-50'}`}>
      <PageBanner
        theme={theme}
        icon={FaUser}
        title="Thông Tin Cá Nhân"
        subtitle="Quản lý thông tin cá nhân của bạn"
        breadcrumbText="Thông tin cá nhân"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột bên trái - Thông tin cá nhân */}
            <div className="lg:col-span-2">
              <div className={`rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl 
                ${theme === 'tet'
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}>
                
                {/* Header với Avatar */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="absolute -bottom-16 left-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 
                        ring-white bg-white
                        transform transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={userData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="absolute bottom-2 right-2 p-2 rounded-xl
                        bg-white/90 hover:bg-white text-gray-700 
                        transform transition-all duration-300 hover:scale-110">
                        <FaCamera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="p-8 pt-20">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 
                        ${theme === 'tet' ? 'border-red-500' : 'border-blue-500'}`}>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Họ và tên */}
                        <div className="space-y-2">
                          <label className="flex items-center text-base font-medium text-gray-700">
                            <FaUser className="w-5 h-5 mr-2 text-gray-400" />
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            value={userData.fullname}
                            onChange={(e) => setUserData({...userData, fullname: e.target.value})}
                            disabled={!isEditing}
                            className={`w-full px-6 py-4 rounded-xl text-base
                              transition-all duration-300
                              ${isEditing 
                                ? 'bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                : 'bg-gray-50/50 border-2 border-transparent'
                              }`}
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="flex items-center text-base font-medium text-gray-700">
                            <FaEnvelope className="w-5 h-5 mr-2 text-gray-400" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={userData.email}
                            disabled
                            className="w-full px-6 py-4 rounded-xl text-base
                              bg-gray-50/50 border-2 border-transparent"
                          />
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-2">
                          <label className="flex items-center text-base font-medium text-gray-700">
                            <FaPhone className="w-5 h-5 mr-2 text-gray-400" />
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            disabled={!isEditing}
                            className={`w-full px-6 py-4 rounded-xl text-base
                              transition-all duration-300
                              ${isEditing 
                                ? 'bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                                : 'bg-gray-50/50 border-2 border-transparent'
                              }`}
                          />
                        </div>

                        {/* Giới tính */}
                        <div className="space-y-2">
                          <label className="flex items-center text-base font-medium text-gray-700">
                            <FaVenusMars className="w-5 h-5 mr-2 text-gray-400" />
                            Giới tính
                          </label>
                          <div className={`grid grid-cols-3 gap-3 ${!isEditing && 'opacity-70'}`}>
                            {['Nam', 'Nữ', 'Khác'].map((gender) => (
                              <button
                                key={gender}
                                type="button"
                                disabled={!isEditing}
                                onClick={() => setUserData({ ...userData, sex: gender })}
                                className={`relative px-3 py-3 rounded-xl text-base font-medium
                                  transition-all duration-300 disabled:cursor-not-allowed
                                  ${userData.sex === gender
                                    ? theme === 'tet'
                                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : isEditing
                                      ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                                      : 'bg-gray-50/50 border-2 border-transparent text-gray-700'
                                  }`}
                              >
                                {gender}
                                {userData.sex === gender && (
                                  <span className={`absolute top-1 right-1 w-2 h-2 rounded-full
                                    ${theme === 'tet' ? 'bg-yellow-300' : 'bg-blue-200'}`}
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-3 rounded-xl text-base font-medium
                                text-gray-700 bg-gray-100 hover:bg-gray-200
                                transition-all duration-300"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleUpdateProfile}
                              className={`px-8 py-3 rounded-xl text-base font-medium
                                text-white transition-all duration-300
                                ${theme === 'tet'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                }`}
                            >
                              Lưu thay đổi
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditing(true)}
                            className={`px-8 py-3 rounded-xl text-base font-medium
                              text-white transition-all duration-300
                              ${theme === 'tet'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                              }`}
                          >
                            Chỉnh sửa thông tin
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className={`mt-8 rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl
                ${theme === 'tet'
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Địa chỉ</h3>
                    <button
                      onClick={handleAddAddress}
                      className={`px-4 py-2 rounded-xl text-sm font-medium
                        ${theme === 'tet'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-all duration-300`}
                    >
                      + Thêm địa chỉ mới
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {addresses.map((addr, index) => (
                      <div key={index} 
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md
                          ${addr.isDefault 
                            ? theme === 'tet'
                              ? 'border-red-500 bg-red-50'
                              : 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-base text-gray-800 flex-1">{addr.address}</p>
                              {addr.isDefault && (
                                <span className={`inline-block px-3 py-1 text-sm rounded-lg
                                  ${theme === 'tet'
                                    ? 'text-red-700 bg-red-100'
                                    : 'text-blue-700 bg-blue-100'
                                  }`}
                                >
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                onClick={() => handleEditAddress(addr)}
                                className={`text-sm font-medium text-gray-600 hover:text-gray-800
                                  transition-colors duration-300 flex items-center gap-1`}
                              >
                                <FaEdit className="w-4 h-4" />
                                Chỉnh sửa
                              </button>
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className={`text-sm font-medium
                                    ${theme === 'tet'
                                      ? 'text-red-600 hover:text-red-700'
                                      : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                  Đặt làm mặc định
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-sm font-medium text-gray-600 hover:text-red-600 
                                  transition-colors duration-300"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {addresses.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                        <button
                          onClick={handleAddAddress}
                          className={`px-6 py-3 rounded-xl text-base font-medium
                            ${theme === 'tet'
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-all duration-300`}
                        >
                          + Thêm địa chỉ mới
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Cột bên phải - Thống kê và hoạt động */}
            <div className="space-y-8">
              {/* Thống kê */}
              <div className={`rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl p-8
                ${theme === 'tet'
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}>
                <h3 className="text-xl font-semibold mb-6">Thống kê</h3>
                <div className="grid grid-cols-1 gap-4">
                  {statsItems.map((item, index) => (
                    <div key={index} className={`p-4 rounded-xl ${item.bgColor} transition-all duration-300 hover:shadow-md`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl ${item.textColor} bg-white`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-gray-600">{item.label}</p>
                            <p className={`text-xl font-semibold ${item.textColor}`}>
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trạng thái đơn hàng */}
              <div className={`rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl p-8
                ${theme === 'tet'
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}>
                <h3 className="text-xl font-semibold mb-6">Đơn hàng của tôi</h3>
                <div className="space-y-4">
                  {orderStats.map((item, index) => (
                    <div key={index} className={`p-4 rounded-xl bg-${item.color}-50 transition-all duration-300 hover:shadow-md`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl text-${item.color}-600 bg-white`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-gray-600">{item.status}</p>
                            <p className={`text-xl font-semibold text-${item.color}-600`}>
                              {item.count}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hoạt động gần đây */}
              <div className={`rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl p-8
                ${theme === 'tet'
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}>
                <h3 className="text-xl font-semibold mb-6">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-xl ${
                          activity.type === 'order' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {activity.type === 'order' ? (
                            <FaShoppingBag className="w-6 h-6" />
                          ) : (
                            <FaStar className="w-6 h-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.detail}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa địa chỉ */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">
                {addressForm.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    rows="3"
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded 
                      focus:ring-blue-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium
                      text-gray-700 bg-gray-100 hover:bg-gray-200
                      transition-all duration-300`}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className={`px-6 py-2 rounded-xl text-sm font-medium text-white
                      transition-all duration-300
                      ${theme === 'tet'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    {addressForm.id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all ${
            theme === 'tet' ? 'border-2 border-red-200' : ''
          }`}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận xóa địa chỉ
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    theme === 'tet'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDeleteAddress}
                  className={`px-4 py-2 rounded-xl font-medium text-white transition-colors ${
                    theme === 'tet'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Xóa địa chỉ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
