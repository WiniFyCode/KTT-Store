// Products.jsx - Trang danh sách sản phẩm
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSortAmountDown, FaMars, FaVenus } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomerThemeContext';
import PageBanner from '../../components/PageBanner';
import { FaTags } from 'react-icons/fa';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';

const Products = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    targetId: '',
    minPrice: 0,
    maxPrice: Number.MAX_SAFE_INTEGER,
    sortBy: 'newest',
    inStock: true
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...filters
      });

      const response = await axiosInstance.get(`/api/admins/products/customer?${queryParams}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1
  };

  // Format price
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={`min-h-screen ${theme === 'tet' ? 'bg-red-50' : 'bg-gray-50'}`}>
      <PageBanner
        theme={theme}
        icon={FaTags}
        title={theme === 'tet' ? 'BST TẾT 2025' : 'Bộ Sưu Tập Mới'}
        subtitle={theme === 'tet' 
          ? 'Rực rỡ sắc xuân - Đón năm mới an khang' 
          : 'Khám phá phong cách thời trang độc đáo của bạn'
        }
        breadcrumbText="Sản phẩm"
      />

      <div className="container mx-auto px-4 mt-3 pb-20">
        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 mb-12">
          <div className="space-y-8">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sắp xếp</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Khoảng giá</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-');
                    handleFilterChange('minPrice', min);
                    handleFilterChange('maxPrice', max);
                  }}
                >
                  <option value="0-999999999">Tất cả giá</option>
                  <option value="0-100000">Dưới 100,000đ</option>
                  <option value="100000-300000">100,000đ - 300,000đ</option>
                  <option value="300000-500000">300,000đ - 500,000đ</option>
                  <option value="500000-1000000">500,000đ - 1,000,000đ</option>
                  <option value="1000000-999999999">Trên 1,000,000đ</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tình trạng</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  value={filters.inStock.toString()}
                  onChange={(e) => handleFilterChange('inStock', e.target.value === 'true')}
                >
                  <option value="true">Còn hàng</option>
                  <option value="false">Tất cả</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.thumbnail 
                        ? `http://localhost:5000/public/uploads/products/${product.thumbnail}`
                        : '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Hết hàng</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-bold">
                        {formatPrice(product.price)}đ
                      </span>
                      <span className="text-sm text-gray-500">
                        Còn {product.totalStock} sản phẩm
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded-xl ${
                    pagination.hasPrevPage
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Trước
                </button>
                <span className="px-4 py-2 bg-white rounded-xl">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded-xl ${
                    pagination.hasNextPage
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
