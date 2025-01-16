import React, { useState, useEffect } from 'react';
import { FiPlus, FiClock, FiEdit2, FiTrash2, FiX, FiCheck, FiEye, FiMessageCircle, FiFilter, FiBell, FiShoppingBag, FiTag, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/AdminThemeContext';
import axios from '../../utils/axios';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

const NotificationManagement = () => {
    const { isDarkMode } = useTheme();

    // State quản lý
    const [allNotifications, setAllNotifications] = useState([]);
    const [displayedNotifications, setDisplayedNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        searchTerm: ''
    });

    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // State thống kê
    const [stats, setStats] = useState({
        system: 0,
        order: 0,
        coupon: 0,
        other: 0
    });

    // Fetch thông báo
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/admins/notifications');
            const notifications = response.data;

            setAllNotifications(notifications);
            calculateStats(notifications);
            filterNotifications(notifications);
        } catch (error) {
            console.error('Lỗi tải thông báo:', error);
            toast.error('Không thể tải danh sách thông báo');
        }
    };

    // Tính toán thống kê
    const calculateStats = (notifications) => {
        const newStats = {
            system: 0,
            order: 0,
            coupon: 0,
            other: 0
        };

        notifications.forEach(notification => {
            if (notification.type === 'system' || notification.type === 'order' || notification.type === 'coupon') {
                newStats[notification.type]++;
            } else {
                newStats.other++;
            }
        });

        setStats(newStats);
    };

    // Lọc và sắp xếp thông báo
    const filterNotifications = (notifications) => {
        let result = [...notifications];

        // Lọc theo loại
        if (filters.type !== 'all') {
            result = result.filter(notification =>
                notification.type === filters.type
            );
        }

        // Lọc theo từ khóa
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            result = result.filter(notification =>
                notification.title.toLowerCase().includes(searchLower) ||
                notification.message.toLowerCase().includes(searchLower)
            );
        }

        // Sắp xếp mặc định theo thời gian tạo mới nhất
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setDisplayedNotifications(result);
    };

    // Phân trang
    const totalPages = Math.ceil(displayedNotifications.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotifications = displayedNotifications.slice(indexOfFirstItem, indexOfLastItem);

    // Xử lý thêm thông báo
    const handleAddNotification = () => {
        setSelectedNotification({
            title: '',
            message: '',
            type: 'other',
            scheduledFor: new Date(),
            expiresAt: null
        });
        setIsModalOpen(true);
    };

    // Xử lý lưu thông báo
    const handleSaveNotification = async () => {
        try {
            if (!selectedNotification.title || !selectedNotification.message || !selectedNotification.type) {
                toast.error('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const payload = {
                ...selectedNotification,
                adminID: '660c7a3b9f1b5c001f3e2d4a', // ID admin mặc định, cần thay đổi
                scheduledFor: selectedNotification.scheduledFor || new Date(),
                expiresAt: selectedNotification.expiresAt || null
            };

            if (selectedNotification._id) {
                // Cập nhật
                await axios.put(`/api/admins/notifications/update/${selectedNotification._id}`, payload);
                toast.success('Cập nhật thông báo thành công');
            } else {
                // Tạo mới
                await axios.post('/api/admins/notifications/create', payload);
                toast.success('Tạo thông báo thành công');
            }

            setIsModalOpen(false);
            fetchNotifications();
        } catch (error) {
            console.error('Lỗi lưu thông báo:', error);
            toast.error('Không thể lưu thông báo');
        }
    };

    // Xóa thông báo
    const handleDeleteNotification = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            try {
                await axios.delete(`/api/admins/notifications/delete/${id}`);
                toast.success('Xóa thông báo thành công');
                fetchNotifications();
            } catch (error) {
                console.error('Lỗi xóa thông báo:', error);
                toast.error('Không thể xóa thông báo');
            }
        }
    };

    // Render phân trang
    const renderPagination = () => {
        return (
            <div className="flex justify-center space-x-2 mt-4 mb-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                    className={`px-4 py-2 border rounded-lg ${isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                            : 'bg-white border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
                        }`}
                >
                    Trước
                </button>

                {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-lg ${currentPage === page
                                    ? 'bg-green-500 text-white border-green-500'
                                    : isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                                        : 'bg-white hover:bg-gray-50 border-gray-300'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 border rounded-lg ${isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600'
                            : 'bg-white border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
                        }`}
                >
                    Sau
                </button>
            </div>
        );
    };

    // Render thống kê
    const renderStats = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Thống kê thông báo hệ thống */}
                <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Thông báo hệ thống</p>
                            <h3 className="text-2xl font-semibold">{stats.system}</h3>
                        </div>
                        <div className="p-3 rounded-full bg-indigo-100">
                            <FiMessageCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                {/* Thống kê thông báo đơn hàng */}
                <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Thông báo đơn hàng</p>
                            <h3 className="text-2xl font-semibold">{stats.order}</h3>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <FiShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Thống kê thông báo khuyến mãi */}
                <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Thông báo khuyến mãi</p>
                            <h3 className="text-2xl font-semibold">{stats.coupon}</h3>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <FiTag className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Thống kê thông báo khác */}
                <div className={`p-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Thông báo khác</p>
                            <h3 className="text-2xl font-semibold">{stats.other}</h3>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100">
                            <FiCalendar className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render modal thêm/sửa thông báo
    const renderNotificationModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`w-full max-w-lg p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                    <h2 className="text-xl font-bold mb-4">
                        {selectedNotification._id ? 'Chỉnh sửa' : 'Thêm'} Thông báo
                    </h2>

                    <div className="mb-4">
                        <label className="block mb-2">Tiêu đề</label>
                        <input
                            type="text"
                            value={selectedNotification.title}
                            onChange={(e) => setSelectedNotification(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Nội dung</label>
                        <textarea
                            value={selectedNotification.message}
                            onChange={(e) => setSelectedNotification(prev => ({
                                ...prev,
                                message: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg h-32 ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Loại thông báo</label>
                        <select
                            value={selectedNotification.type}
                            onChange={(e) => setSelectedNotification(prev => ({
                                ...prev,
                                type: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                        >
                            <option value="order">Đơn hàng</option>
                            <option value="coupon">Khuyến mãi</option>
                            <option value="system">Hệ thống</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Thời gian hiển thị</label>
                        <input
                            type="datetime-local"
                            value={selectedNotification.scheduledFor ? new Date(selectedNotification.scheduledFor).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setSelectedNotification(prev => ({
                                ...prev,
                                scheduledFor: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Thời gian hết hạn</label>
                        <input
                            type="datetime-local"
                            value={selectedNotification.expiresAt ? new Date(selectedNotification.expiresAt).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setSelectedNotification(prev => ({
                                ...prev,
                                expiresAt: e.target.value
                            }))}
                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                }`}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className={`px-4 py-2 rounded-lg ${isDarkMode
                                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSaveNotification}
                            className={`px-4 py-2 rounded-lg ${isDarkMode
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Effect để fetch thông báo khi component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Effect để lọc lại khi thay đổi bộ lọc
    useEffect(() => {
        filterNotifications(allNotifications);
    }, [filters]);

    return (
        <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Tiêu đề và nút thêm */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý thông báo</h1>
                <button
                    onClick={handleAddNotification}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                >
                    <FiPlus className="mr-2" /> Thêm thông báo
                </button>
            </div>

            {/* Thống kê */}
            {renderStats()}

            {/* Bộ lọc */}
            <div className="flex space-x-4 mb-6">
                <div className="flex-grow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông báo..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            searchTerm: e.target.value
                        }))}
                        className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                    />
                </div>
                <div>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            type: e.target.value
                        }))}
                        className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="order">Đơn hàng</option>
                        <option value="coupon">Khuyến mãi</option>
                        <option value="system">Hệ thống</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
            </div>

            {/* Bảng thông báo */}
            <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <table className="w-full">
                    <thead className={`border-b ${isDarkMode
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-gray-100 border-gray-200'
                        }`}>
                        <tr>
                            <th className="px-6 py-3 text-left">Tiêu đề</th>
                            <th className="px-6 py-3 text-left">Nội dung</th>
                            <th className="px-6 py-3 text-left">Loại</th>
                            <th className="px-6 py-3 text-left">Ngày tạo</th>
                            <th className="px-6 py-3 text-left">Lượt xem</th>
                            <th className="px-6 py-3 text-left">Hết hạn</th>
                            <th className="px-6 py-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNotifications.map(notification => (
                            <tr
                                key={notification._id}
                                className={`border-b ${isDarkMode
                                        ? 'border-gray-700 hover:bg-gray-700'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <td className="px-6 py-6">
                                    <div className="flex items-center">
                                        <FiBell className="text-green-500 mr-2" />
                                        {notification.title}
                                    </div>
                                </td>
                                <td className="px-6 py-6">{notification.message}</td>
                                <td className="px-6 py-6">
                                    <span className={`px-2 py-1 rounded-full text-xs ${notification.type === 'order' ? 'bg-blue-100 text-blue-800' :
                                            notification.type === 'coupon' ? 'bg-green-100 text-green-800' :
                                                notification.type === 'system' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {notification.type === 'order' ? 'Đơn hàng' :
                                            notification.type === 'coupon' ? 'Khuyến mãi' :
                                                notification.type === 'system' ? 'Hệ thống' : 'Khác'}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    {formatDateTime(notification.createdAt)}
                                </td>
                                <td className="px-6 py-6">
                                    {notification.readCount || 0} lượt xem
                                </td>
                                <td className="px-6 py-6">
                                    {notification.expiresAt ? formatDateTime(notification.expiresAt) : 'Không có'}
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedNotification(notification);
                                                setIsModalOpen(true);
                                            }}
                                            className={`p-2 rounded-lg ${isDarkMode
                                                    ? 'text-blue-400 hover:bg-blue-900'
                                                    : 'text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNotification(notification._id)}
                                            className={`p-2 rounded-lg ${isDarkMode
                                                    ? 'text-red-400 hover:bg-red-900'
                                                    : 'text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {renderPagination()}

            {/* Modal thêm/sửa thông báo */}
            {renderNotificationModal()}
        </div>
    );
};

export default NotificationManagement;
