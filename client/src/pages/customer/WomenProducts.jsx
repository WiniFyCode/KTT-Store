// WomenProducts.jsx - Trang sản phẩm Nữ
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSortAmountDown, FaHeart } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomerThemeContext';
import { getProductsData } from '../../data/ProductsData';
import PageBanner from '../../components/PageBanner';
import { FaTags } from 'react-icons/fa';

const WomenProducts = () => {
  const { theme } = useTheme();
  const [productsData, setProductsData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [selectedTag, setSelectedTag] = useState('Tất Cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Khởi tạo dữ liệu
  useEffect(() => {
    const data = getProductsData(theme);
    // Lọc chỉ lấy sản phẩm Nữ
    const womenProducts = {
      ...data,
      products: data.products.filter(product => product.gender === 'Nữ')
    };
    setProductsData(womenProducts);
    setProducts(womenProducts.products);
    setSelectedPriceRange(data.priceRanges[0]);
  }, [theme]);

  // Format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Tính giá sau khi giảm
  const calculateDiscountPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Lọc và sắp xếp sản phẩm
  useEffect(() => {
    if (!productsData) return;

    let filteredProducts = productsData.products;

    // Lọc theo danh mục
    if (selectedCategory !== 'Tất Cả') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Lọc theo tag
    if (selectedTag !== 'Tất Cả') {
      filteredProducts = filteredProducts.filter(product => product.tag === selectedTag);
    }

    // Lọc theo khoảng giá
    if (selectedPriceRange) {
      filteredProducts = filteredProducts.filter(product => {
        const price = calculateDiscountPrice(product.price, product.discount);
        return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp sản phẩm
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => calculateDiscountPrice(a.price, a.discount) - calculateDiscountPrice(b.price, b.discount));
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => calculateDiscountPrice(b.price, b.discount) - calculateDiscountPrice(a.price, a.discount));
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setProducts(filteredProducts);
    setCurrentPage(1);
  }, [productsData, selectedCategory, selectedTag, selectedPriceRange, searchTerm, sortBy]);

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!productsData) return null;

  return (
    <div className={`min-h-screen ${theme === 'tet' ? 'bg-red-50' : 'bg-gray-50'}`}>
      <PageBanner
        theme={theme}
        icon={FaTags}
        title="Thời Trang Nữ"
        subtitle="Phong cách thời thượng, quyến rũ cho phái đẹp"
        breadcrumbText="Thời trang nữ"
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
                  placeholder="Tìm kiếm sản phẩm nữ..."
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Danh mục</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {productsData.categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giá</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  value={selectedPriceRange?.label}
                  onChange={(e) => setSelectedPriceRange(productsData.priceRanges.find(range => range.label === e.target.value))}
                >
                  {productsData.priceRanges.map((range, index) => (
                    <option key={index} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sắp xếp</label>
                <select
                  className="w-full h-12 px-4 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-16 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <FaSearch className="text-gray-400 text-3xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500">Vui lòng thử lại với bộ lọc khác</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Nút yêu thích */}
                    <button 
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        theme === 'tet' 
                          ? 'bg-red-50 hover:bg-red-100 text-red-500'
                          : 'bg-white hover:bg-gray-100 text-gray-500 hover:text-red-500'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        // Chức năng yêu thích sẽ được thêm sau
                      }}
                    >
                      <FaHeart className="text-lg" />
                    </button>
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    {product.tag && (
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl text-white px-3 py-1 rounded-lg font-medium">
                        {product.tag}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(calculateDiscountPrice(product.price, product.discount))}đ
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}đ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      {!product.inStock && (
                        <span className="text-sm text-red-500 font-medium">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${currentPage === number
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WomenProducts;
