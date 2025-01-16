import React from 'react';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';
import { FaBox, FaTruck, FaCheck, FaTimes, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();

  // Mock data cho chi tiết đơn hàng
  const orderDetail = {
    id: 'DH001',
    date: '15/01/2025',
    total: 1250000,
    status: 'pending',
    items: [
      { 
        id: 1,
        name: 'Áo thun basic',
        quantity: 2,
        price: 250000,
        image: 'https://picsum.photos/200/300',
        size: 'L',
        color: 'Trắng'
      },
      { 
        id: 2,
        name: 'Quần jean slim fit',
        quantity: 1,
        price: 750000,
        image: 'https://picsum.photos/200/300',
        size: '32',
        color: 'Xanh đậm'
      }
    ],
    shipping: {
      method: 'Giao hàng nhanh',
      fee: 35000,
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
      receiver: 'Nguyễn Văn A',
      phone: '0123456789'
    },
    timeline: [
      {
        status: 'pending',
        date: '15/01/2025 08:30',
        description: 'Đơn hàng đã được tạo'
      },
      {
        status: 'confirmed',
        date: '15/01/2025 09:15',
        description: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'processing',
        date: '15/01/2025 10:00',
        description: 'Đang chuẩn bị hàng'
      }
    ]
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <FaBox />,
          text: 'Chờ xử lý',
          color: theme === 'tet' ? 'text-yellow-500' : 'text-blue-500',
          bg: theme === 'tet' ? 'bg-yellow-100' : 'bg-blue-100'
        };
      case 'shipping':
        return {
          icon: <FaTruck />,
          text: 'Đang giao hàng',
          color: theme === 'tet' ? 'text-orange-500' : 'text-indigo-500',
          bg: theme === 'tet' ? 'bg-orange-100' : 'bg-indigo-100'
        };
      case 'completed':
        return {
          icon: <FaCheck />,
          text: 'Hoàn thành',
          color: 'text-green-500',
          bg: 'bg-green-100'
        };
      case 'cancelled':
        return {
          icon: <FaTimes />,
          text: 'Đã hủy',
          color: 'text-red-500',
          bg: 'bg-red-100'
        };
      default:
        return {
          icon: <FaBox />,
          text: 'Không xác định',
          color: 'text-gray-500',
          bg: 'bg-gray-100'
        };
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'đ';
  };

  const status = getStatusInfo(orderDetail.status);

  return (
    <div className={`min-h-screen ${
      theme === 'tet'
        ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <PageBanner 
        title={`Chi tiết đơn hàng #${orderDetail.id}`}
        description="Thông tin chi tiết đơn hàng của bạn"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm ${status.color} ${status.bg}`}>
                {status.icon}
                <span className="ml-1">{status.text}</span>
              </div>
              <div className="text-gray-500">Ngày đặt: {orderDetail.date}</div>
            </div>
            <div className="font-medium text-lg">
              Tổng tiền: {formatPrice(orderDetail.total + orderDetail.shipping.fee)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Sản phẩm</h3>
              <div className="space-y-4">
                {orderDetail.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>Size: {item.size}</span>
                        <span className="mx-2">|</span>
                        <span>Màu: {item.color}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-500">x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Trạng thái đơn hàng</h3>
              <div className="space-y-6">
                {orderDetail.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      theme === 'tet' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
                    }`}>
                      <FaCheck size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.description}</div>
                      <div className="text-sm text-gray-500 mt-1">{event.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Thông tin giao hàng</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">Địa chỉ giao hàng</div>
                    <div className="text-gray-500 mt-1">{orderDetail.shipping.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400" />
                  <div className="text-gray-500">{orderDetail.shipping.receiver}</div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div className="text-gray-500">{orderDetail.shipping.phone}</div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Tổng thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span>{formatPrice(orderDetail.total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(orderDetail.shipping.fee)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(orderDetail.total + orderDetail.shipping.fee)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-3">
                {orderDetail.status === 'pending' && (
                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Hủy đơn hàng
                  </button>
                )}
                {orderDetail.status === 'completed' && (
                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Mua lại
                  </button>
                )}
                <button className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'tet'
                    ? 'border-red-500 text-red-500 hover:bg-red-50'
                    : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                }`}>
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
