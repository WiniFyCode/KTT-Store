import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiX, FiShoppingCart, FiClock, FiCheck, FiAlertCircle, FiUser, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { useTheme } from '../../contexts/AdminThemeContext';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

const OrderManagement = () => {
    const { isDarkMode } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [editForm, setEditForm] = useState({
        orderStatus: '',
        shippingStatus: '',
        isPayed: false
    });
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ===== STATE CHO PHÂN TRANG =====
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Hàm để lấy danh sách đơn hàng từ server
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admins/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            toast.error(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Gọi API lấy danh sách đơn hàng khi component được mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Hàm xử lý cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/admins/orders/status/${orderId}`, {
                orderStatus: newStatus
            });
            toast.success('Cập nhật trạng thái đơn hàng thành công');
            fetchOrders(); // Refresh danh sách sau khi cập nhật
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
        }
    };

    // Hàm xử lý xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            try {
                await axiosInstance.delete(`/api/admins/orders/${orderId}`);
                toast.success('Xóa đơn hàng thành công');
                fetchOrders(); // Refresh danh sách đơn hàng
            } catch (error) {
                console.error('Lỗi khi xóa đơn hàng:', error);
                toast.error(error.response?.data?.message || 'Không thể xóa đơn hàng');
            }
        }
    };

    // Hàm lọc đơn hàng theo từ khóa tìm kiếm
    const filteredOrders = orders.filter(order =>
        order._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hàm sắp xếp đơn hàng
    const sortedOrders = filteredOrders.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'highest':
                return b.totalPrice - a.totalPrice;
            case 'lowest':
                return a.totalPrice - b.totalPrice;
            default:
                return 0;
        }
    });

    // Hàm lọc đơn hàng theo trạng thái
    const filteredOrdersByStatus = sortedOrders.filter(order => {
        if (statusFilter === '') return true;
        return order.orderStatus === statusFilter;
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredOrdersByStatus.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrdersByStatus.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        return (
            <div className="flex justify-center space-x-2 mt-4 mb-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
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
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 border rounded-lg transition-colors ${currentPage === page
                                        ? 'bg-green-500 text-white border-green-500'
                                        : isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                                            : 'bg-white hover:bg-gray-50 border-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    }
                    if (index > 0 && page - [...Array(totalPages)][index - 1] > 1) {
                        return (
                            <React.Fragment key={`ellipsis-${page}`}>
                                <span className={`px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>...</span>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 border rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-green-500 text-white border-green-500'
                                            : isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                                                : 'bg-white hover:bg-gray-50 border-gray-300'
                                        }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        );
                    }
                    return null;
                })}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
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

    // Lấy chi tiết đơn hàng
    const fetchOrderDetails = async (orderId) => {
        try {
            const [orderResponse, detailsResponse] = await Promise.all([
                axiosInstance.get(`/api/admins/orders/${orderId}`),
                axiosInstance.get(`/api/admins/order-details/order/${orderId}`)
            ]);

            if (!orderResponse.data) {
                throw new Error('Không tìm thấy đơn hàng');
            }

            const orderDetails = await Promise.all(
                detailsResponse.data.map(async (detail) => {
                    // Kiểm tra nếu không có productID
                    if (!detail.productID) {
                        return {
                            ...detail,
                            productID: {
                                name: 'Sản phẩm đã bị xóa',
                                price: 0,
                                images: []
                            }
                        };
                    }

                    try {
                        const productResponse = await axiosInstance.get(`/api/admins/products/${detail.productID}`);
                        return {
                            ...detail,
                            productID: productResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching product ${detail.productID}:`, error);
                        return {
                            ...detail,
                            productID: {
                                name: 'Sản phẩm không tồn tại',
                                price: 0,
                                images: []
                            }
                        };
                    }
                })
            );

            setSelectedOrder({
                ...orderResponse.data,
                orderDetails: orderDetails
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng');
        }
    };

    // Hiển thị chi tiết đơn hàng
    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        await fetchOrderDetails(order._id);
        setIsModalOpen(true);
    };

    // Hàm xử lý khi click nút sửa
    const handleEditClick = (order) => {
        setEditForm({
            orderStatus: order.orderStatus,
            shippingStatus: order.shippingStatus,
            isPayed: order.isPayed
        });
        setSelectedOrder(order);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Hàm xử lý cập nhật đơn hàng
    const handleUpdateOrder = async () => {
        try {
            await axiosInstance.put(`/api/admins/orders/update/${selectedOrder._id}`, editForm);
            toast.success('Cập nhật đơn hàng thành công');
            setIsEditMode(false);
            setIsModalOpen(false);
            fetchOrders(); // Refresh danh sách sau khi cập nhật
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật đơn hàng');
        }
    };

    // Hàm xử lý khi lưu thay đổi
    const handleSaveChanges = async () => {
        try {
            const response = await axiosInstance.put(`/api/admins/orders/update/${selectedOrder._id}`, editForm);
            if (response.status === 200) {
                const updatedOrders = orders.map(order =>
                    order._id === selectedOrder._id ? { ...order, ...editForm } : order
                );
                setOrders(updatedOrders);
                setIsEditMode(false);
                setSelectedOrder(null);
                toast.success('Cập nhật đơn hàng thành công!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng!');
        }
    };

    // Hàm xử lý khi click nút xóa
    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    // Hàm xử lý xác nhận xóa
    const handleConfirmDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/api/admins/orders/delete/${orderToDelete._id}`);
            if (response.status === 200) {
                const updatedOrders = orders.filter(order => order._id !== orderToDelete._id);
                setOrders(updatedOrders);
                setShowDeleteConfirm(false);
                setOrderToDelete(null);
                toast.success('Xóa đơn hàng thành công!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa đơn hàng!');
            console.error('Error deleting order:', error);
        }
    };

    // Hàm helper để lấy màu cho trạng thái đơn hàng
    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm helper để lấy màu cho trạng thái giao hàng
    const getShippingStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipping':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm helper để lấy text cho trạng thái đơn hàng
    const getOrderStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'completed':
                return 'Hoàn thành';
            case 'canceled':
                return 'Đã hủy';
            case 'refunded':
                return 'Hoàn tiền';
            default:
                return 'Không xác định';
        }
    };

    // Hàm helper để lấy text cho trạng thái giao hàng
    const getShippingStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'shipping':
                return 'Đang giao';
            case 'delivered':
                return 'Đã giao';
            case 'failed':
                return 'Thất bại';
            default:
                return 'Không xác định';
        }
    };

    // Hàm render nút thao tác
    const renderActionButtons = (order) => (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => handleViewDetails(order)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title="Xem chi tiết"
            >
                <FiEye size={20} />
            </button>
            <button
                onClick={() => handleEditClick(order)}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                title="Chỉnh sửa"
            >
                <FiEdit2 size={20} />
            </button>
            <button
                onClick={() => {
                    setOrderToDelete(order);
                    setShowDeleteConfirm(true);
                }}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="Xóa"
            >
                <FiTrash2 size={20} />
            </button>
        </div>
    );

    // Modal chỉnh sửa đơn hàng
    const renderEditForm = () => (
        <div className="mt-4 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái đơn hàng
                </label>
                <select
                    value={editForm.orderStatus}
                    onChange={(e) => setEditForm({ ...editForm, orderStatus: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã giao hàng</option>
                    <option value="delivered">Đã nhận hàng</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái vận chuyển
                </label>
                <select
                    value={editForm.shippingStatus}
                    onChange={(e) => setEditForm({ ...editForm, shippingStatus: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                </select>
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={editForm.isPayed}
                    onChange={(e) => setEditForm({ ...editForm, isPayed: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Đã thanh toán
                </label>
            </div>
        </div>
    );

    // Hàm format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={`p-6 min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quản lý và theo dõi tất cả đơn hàng của bạn
                </p>
            </div>

            {/* Thống kê đơn hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md transform hover:-translate-y-1`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <FiShoppingCart className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Tổng đơn hàng</p>
                            <p className="text-2xl font-bold mt-1">{orders.length}</p>
                        </div>
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md transform hover:-translate-y-1`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                            <FiClock className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Chờ xử lý</p>
                            <p className="text-2xl font-bold mt-1">
                                {orders.filter(order => order.orderStatus === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md transform hover:-translate-y-1`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                            <FiCheck className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Hoàn thành</p>
                            <p className="text-2xl font-bold mt-1">
                                {orders.filter(order => order.orderStatus === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md transform hover:-translate-y-1`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}>
                            <FiX className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Đã hủy</p>
                            <p className="text-2xl font-bold mt-1">
                                {orders.filter(order => order.orderStatus === 'canceled').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thanh tìm kiếm và lọc */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-xl shadow-sm border transition-all duration-200 mb-8`}>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200`}
                            />
                            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            className={`px-4 py-3 rounded-xl border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50`}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            value={statusFilter}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="shipping">Đang giao hàng</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="canceled">Đã hủy</option>
                        </select>
                        <select
                            className={`px-4 py-3 rounded-xl border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50`}
                            onChange={(e) => setSortBy(e.target.value)}
                            value={sortBy}
                        >
                            <option value="">Sắp xếp theo</option>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="highest">Giá cao nhất</option>
                            <option value="lowest">Giá thấp nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng đơn hàng */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border transition-all duration-200`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mã đơn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                                        Không có đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map((order) => (
                                    <tr key={order._id} className={`${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiShoppingCart className="mr-2 text-green-500" />
                                                <span className="text-sm font-medium">#{order._id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <p className="font-medium">{order.fullname}</p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(order.totalPrice)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderActionButtons(order)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {renderPagination()}

            {/* Modal xác nhận xóa */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6 transform transition-all duration-200 scale-100`}>
                        <div className="text-center">
                            <FiAlertCircle className="mx-auto text-red-500 w-14 h-14 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Xác nhận xóa đơn hàng</h3>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Bạn có chắc chắn muốn xóa đơn hàng #{orderToDelete._id} không?
                                Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className={`px-4 py-2 rounded-lg ${isDarkMode
                                            ? 'bg-gray-700 hover:bg-gray-600'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                        } transition-colors duration-200`}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Xác nhận xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết đơn hàng */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="relative w-full max-w-5xl p-6 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-700">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Chi tiết đơn hàng
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Mã đơn: #{selectedOrder._id}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                            >
                                <FiX size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Thông tin khách hàng */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                                        <FiUser className="mr-2" /> Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{selectedOrder.fullname}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{selectedOrder.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin đơn hàng */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                                        <FiPackage className="mr-2" /> Thông tin đơn hàng
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái đơn hàng</p>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(selectedOrder.orderStatus)}`}>
                                                    {getOrderStatusText(selectedOrder.orderStatus)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái giao hàng</p>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getShippingStatusColor(selectedOrder.shippingStatus)}`}>
                                                    {getShippingStatusText(selectedOrder.shippingStatus)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái thanh toán</p>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedOrder.isPayed
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                                    }`}>
                                                    <FiDollarSign className="mr-1" />
                                                    {selectedOrder.isPayed ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày đặt hàng</p>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {formatDate(selectedOrder.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                                <FiShoppingBag className="mr-2" /> Chi tiết sản phẩm
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-600">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Sản phẩm
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Biến thể
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Số lượng
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Đơn giá
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                            {selectedOrder.orderDetails?.map((detail) => (
                                                <tr key={detail._id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {detail.productID?.name || 'Sản phẩm đã bị xóa'}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {detail.productID?.price ? `${detail.productID.price.toLocaleString('vi-VN')}₫` : '0₫'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 mr-2">
                                                                {detail.variantID.size}
                                                            </span>
                                                            <span className="px-2 py-1 text-xs rounded-md bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                                                                {detail.variantID.color}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                                                        {detail.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(detail.price)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(detail.price * detail.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-100 dark:bg-gray-600">
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                    Tổng cộng:
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(selectedOrder.totalPrice)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end">
                            {isEditMode && (
                                <div className="mr-4">
                                    {renderEditForm()}
                                </div>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                Đóng
                            </button>
                            {isEditMode && (
                                <button
                                    onClick={handleUpdateOrder}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Cập nhật
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
