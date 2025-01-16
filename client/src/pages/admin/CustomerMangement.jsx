// Import các thư viện cần thiết
import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';  // Import axios đã được cấu hình sẵn
import { FiSearch, FiEdit2, FiTrash2, FiUserX, FiUserCheck, FiUser } from 'react-icons/fi'; // Import các icon
import { toast } from 'react-toastify'; // Import thư viện để hiển thị thông báo
import { useTheme } from '../../contexts/AdminThemeContext'; // Import context để sử dụng theme sáng/tối

// Component chính để quản lý khách hàng
const Customers = () => {
    // Lấy theme hiện tại (sáng/tối) từ context
    const { isDarkMode } = useTheme();

    // Khai báo các state để lưu trữ dữ liệu
    // ===== STATE CHO DỮ LIỆU =====
    const [allCustomers, setAllCustomers] = useState([]); // Lưu toàn bộ danh sách khách hàng
    const [filteredCustomers, setFilteredCustomers] = useState([]); // Lưu danh sách khách hàng sau khi lọc
    const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu

    // ===== STATE CHO TÌM KIẾM VÀ LỌC =====
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [filters, setFilters] = useState({
        status: 'all',      // Lọc theo trạng thái (tất cả/hoạt động/vô hiệu hóa)
        gender: '',         // Lọc theo giới tính
        sort: 'createAt',   // Sắp xếp theo trường nào
        order: 'desc'       // Thứ tự sắp xếp (tăng/giảm)
    });

    // ===== STATE CHO PHÂN TRANG =====
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [itemsPerPage, setItemsPerPage] = useState(10); // Số item trên mỗi trang
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    // ===== STATE CHO THỐNG KÊ =====
    const [stats, setStats] = useState({
        total: 0,      // Tổng số khách hàng
        active: 0,     // Số khách hàng đang hoạt động
        disabled: 0    // Số khách hàng bị vô hiệu hóa
    });

    // ===== STATE CHO CHỈNH SỬA =====
    const [editingCustomer, setEditingCustomer] = useState(null); // Khách hàng đang được chỉnh sửa
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái hiển thị modal chỉnh sửa

    // ===== CÁC HÀM XỬ LÝ =====

    // 1. Hàm lấy dữ liệu từ server khi component được tạo
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Bắt đầu loading
                setLoading(true);

                // Gọi API để lấy danh sách khách hàng và thống kê
                const [customersResponse, statsResponse] = await Promise.all([
                    axios.get('/api/admins/customers', {
                        params: {
                            page: 1,
                            limit: 1000 // Lấy tất cả khách hàng
                        }
                    }),
                    axios.get('/api/admins/customers/stats')
                ]);

                // Nếu lấy được danh sách khách hàng thì cập nhật state
                if (customersResponse.data?.customers) {
                    setAllCustomers(customersResponse.data.customers);
                    setFilteredCustomers(customersResponse.data.customers);
                    setTotalPages(Math.ceil(customersResponse.data.customers.length / itemsPerPage));
                }

                // Nếu lấy được thống kê thì cập nhật state
                if (statsResponse.data) {
                    setStats({
                        total: statsResponse.data.total || 0,
                        active: statsResponse.data.active || 0,
                        disabled: statsResponse.data.disabled || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Hiển thị thông báo lỗi
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                // Kết thúc loading dù thành công hay thất bại
                setLoading(false);
            }
        };

        // Gọi hàm fetchData
        fetchData();
    }, [itemsPerPage]); // Chạy lại khi số item trên trang thay đổi

    // 2. Hàm xử lý tìm kiếm và lọc
    useEffect(() => {
        // Tạo một bản sao của danh sách khách hàng
        let result = [...allCustomers];

        // Xử lý tìm kiếm
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(customer =>
                // Tìm trong tên, email hoặc số điện thoại
                customer.fullname?.toLowerCase().includes(searchLower) ||
                customer.email?.toLowerCase().includes(searchLower) ||
                customer.phone?.toLowerCase().includes(searchLower)
            );
        }

        // Lọc theo trạng thái
        if (filters.status === 'active') {
            result = result.filter(customer => !customer.isDisable);
        } else if (filters.status === 'disabled') {
            result = result.filter(customer => customer.isDisable);
        }

        // Lọc theo giới tính
        if (filters.gender) {
            result = result.filter(customer =>
                customer.sex === filters.gender
            );
        }

        // Sắp xếp kết quả
        result.sort((a, b) => {
            const order = filters.order === 'asc' ? 1 : -1; // 1 là tăng dần, -1 là giảm dần
            switch (filters.sort) {
                case 'fullName':
                    return order * ((a.fullname || '').localeCompare(b.fullname || ''));
                case 'email':
                    return order * ((a.email || '').localeCompare(b.email || ''));
                case 'createAt':
                default:
                    return order * (new Date(a.createAt || 0) - new Date(b.createAt || 0));
            }
        });

        // Cập nhật state với kết quả đã lọc
        setFilteredCustomers(result);
        setTotalPages(calculateTotalPages());

        // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
        if (currentPage > calculateTotalPages()) {
            setCurrentPage(1);
        }
    }, [searchTerm, filters, allCustomers, itemsPerPage, currentPage]);

    // 3. Hàm xử lý thay đổi bộ lọc
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Hàm xử lý vô hiệu hóa/kích hoạt tài khoản
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            // Gọi API để thay đổi trạng thái
            await axios.patch(`/api/admins/customers/${id}/toggle-status`);

            // Cập nhật state local
            // Cập nhật lại danh sách local
            // Tìm và update trạng thái của khách hàng có ID tương ứng
            const updatedCustomers = allCustomers.map(customer => {
                if (customer._id === id) {
                    // Đổi trạng thái của khách hàng (active -> disable, disable -> active)
                    return { ...customer, isDisable: !customer.isDisable };
                } else {
                    // Giữ nguyên
                    return customer;
                }
            });
            setAllCustomers(updatedCustomers);

            // Hiển thị thông báo thành công
            toast.success(`${currentStatus ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`);
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Không thể thay đổi trạng thái tài khoản');
        }
    };

    // 5. Hàm xử lý xóa khách hàng
    const handleDelete = async (id) => {
        // Hiển thị hộp thoại xác nhận
        if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
            try {
                // Gọi API để xóa
                await axios.delete(`/api/admins/customers/${id}`);

                // Cập nhật state local bằng cách lọc bỏ khách hàng đã xóa
                const updatedCustomers = allCustomers.filter(customer => customer._id !== id);
                setAllCustomers(updatedCustomers);

                // Hiển thị thông báo thành công
                toast.success('Xóa khách hàng thành công');
            } catch (error) {
                console.error('Error deleting customer:', error);
                toast.error('Không thể xóa khách hàng');
            }
        }
    };

    // 6. Hàm xử lý mở modal chỉnh sửa
    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    // 7. Hàm xử lý cập nhật thông tin khách hàng
    const handleUpdate = async (e) => {
        e.preventDefault(); // Ngăn form submit mặc định
        try {
            // Gọi API để cập nhật
            const response = await axios.put(`/api/admins/customers/update/${editingCustomer._id}`, editingCustomer);

            if (response.status === 200) {
                // Cập nhật lại danh sách local
                const updatedCustomers = allCustomers.map(customer => {
                    if (customer._id === editingCustomer._id) {
                        // Cập nhật lại khách hàng
                        return { ...customer, ...response.data.customer };
                    } else {
                        // Giữ nguyên
                        return customer;
                    }
                });
                setAllCustomers(updatedCustomers);

                // Đóng modal và reset state
                setIsModalOpen(false);
                setEditingCustomer(null);

                // Hiển thị thông báo thành công
                toast.success('Cập nhật thông tin thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    // 8. Các hàm tiện ích cho phân trang
    // Lấy danh sách khách hàng cho trang hiện tại
    const getCurrentCustomers = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCustomers.slice(startIndex, endIndex);
    };

    // Tính tổng số trang
    const calculateTotalPages = () => {
        return Math.ceil(filteredCustomers.length / itemsPerPage);
    };

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
    };

    // Modal chỉnh sửa
    const EditModal = () => (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isModalOpen ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <form onSubmit={handleUpdate}>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mb-4">
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={editingCustomer?.fullname || ''}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, fullname: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                                        }`}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editingCustomer?.email || ''}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                                        }`}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={editingCustomer?.phone || ''}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                                        }`}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                    Giới tính
                                </label>
                                <select
                                    value={editingCustomer?.sex || ''}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, sex: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                                        }`}
                                    required
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cập nhật
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${isDarkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                    }`}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
            <div className="container mx-auto px-4">
                {/* Thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 transition-all hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tổng số khách hàng</h3>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{filteredCustomers.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 transition-all hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Đang hoạt động</h3>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {filteredCustomers.filter(c => !c.isDisable).length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 transition-all hover:shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Đã vô hiệu hóa</h3>
                                <p className="text-3xl font-bold text-red-600 mt-2">
                                    {filteredCustomers.filter(c => c.isDisable).length}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bộ lọc và tìm kiếm */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow mb-6`}>
                    <div className="p-4">
                        <div className="flex flex-wrap gap-4">
                            {/* Tìm kiếm */}
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-200'
                                            }`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FiSearch className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                            </div>

                            {/* Lọc theo trạng thái */}
                            <select
                                className={`min-w-[210px] border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:bg-opacity-90 cursor-pointer ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'
                                    }`}
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái ({filteredCustomers.length})</option>
                                <option value="active">Đang hoạt động ({filteredCustomers.filter(c => !c.isDisable).length})</option>
                                <option value="disabled">Đã vô hiệu hóa ({filteredCustomers.filter(c => c.isDisable).length})</option>
                            </select>

                            {/* Lọc theo giới tính */}
                            <select
                                className={`min-w-[160px] border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:bg-opacity-90 cursor-pointer ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'
                                    }`}
                                value={filters.gender}
                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                            >
                                <option value="">Tất cả giới tính</option>
                                <option value="Nam">Nam ({filteredCustomers.filter(c => c.sex === 'Nam').length})</option>
                                <option value="Nữ">Nữ ({filteredCustomers.filter(c => c.sex === 'Nữ').length})</option>
                            </select>

                            {/* Sắp xếp */}
                            <select
                                className={`min-w-[120px] border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:bg-opacity-90 cursor-pointer ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'
                                    }`}
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="createAt">Ngày tạo</option>
                                <option value="fullName">Tên</option>
                                <option value="email">Email</option>
                            </select>

                            <select
                                className={`min-w-[120px] border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:bg-opacity-90 cursor-pointer ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200'
                                    }`}
                                value={filters.order}
                                onChange={(e) => handleFilterChange('order', e.target.value)}
                            >
                                <option value="desc">Giảm dần</option>
                                <option value="asc">Tăng dần</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bảng danh sách khách hàng */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Họ và tên
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Giới tính
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Email
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Số điện thoại
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Trạng thái
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="flex justify-center items-center space-x-2">
                                                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : getCurrentCustomers().length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Không tìm thấy khách hàng nào
                                        </td>
                                    </tr>
                                ) : (
                                    getCurrentCustomers().map((customer, index) => (
                                        <tr
                                            key={customer._id}
                                            className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiUser className="mr-2 text-green-500" />
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        {customer.fullname}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {customer.sex}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {customer.email}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {customer.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.isDisable
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {customer.isDisable ? 'Đã vô hiệu hóa' : 'Đang hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className={`transition-colors ${isDarkMode
                                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                            }`}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <FiEdit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(customer._id, customer.isDisable)}
                                                        className={`${customer.isDisable
                                                                ? 'text-green-600 hover:text-green-900'
                                                                : 'text-red-600 hover:text-red-900'
                                                            }`}
                                                        title={customer.isDisable ? 'Kích hoạt' : 'Vô hiệu hóa'}
                                                    >
                                                        {customer.isDisable ? (
                                                            <FiUserCheck className="w-5 h-5" />
                                                        ) : (
                                                            <FiUserX className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer._id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Phân trang */}
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
            </div>
            {EditModal()}
        </div>
    );
};

export default Customers;
