import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiPackage, FiDollarSign, FiTrendingUp, FiFilter, FiCalendar, FiTag, FiX, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTheme } from '../../contexts/AdminThemeContext';
import { formatDate } from '../../utils/dateUtils';

// Custom hook để debounce giá trị
// Sau khi người dùng ngừng gõ 500ms, request API mới được gửi đi
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const ProductManagement = () => {
    // Lấy theme hiện tại (sáng/tối) từ context
    const { isDarkMode } = useTheme();

    // Khai báo API_URL_Image
    const API_URL_Image = 'http://localhost:5000';

    // Modal
    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="flex items-center justify-center min-h-screen p-4">
                    <div
                        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <FiX className="w-6 h-6" />
                        </button>

                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // ===== STATES =====
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]); // Lưu toàn bộ danh sách sản phẩm
    const [displayedProducts, setDisplayedProducts] = useState([]); // Danh sách sản phẩm đang hiển thị
    const [categories, setCategories] = useState([]); // Danh sách danh mục
    const [targets, setTargets] = useState([]); // Danh sách đối tượng
    const [loading, setLoading] = useState(true);

    // ===== STATE CHO TÌM KIẾM VÀ LỌC =====
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce 500ms
    const [filters, setFilters] = useState({
        category: 'all',
        target: 'all',
        priceRange: 'all',
        sort: 'createAt',
        order: 'desc'
    });

    // ===== STATE CHO PHÂN TRANG =====
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10
    });

    // ===== STATE CHO THỐNG KÊ =====
    const [stats, setStats] = useState({
        total: 0,
        totalValue: 0,
        avgPrice: 0
    });

    // Thêm state để theo dõi variant đang được chọn để chỉnh sửa
    const [selectedVariant, setSelectedVariant] = useState(null);

    // State quản lý modal chỉnh sửa biến thể
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [currentVariantGroup, setCurrentVariantGroup] = useState(null);

    // State cho modal quản lý biến thể
    const [isVariantManageModalOpen, setIsVariantManageModalOpen] = useState(false);
    const [isVariantEditModalOpen, setIsVariantEditModalOpen] = useState(false);

    // Format giá tiền
    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Xử lý input giá
    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setEditingProduct({ ...editingProduct, price: Number(value) });
    };

    // Xử lý khi upload ảnh
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Tạo preview cho ảnh mới upload
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setEditingProduct(prev => ({
            ...prev,
            images: [...(prev.images || []), ...newImages]
        }));
    };

    // Xử lý xóa ảnh đã tải lên
    const handleRemoveUploadedImage = (index) => {
        setEditingProduct(prev => {
            const newImages = [...prev.images];
            // Xóa URL.createObjectURL để tránh memory leak
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return {
                ...prev,
                images: newImages
            };
        });
    };

    // Xử lý xóa ảnh hiện có
    const handleRemoveExistingImage = async (imageId, index) => {
        try {
            await axios.delete(`/api/admins/images/delete/${imageId}`);
            setEditingProduct(prev => ({
                ...prev,
                existingImages: prev.existingImages.filter((_, i) => i !== index)
            }));
            toast.success('Xóa ảnh thành công');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Lỗi khi xóa ảnh');
        }
    };

    // Xử lý khi nhấn nút chỉnh sửa
    const handleEditProduct = async (product) => {
        try {
            // Lấy thông tin chi tiết sản phẩm và variants
            const [detailsResponse, thumbnailResponse] = await Promise.all([
                axios.get(`/api/admins/products/get/${product._id}`),
                axios.get(`/api/admins/images/thumbnail/${product._id}`)
            ]);

            const productDetails = detailsResponse.data;
            const thumbnailURL = thumbnailResponse.data;

            // Chuẩn bị thông tin ảnh
            const existingImages = thumbnailURL ? [{
                _id: 'thumbnail',
                imageURL: thumbnailURL,
                preview: `${API_URL_Image}/public/uploads/products/${thumbnailURL}`
            }] : [];

            // Cập nhật state với thông tin đầy đủ
            setEditingProduct({
                ...productDetails,
                existingImages,
                variants: productDetails.variants || [],
                categoryID: productDetails.categoryID?._id || productDetails.categoryID,
                targetID: productDetails.targetID?._id || productDetails.targetID,
                categoryName: productDetails.categoryID?.name,
                targetName: productDetails.targetID?.name
            });

            // Mở modal chỉnh sửa
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
            toast.error('Không thể lấy thông tin sản phẩm');
        }
    };

    // Xử lý thêm variant
    const handleAddVariant = () => {
        setEditingProduct(prev => ({
            ...prev,
            variants: [...(prev.variants || []), {
                size: '',
                color: '',
                quantity: 0,
                price: prev.price || 0
            }]
        }));
    };

    // Xử lý xóa variant
    const handleDeleteVariant = (index) => {
        setEditingProduct(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    // Xử lý cập nhật variant
    const handleUpdateVariant = (index, field, value) => {
        setEditingProduct(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            )
        }));
    };

    // Hàm xử lý chọn variant để chỉnh sửa
    const handleSelectVariant = (group, variant) => {
        if (!group || !variant) return;
        setSelectedVariant({
            group,
            variant
        });
    };

    // Hàm cập nhật chi tiết variant
    const updateVariantDetails = (field, value) => {
        if (!selectedVariant || !editingProduct) return;

        const updatedImages = editingProduct.existingImages?.map(group => {
            if (group.color === selectedVariant.group.color) {
                return {
                    ...group,
                    variants: group.variants.map(variant =>
                        variant._id === selectedVariant.variant._id
                            ? { ...variant, [field]: value }
                            : variant
                    )
                };
            }
            return group;
        }) || [];

        setEditingProduct(prev => ({
            ...prev,
            existingImages: updatedImages
        }));
    };

    // Hàm mở modal chỉnh sửa biến thể
    const openVariantModal = (group) => {
        if (!group) return;
        setCurrentVariantGroup(group);
        setIsVariantModalOpen(true);
    };

    // Hàm thêm biến thể mới
    const addNewVariant = () => {
        if (!currentVariantGroup) return;

        const newVariant = {
            _id: `temp_${Date.now()}`, // Tạm thởi để phân biệt
            productID: editingProduct._id,
            color: currentVariantGroup.color,
            size: '', // Để người dùng nhập
            stock: 0,
            price: editingProduct.price // Mặc định lấy giá sản phẩm
        };

        const updatedImages = editingProduct.existingImages?.map(group => {
            if (group.color === currentVariantGroup.color) {
                return {
                    ...group,
                    variants: [...group.variants, newVariant]
                };
            }
            return group;
        }) || [];

        setEditingProduct(prev => ({
            ...prev,
            existingImages: updatedImages
        }));
    };

    // Hàm xóa biến thể
    const removeVariant = (groupColor, variantId) => {
        const updatedImages = editingProduct.existingImages?.map(group => {
            if (group.color === groupColor) {
                return {
                    ...group,
                    variants: group.variants.filter(variant => variant._id !== variantId)
                };
            }
            return group;
        }) || [];

        setEditingProduct(prev => ({
            ...prev,
            existingImages: updatedImages
        }));
    };

    // Hàm cập nhật thông tin biến thể
    const updateVariantInfo = (groupColor, variantId, field, value) => {
        const updatedImages = editingProduct.existingImages?.map(group => {
            if (group.color === groupColor) {
                return {
                    ...group,
                    variants: group.variants.map(variant =>
                        variant._id === variantId
                            ? { ...variant, [field]: value }
                            : variant
                    )
                };
            }
            return group;
        }) || [];

        setEditingProduct(prev => ({
            ...prev,
            existingImages: updatedImages
        }));
    };

    // Hàm mở modal quản lý biến thể
    const openVariantManageModal = () => {
        setIsVariantManageModalOpen(true);
    };

    // Hàm mở modal chỉnh sửa biến thể
    const openVariantEditModal = (group) => {
        if (!group) return;
        setCurrentVariantGroup(group);
        setIsVariantEditModalOpen(true);
    };

    // Lấy danh sách sản phẩm khi component mount hoặc khi các filter thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Lấy danh mục và đối tượng
                const [categoriesRes, targetsRes] = await Promise.all([
                    axios.get('/api/admins/categories'),
                    axios.get('/api/admins/targets')
                ]);

                setCategories(categoriesRes.data);
                setTargets(targetsRes.data);

                // Xây dựng query params cho filter API
                const params = new URLSearchParams();
                if (debouncedSearchTerm) params.append('searchTerm', debouncedSearchTerm);
                if (filters.category !== 'all') params.append('category', filters.category);
                if (filters.target !== 'all') params.append('target', filters.target);

                // Xử lý filter giá
                if (filters.priceRange !== 'all') {
                    params.append('priceRange', filters.priceRange);
                }

                // Xử lý sắp xếp giá
                if (filters.sort === 'price') {
                    params.append('priceSort', filters.order);
                }

                params.append('page', pagination.currentPage);

                // Gọi API filter
                const productsRes = await axios.get(`/api/admins/products/filter?${params}`);

                const { products, pagination: paginationData } = productsRes.data;
                setDisplayedProducts(products);
                setPagination(paginationData);

                // Tính toán thống kê
                const total = paginationData.total;
                const totalValue = products.reduce((sum, product) => sum + product.price, 0);
                const avgPrice = total > 0 ? totalValue / total : 0;

                setStats({
                    total,
                    totalValue,
                    avgPrice
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedSearchTerm, filters, pagination.currentPage]);

    // Hàm render phân trang
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
                    className={`px-3 py-1 mx-1 rounded ${pagination.currentPage === i
                            ? 'bg-blue-500 text-white'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded ${pagination.currentPage === 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Trước
                </button>
                {pages}
                <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded ${pagination.currentPage === pagination.totalPages
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Sau
                </button>
            </div>
        );
    };

    // ===== HANDLERS =====

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý thêm sản phẩm mới
    const handleAddProduct = () => {
        // Khởi tạo sản phẩm mới với variants là mảng rỗng
        setEditingProduct({
            name: '',
            description: '',
            price: 0,
            images: [],
            variants: [], // Khởi tạo variants là mảng rỗng
            categoryID: '',
            targetID: ''
        });
        setIsModalOpen(true);
    };

    // Xử lý lưu sản phẩm
    const handleSave = async () => {
        try {
            // Validate dữ liệu
            if (!editingProduct.name || !editingProduct.price || !editingProduct.categoryID || !editingProduct.targetID) {
                toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
                return;
            }

            let productId = editingProduct._id;

            // Nếu là thêm mới
            if (!productId) {
                const productResponse = await axios.post('/api/admins/products/create', {
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    categoryID: editingProduct.categoryID,
                    targetID: editingProduct.targetID
                });
                productId = productResponse.data._id;
            } else {
                // Nếu là cập nhật
                await axios.put(`/api/admins/products/update/${productId}`, {
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    categoryID: editingProduct.categoryID,
                    targetID: editingProduct.targetID
                });
            }

            // Upload ảnh mới nếu có
            if (editingProduct.images?.length > 0) {
                for (const image of editingProduct.images) {
                    const formData = new FormData();
                    formData.append('image', image.file);
                    formData.append('productID', productId);
                    formData.append('isThumbnail', !editingProduct.existingImages?.some(img => img.isThumbnail));

                    await axios.post('/api/admins/images/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
            }

            setIsModalOpen(false);
            fetchProducts(); // Refresh danh sách
            toast.success(editingProduct._id ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Có lỗi xảy ra khi lưu sản phẩm');
        }
    };

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const response = await axios.delete(`/api/admins/products/delete/${id}`);
                if (response.status === 200) {
                    // Cập nhật state ngay lập tức
                    const updatedProducts = allProducts.filter(product => product._id !== id);
                    setAllProducts(updatedProducts);

                    // Cập nhật displayedProducts
                    const updatedDisplayed = displayedProducts.filter(product => product._id !== id);
                    setDisplayedProducts(updatedDisplayed);

                    // Cập nhật stats
                    calculateStats(updatedProducts);

                    toast.success('Xóa sản phẩm thành công');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    // Hàm xử lý chỉnh sửa biến thể
    const handleEditVariants = async (product) => {
        try {
            // Gọi API lấy variants và danh sách file
            const [variantsResponse, filesResponse] = await Promise.all([
                axios.get(`/api/admins/product-variants/get/${product._id}`),
                axios.get('/api/files')
            ]);

            const variants = variantsResponse.data;
            const existingFiles = filesResponse.data;

            // Lấy variantID đầu tiên để truy vấn hình ảnh
            if (variants && variants.length > 0) {
                const firstVariant = variants[0];
                const imagesResponse = await axios.get(`/api/admins/images/variants/${firstVariant._id}`);
                const variantImages = imagesResponse.data;

                // Lọc các hình ảnh tồn tại trong thư mục
                const validImages = variantImages.filter(filename =>
                    existingFiles.includes(filename)
                ).map(filename => ({
                    filename,
                    url: `${API_URL_Image}/public/uploads/products/${filename}`
                }));

                // Nhóm các biến thể theo màu sắc và gán cùng một imageUrls
                const groupedVariants = variants.reduce((acc, variant) => {
                    const color = variant.color;
                    if (!acc[color]) {
                        acc[color] = {
                            color: color,
                            variants: []
                        };
                    }
                    acc[color].variants.push({
                        _id: variant._id,
                        size: variant.size,
                        stock: variant.stock,
                        images: validImages
                    });
                    return acc;
                }, {});

                setEditingProduct({
                    ...editingProduct,
                    existingImages: Object.values(groupedVariants)
                });
                setIsVariantEditModalOpen(true);
            } else {
                toast.error('Không tìm thấy biến thể nào');
            }
        } catch (error) {
            console.error('Lỗi khi xử lý variants:', error);
            toast.error('Không thể lấy thông tin biến thể');
        }
    };

    // Hàm xóa hình ảnh
    const handleDeleteImage = async (image, variantId) => {
        try {
            await axios.delete(`/api/admins/images/variants/${variantId}/${image.filename}`);
            toast.success('Đã xóa hình ảnh thành công');
            // Cập nhật lại danh sách hình ảnh
            handleEditVariants(editingProduct);
        } catch (error) {
            console.error('Lỗi khi xóa hình ảnh:', error);
            toast.error('Không thể xóa hình ảnh');
        }
    };

    // Hàm chuyển đổi URL hình ảnh
    const getImageUrl = (filename) => {
        if (!filename) return '';
        return `${API_URL_Image}/public/uploads/products/${filename}`;
    };

    // Hàm lưu thay đổi biến thể
    const handleSaveVariants = async () => {
        try {
            if (!editingProduct?._id) return;

            await axios.put(`/api/admins/product-variants/update/${editingProduct._id}`, {
                variants: editingProduct.existingImages
            });

            setIsVariantEditModalOpen(false);
            fetchProducts();
            toast.success('Cập nhật biến thể thành công');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không thể cập nhật biến thể');
        }
    };

    // Tính toán thống kê
    const calculateStats = (products) => {
        const total = products.length;
        const totalValue = products.reduce((sum, product) => sum + product.price, 0);
        const avgPrice = total > 0 ? Math.round(totalValue / total) : 0;

        setStats({
            total,
            totalValue,
            avgPrice
        });
    };

    // Hàm hiển thị hình ảnh biến thể
    const renderVariantImages = (group) => {
        const variant = group.variants[0];
        if (!variant?.images?.length) return null;

        return (
            <div className="mb-6">
                <h4 className="font-medium mb-3">Hình ảnh biến thể:</h4>
                <div className="grid grid-cols-5 gap-4">
                    {/* Hiển thị ảnh hiện có */}
                    {variant.images.map((image, index) => (
                        <div key={`${variant._id}_${image.filename}`} className="relative group">
                            <img
                                src={image.url}
                                alt={`Variant ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-lg">
                                <button
                                    onClick={() => handleDeleteImage(image, variant._id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Nút thêm ảnh mới */}
                    <div className="relative">
                        <input
                            type="file"
                            id={`image-upload-${group.color}`}
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, variant._id)}
                            className="hidden"
                        />
                        <label
                            htmlFor={`image-upload-${group.color}`}
                            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
                        >
                            <FiPlus className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500 mt-2">Thêm ảnh</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    // ===== RENDER =====
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                <button
                    onClick={handleAddProduct}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                >
                    <FiPlus className="mr-2" /> Thêm sản phẩm
                </button>
            </div>

            {/* Phần thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transform hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold mb-2">Tổng sản phẩm</h3>
                        <FiPackage className="text-2xl text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-500">{stats.total}</p>
                </div>
                <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transform hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold mb-2">Tổng giá trị</h3>
                        <FiDollarSign className="text-2xl text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-500">{formatPrice(stats.totalValue)}đ</p>
                </div>
                <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transform hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold mb-2">Giá trung bình</h3>
                        <FiTrendingUp className="text-2xl text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-500">{formatPrice(stats.avgPrice)}đ</p>
                </div>
            </div>

            {/* Phần tìm kiếm và lọc */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="all">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={filters.target}
                        onChange={(e) => handleFilterChange('target', e.target.value)}
                    >
                        <option value="all">Tất cả đối tượng</option>
                        {targets.map(target => (
                            <option key={target._id} value={target._id}>
                                {target.target}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    >
                        <option value="all">Tất cả giá</option>
                        <option value="under500">Dưới 500.000đ</option>
                        <option value="500to1000">500.000đ - 1.000.000đ</option>
                        <option value="above1000">Trên 1.000.000đ</option>
                    </select>
                </div>
                <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={filters.sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                        <option value="createAt">Ngày tạo</option>
                        <option value="name">Tên</option>
                        <option value="price">Giá</option>
                    </select>
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        className={`pl-10 p-2 border rounded w-full ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } transition-colors duration-200`}
                        value={filters.order}
                        onChange={(e) => handleFilterChange('order', e.target.value)}
                    >
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </select>
                </div>
            </div>

            {/* Bảng danh sách sản phẩm */}
            <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <table className="min-w-full">
                    <thead>
                        <tr className={isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}>
                            <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                            <th className="px-4 py-2 text-left">Giá</th>
                            <th className="px-4 py-2 text-left">Danh mục</th>
                            <th className="px-4 py-2 text-left">Đối tượng</th>
                            <th className="px-4 py-2 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedProducts.map(product => (
                            <tr key={product._id} className={`border-b ${isDarkMode
                                    ? 'border-gray-700 hover:bg-gray-700 text-gray-200'
                                    : 'hover:bg-gray-50'
                                }`}>
                                <td className="px-4 py-2 font-medium">
                                    {product.name.length > 27
                                        ? `${product.name.substring(0, 30)}...`
                                        : product.name}
                                </td>
                                <td className="px-4 py-2 font-medium text-green-500">{formatPrice(product.price)}đ</td>
                                <td className="px-4 py-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                        {product.categoryID.name}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.targetID.target === 'Nam'
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'bg-pink-100 text-pink-600'
                                        }`}>
                                        {product.targetID.target}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="p-2 text-blue-600 hover:text-blue-800"
                                            title="Chỉnh sửa sản phẩm"
                                        >
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEditVariants(product)}
                                            className="p-2 text-green-600 hover:text-green-800"
                                            title="Chỉnh sửa biến thể"
                                        >
                                            <FiLayers className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="p-2 text-red-600 hover:text-red-800"
                                            title="Xóa sản phẩm"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
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

            {/* Modal chỉnh sửa/thêm mới */}
            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
            }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {editingProduct?._id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                            setEditingProduct(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    ID: {editingProduct?._id || 'Chưa có (sản phẩm mới)'}
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Thông tin cơ bản */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                                    <FiPackage className="mr-2" /> Thông tin sản phẩm
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tên sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            value={editingProduct?.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Mô tả
                                        </label>
                                        <textarea
                                            value={editingProduct?.description}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Giá bán
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiDollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={editingProduct?.price}
                                                onChange={handlePriceChange}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {formatPrice(editingProduct?.price)} VNĐ
                                        </div>
                                    </div>

                                    {/* Phần hiển thị ảnh */}
                                    <div className="mb-4">
                                        <label className="block mb-2">Hình ảnh sản phẩm</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 015.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Tải ảnh lên</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                    <p className="pl-1">hoặc kéo thả vào đây</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                                            </div>
                                        </div>

                                        {/* Hiển thị ảnh đã tải lên */}
                                        {editingProduct?.images?.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-4">
                                                {editingProduct.images.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={image.preview}
                                                            alt={`Product ${index + 1}`}
                                                            className="h-24 w-24 object-cover rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                            onClick={() => handleRemoveUploadedImage(index)}
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Hiển thị ảnh có sẵn */}
                                        {editingProduct?.existingImages?.length > 0 && (
                                            <div className="mt-4 grid grid-cols-1 gap-4">
                                                {editingProduct.existingImages.map((image) => (
                                                    <div key={image._id} className="relative">
                                                        <img
                                                            src={image.preview}
                                                            alt="Product thumbnail"
                                                            className="h-48 w-48 object-contain rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phân loại */}
                        <div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                                    <FiFilter className="mr-2" /> Phân loại
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Danh mục
                                        </label>
                                        <select
                                            value={editingProduct?.categoryID || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryID: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Đối tượng
                                        </label>
                                        <select
                                            value={editingProduct?.targetID || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, targetID: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            required
                                        >
                                            <option value="">Chọn đối tượng</option>
                                            {targets.map(target => (
                                                <option key={target._id} value={target._id}>
                                                    {target.target}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingProduct(null);
                            }}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {editingProduct?._id ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal chỉnh sửa biến thể */}
            {isVariantEditModalOpen && editingProduct && (
                <Modal isOpen={isVariantEditModalOpen} onClose={() => setIsVariantEditModalOpen(false)}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chỉnh sửa biến thể - {editingProduct.name}
                        </h2>
                        <button
                            onClick={() => setIsVariantEditModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-4">
                        {editingProduct.existingImages?.map((group, groupIndex) => (
                            <div key={`${group.color}_${groupIndex}`} className="mb-6 border-b pb-4">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-6 h-6 rounded-full mr-2"
                                        style={{ backgroundColor: group.color }}
                                    />
                                    <span className="font-semibold">{group.color}</span>
                                </div>

                                {/* Phần hiển thị hình ảnh */}
                                {renderVariantImages(group)}

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">Kích thước</th>
                                                <th className="px-4 py-2">Số lượng</th>
                                                <th className="px-4 py-2">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.variants?.map((variant, variantIndex) => (
                                                <tr key={variant._id || `${group.color}_${variantIndex}`}>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="text"
                                                            value={variant.size}
                                                            onChange={(e) => updateVariantInfo(
                                                                group.color,
                                                                variant._id,
                                                                'size',
                                                                e.target.value
                                                            )}
                                                            className="w-full px-3 py-1 border rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={variant.stock}
                                                            onChange={(e) => updateVariantInfo(
                                                                group.color,
                                                                variant._id,
                                                                'stock',
                                                                Number(e.target.value)
                                                            )}
                                                            className="w-full px-3 py-1 border rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariant(group.color, variant._id)}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addNewVariant(group.color)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                                >
                                    <FiPlus className="w-5 h-5 mr-2" />
                                    Thêm kích thước
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setIsVariantEditModalOpen(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveVariants}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductManagement;
