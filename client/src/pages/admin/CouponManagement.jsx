import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiTag, FiPercent, FiCalendar, FiDollarSign, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/AdminThemeContext';
import { formatDate } from '../../utils/dateUtils';

const CouponManagement = () => {
    const { isDarkMode } = useTheme();

    // ===== STATES =====
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    // ===== STATE CHO TÌM KIẾM VÀ LỌC =====
    const [filters, setFilters] = useState({
        status: 'all',      // all/active/expired/used
        type: 'all',        // all/percentage/fixed
        sort: 'none',       // none/createAt/endDate/usageLimit/discountValue/code
        order: 'none'       // none/asc/desc
    });
    const [searchTerm, setSearchTerm] = useState('');

    // ===== STATE CHO PHÂN TRANG =====
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // ===== FORM STATE =====
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: '',
        endDate: '',
        usageLimit: 0,
        totalUsageLimit: 0
    });

    // ===== EFFECTS =====
    useEffect(() => {
        fetchCoupons();
    }, []);

    // ===== API CALLS =====
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admins/coupons');

            // Kiểm tra response format và lấy dữ liệu
            if (response.data && response.data.success) {
                setCoupons(response.data.data || []);
            } else {
                toast.error('Dữ liệu không hợp lệ');
                setCoupons([]);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error(error.response?.data?.message || 'Không thể tải danh sách mã giảm giá');
            setCoupons([]); // Nếu lỗi xuất cho coupon = mảng rỗng
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async () => {
        try {
            await axios.post('/api/admins/coupons/create', formData);
            toast.success('Tạo mã giảm giá thành công');
            setIsModalOpen(false);
            fetchCoupons();
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
        }
    };

    const handleUpdateCoupon = async () => {
        try {
            await axios.put(`/api/admins/coupons/update/${editingCoupon._id}`, formData);
            toast.success('Cập nhật mã giảm giá thành công');
            setIsModalOpen(false);
            fetchCoupons();
        } catch (error) {
            console.error('Error updating coupon:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
            try {
                await axios.delete(`/api/admins/coupons/delete/${id}`);
                toast.success('Xóa mã giảm giá thành công');
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
                toast.error('Không thể xóa mã giảm giá');
            }
        }
    };

    // ===== XỬ LÝ TÌM KIẾM VÀ LỌC =====
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // ===== LỌC VÀ SẮP XẾP COUPON =====
    const getFilteredAndSortedCoupons = () => {
        const now = new Date();

        // Lọc theo từ khóa tìm kiếm
        let filteredCoupons = coupons.filter(coupon =>
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Lọc theo trạng thái
        filteredCoupons = filteredCoupons.filter(coupon => {
            const endDate = new Date(coupon.endDate);
            const isActive = endDate >= now;
            const isUsed = coupon.usageLimit === 0;

            switch (filters.status) {
                case 'active': return isActive && !isUsed;
                case 'expired': return endDate < now;
                case 'used': return isUsed;
                default: return true;
            }
        });

        // Lọc theo loại
        if (filters.type !== 'all') {
            filteredCoupons = filteredCoupons.filter(
                coupon => coupon.discountType === filters.type
            );
        }

        // Sắp xếp
        if (filters.sort !== 'none' && filters.order !== 'none') {
            filteredCoupons.sort((a, b) => {
                let comparison = 0;
                switch (filters.sort) {
                    case 'createAt':
                        comparison = new Date(a.createdAt) - new Date(b.createdAt);
                        break;
                    case 'endDate':
                        comparison = new Date(a.endDate) - new Date(b.endDate);
                        break;
                    case 'usageLimit':
                        comparison = a.usageLimit - b.usageLimit;
                        break;
                    case 'discountValue':
                        comparison = a.discountValue - b.discountValue;
                        break;
                    case 'code':
                        comparison = a.code.localeCompare(b.code);
                        break;
                }
                return filters.order === 'asc' ? comparison : -comparison;
            });
        }

        return filteredCoupons;
    };

    // Tính toán phân trang
    const filteredAndSortedCoupons = getFilteredAndSortedCoupons();
    const totalPages = Math.ceil(filteredAndSortedCoupons.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCoupons = filteredAndSortedCoupons.slice(indexOfFirstItem, indexOfLastItem);

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

    // ===== HANDLERS =====
    const handleEditClick = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscountAmount: coupon.maxDiscountAmount,
            startDate: new Date(coupon.startDate).toISOString().split('T')[0],
            endDate: new Date(coupon.endDate).toISOString().split('T')[0],
            usageLimit: coupon.usageLimit,
            totalUsageLimit: coupon.totalUsageLimit
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: 0,
            minOrderValue: 0,
            maxDiscountAmount: 0,
            startDate: '',
            endDate: '',
            usageLimit: 0,
            totalUsageLimit: 0
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingCoupon) {
            await handleUpdateCoupon();
        } else {
            await handleCreateCoupon();
        }
    };

    // ===== RENDER FUNCTIONS =====
    const renderModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingCoupon ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                            ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                            ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Loại giảm giá
                                    </label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                            ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="percentage">Phần trăm</option>
                                        <option value="fixed">Số tiền cố định</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Giá trị giảm
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                            ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Giới hạn sử dụng/người
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Tổng giới hạn sử dụng
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.totalUsageLimit}
                                            onChange={(e) => setFormData({ ...formData, totalUsageLimit: Number(e.target.value) })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {editingCoupon ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const renderFilterControls = () => {
        const inputClassName = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`;

        const selectClassName = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`;

        return (
            <div className={`grid grid-cols-12 gap-4 mb-6 
                ${isDarkMode ? 'bg-gray-800 p-4 rounded-lg' : 'bg-white p-4 rounded-lg shadow-md'}`}>
                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tìm kiếm mã giảm giá
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập mã hoặc mô tả..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={inputClassName}
                        />
                        <FiSearch className={`absolute right-3 top-3 
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                </div>

                <div className="col-span-6 md:col-span-2 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trạng thái
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className={selectClassName}
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Còn hiệu lực</option>
                        <option value="expired">Hết hạn</option>
                        <option value="used">Đã sử dụng</option>
                    </select>
                </div>

                <div className="col-span-6 md:col-span-2 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loại giảm giá
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className={selectClassName}
                    >
                        <option value="all">Tất cả</option>
                        <option value="percentage">Phần trăm</option>
                        <option value="fixed">Số tiền cố định</option>
                    </select>
                </div>

                <div className="col-span-6 md:col-span-2 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sắp xếp theo
                    </label>
                    <select
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className={selectClassName}
                    >
                        <option value="none">Không sắp xếp</option>
                        <option value="createAt">Thời gian tạo</option>
                        <option value="endDate">Ngày hết hạn</option>
                        <option value="usageLimit">Lượt sử dụng</option>
                        <option value="discountValue">Giá trị giảm</option>
                        <option value="code">Mã giảm giá</option>
                    </select>
                </div>

                {filters.sort !== 'none' && (
                    <div className="col-span-6 md:col-span-2 lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thứ tự
                        </label>
                        <select
                            value={filters.order}
                            onChange={(e) => handleFilterChange('order', e.target.value)}
                            className={selectClassName}
                        >
                            <option value="none">Chọn thứ tự</option>
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                )}
            </div>
        );
    };

    const renderCouponTable = () => {
        return (
            <div className={`overflow-x-auto rounded-lg shadow-md 
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <table className="min-w-full">
                    {/* Phần tiêu đề bảng */}
                    <thead>
                        <tr className={`${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100'}`}>
                            {/* Các cột tiêu đề */}
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mã</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Loại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Giá trị</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ngày hết hạn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : currentCoupons.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Không có mã giảm giá
                                </td>
                            </tr>
                        ) : (
                            currentCoupons.map((coupon) => {
                                const now = new Date();
                                const endDate = new Date(coupon.endDate);
                                const isActive = endDate >= now;
                                const isUsed = coupon.usageLimit === 0;

                                return (
                                    <tr key={coupon._id}
                                        className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiTag className="mr-2 text-green-500" />
                                                {coupon.code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{coupon.description}</td>
                                        <td className="px-6 py-4">
                                            {coupon.discountType === 'percentage' ? '%' : 'Số tiền'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}%`
                                                : `${coupon.discountValue.toLocaleString()} đ`
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(coupon.endDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${isUsed
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : (isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800')
                                                }`}>
                                                {isUsed
                                                    ? 'Đã sử dụng hết'
                                                    : (isActive
                                                        ? 'Còn hiệu lực'
                                                        : 'Hết hạn')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(coupon)}
                                                    className={`p-2 rounded-full hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                                                >
                                                    <FiEdit2 className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                                    className={`p-2 rounded-full hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                                                >
                                                    <FiTrash2 className={`${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    // ===== THỐNG KÊ MÃ GIẢM GIÁ =====
    const calculateCouponStats = () => {
        const now = new Date();

        // Tính tổng lượt sử dụng
        const totalUsageLimit = coupons.reduce((sum, coupon) => sum + (coupon.usageLimit || 0), 0);

        // Tìm mã giảm giá được sử dụng nhiều nhất
        const mostUsedCoupon = coupons.reduce((max, coupon) =>
            (coupon.usageLimit > (max.usageLimit || 0)) ? coupon : max, {});

        return {
            total: coupons.length,
            active: coupons.filter(coupon => new Date(coupon.endDate) >= now).length,
            expired: coupons.filter(coupon => new Date(coupon.endDate) < now).length,
            totalUsageLimit: totalUsageLimit,
            mostUsedCouponCode: mostUsedCoupon.code || 'Chưa có',
            averageUsageLimit: totalUsageLimit > 0
                ? Math.round(totalUsageLimit / coupons.length)
                : 0
        };
    };

    const renderCouponStats = () => {
        const stats = calculateCouponStats();

        const StatCard = ({ title, value, icon: Icon, color }) => (
            <div className={`p-4 rounded-lg shadow-md flex items-center 
                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className={`p-3 rounded-full mr-4 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        );

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Tổng số mã"
                    value={stats.total}
                    icon={FiTag}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    title="Còn hiệu lực"
                    value={stats.active}
                    icon={FiCalendar}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    title="Hết hạn"
                    value={stats.expired}
                    icon={FiX}
                    color="bg-red-100 text-red-600"
                />
                <StatCard
                    title="Tổng lượt sử dụng"
                    value={stats.totalUsageLimit}
                    icon={FiDollarSign}
                    color="bg-purple-100 text-purple-600"
                />
            </div>
        );
    };

    return (
        <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-2">
                    Quản lý mã giảm giá
                </h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    <FiPlus className="mr-2" /> Thêm mã giảm giá
                </button>
            </div>

            {renderCouponStats()}
            {renderFilterControls()}
            {renderCouponTable()}
            {renderPagination()}

            {renderModal()}
        </div>
    );
};

export default CouponManagement;
