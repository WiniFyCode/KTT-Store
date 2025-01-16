import React, { useState } from 'react';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';
import { FaBox, FaTruck, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Mock data cho đơn hàng
  const orders = [
    {
      id: 'DH001',
      date: '15/01/2025',
      total: 1250000,
      status: 'pending',
      items: [
        { name: 'Áo thun basic', quantity: 2, price: 250000 },
        { name: 'Quần jean slim fit', quantity: 1, price: 750000 }
      ]
    },
    {
      id: 'DH002',
      date: '14/01/2025',
      total: 890000,
      status: 'shipping',
      items: [
        { name: 'Áo khoác bomber', quantity: 1, price: 890000 }
      ]
    },
    {
      id: 'DH003',
      date: '13/01/2025',
      total: 450000,
      status: 'completed',
      items: [
        { name: 'Áo sơ mi trắng', quantity: 1, price: 450000 }
      ]
    },
    {
      id: 'DH004',
      date: '12/01/2025',
      total: 650000,
      status: 'cancelled',
      items: [
        { name: 'Quần tây âu', quantity: 1, price: 650000 }
      ]
    }
  ];

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

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className={`min-h-screen ${
      theme === 'tet'
        ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <PageBanner 
        title="Đơn hàng của tôi"
        description="Theo dõi và quản lý đơn hàng"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-lg transition-colors text-center ${
                  activeTab === 'all'
                    ? theme === 'tet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2.5 rounded-lg transition-colors text-center ${
                  activeTab === 'pending'
                    ? theme === 'tet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-2.5 rounded-lg transition-colors text-center ${
                  activeTab === 'shipping'
                    ? theme === 'tet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Đang giao
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2.5 rounded-lg transition-colors text-center ${
                  activeTab === 'completed'
                    ? theme === 'tet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Hoàn thành
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-4 py-2.5 rounded-lg transition-colors text-center col-span-2 sm:col-span-1 ${
                  activeTab === 'cancelled'
                    ? theme === 'tet'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Đã hủy
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = getStatusInfo(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 mb-4 pb-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="font-medium">Đơn hàng #{order.id}</div>
                      <div className="text-gray-500 text-sm sm:text-base">{order.date}</div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.color} ${status.bg} w-fit`}>
                      {status.icon}
                      <span className="ml-1">{status.text}</span>
                    </div>
                  </div>
                  <div className="font-medium text-right">
                    Tổng tiền: {formatPrice(order.total)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-gray-400">x{item.quantity}</span>
                      </div>
                      <div className="font-medium">{formatPrice(item.price)}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === 'tet'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Chi tiết
                  </button>
                  {order.status === 'completed' && (
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      Mua lại
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaBox size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy đơn hàng nào
            </h3>
            <p className="text-gray-500">
              Hãy tiếp tục mua sắm để tạo đơn hàng mới
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
