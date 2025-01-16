import React from 'react';
import { FiUsers, FiDollarSign, FiShoppingBag, FiActivity } from 'react-icons/fi';

const Dashboard = () => {
    // Dữ liệu thống kê demo
    const stats = [
        {
            title: 'Tổng khách hàng',
            value: '1,234',
            icon: <FiUsers className="w-6 h-6" />,
            change: '+12%',
            color: 'bg-blue-500'
        },
        {
            title: 'Doanh thu tháng',
            value: '45.6M',
            icon: <FiDollarSign className="w-6 h-6" />,
            change: '+8%',
            color: 'bg-green-500'
        },
        {
            title: 'Đơn hàng mới',
            value: '89',
            icon: <FiShoppingBag className="w-6 h-6" />,
            change: '+23%',
            color: 'bg-purple-500'
        },
        {
            title: 'Lượt truy cập',
            value: '5,678',
            icon: <FiActivity className="w-6 h-6" />,
            change: '+15%',
            color: 'bg-red-500'
        }
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>

            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                                <p className="text-sm text-green-600 mt-2">{stat.change} so với tháng trước</p>
                            </div>
                            <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Biểu đồ hoặc thông tin khác có thể thêm ở đây */}
        </div>
    );
};

export default Dashboard;
