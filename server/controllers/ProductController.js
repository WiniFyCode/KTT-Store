const Product = require('../models/Product');
const Category = require('../models/Category');
const Target = require('../models/Target');
const ProductColor = require('../models/ProductColor');
const ProductSizeStock = require('../models/ProductSizeStock');

class ProductController {
    // Lấy danh sách sản phẩm với phân trang và lọc
    async getProducts(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = '-createdAt',
                category,
                target,
                minPrice,
                maxPrice,
                search,
                isActivated = true
            } = req.query;

            // Xây dựng query
            const query = { isActivated };

            // Thêm điều kiện lọc
            if (category) query.categoryID = category;
            if (target) query.targetID = target;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = minPrice;
                if (maxPrice) query.price.$lte = maxPrice;
            }
            if (search) {
                query.$text = { $search: search };
            }

            // Thực hiện query với phân trang
            const products = await Product.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('targetInfo')
                .populate('categoryInfo');
            //! PHAI DEM COLOR ID DE TRUY VAN QUA BANG SIZESTOCK LAY RA SIZE S , M , L
            // Lấy colors và sizes cho từng sản phẩm
            const productsWithDetails = await Promise.all(products.map(async (product) => {
                const colors = await ProductColor.find({ productID: product.productID });
                const colorsWithSizes = await Promise.all(colors.map(async (color) => {
                    const sizes = await ProductSizeStock.find({ colorID: color.colorID });
                    return {
                        ...color.toObject(),
                        sizes
                    };
                }));
                return {
                    ...product.toObject(),
                    colors: colorsWithSizes
                };
            }));

            // Đếm tổng số sản phẩm
            const total = await Product.countDocuments(query);

            res.json({
                products: productsWithDetails,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
                error: error.message
            });
        }
    }

    // Lấy danh sách sản phẩm cho ADMIN với prefetch
    async getProductsChoADMIN(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = '-createdAt',
                category,
                target,
                minPrice,
                maxPrice,
                search,
                isActivated,
                prefetch = false // Thêm option prefetch
            } = req.query;

            // Xây dựng query
            const query = {};
            if (typeof isActivated !== 'undefined') {
                query.isActivated = isActivated === 'true';
            }

            // Thêm điều kiện lọc
            if (category) query.categoryID = category;
            if (target) query.targetID = target;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = minPrice;
                if (maxPrice) query.price.$lte = maxPrice;
            }
            if (search) {
                query.$text = { $search: search };
            }

            // Tính toán số lượng sản phẩm cần lấy
            const currentPage = parseInt(page);
            const itemsPerPage = parseInt(limit);
            const prefetchPages = prefetch ? 2 : 0; // Số trang muốn tải trước
            const totalItemsToFetch = itemsPerPage * (1 + prefetchPages); // Số items cần lấy (bao gồm cả prefetch)
            const skipItems = (currentPage - 1) * itemsPerPage;

            // Thực hiện query với prefetch
            const products = await Product.find(query)
                .select('productID name price thumbnail isActivated categoryID targetID createdAt')
                .sort(sort)
                .skip(skipItems)
                .limit(totalItemsToFetch)
                .populate('targetInfo', 'targetID name')
                .populate('categoryInfo', 'categoryID name');

            // Lấy colors và sizes cho từng sản phẩm (chỉ lấy thông tin cần thiết)
            const productsWithDetails = await Promise.all(products.map(async (product) => {
                const colors = await ProductColor.find({ productID: product.productID })
                    .select('colorID colorName colorCode');

                const colorsWithSizes = await Promise.all(colors.map(async (color) => {
                    const sizes = await ProductSizeStock.find({ colorID: color.colorID })
                        .select('size stock SKU');
                    return {
                        ...color.toObject(),
                        sizes: sizes.map(size => ({
                            size: size.size,
                            stock: size.stock,
                            SKU: size.SKU
                        }))
                    };
                }));

                return {
                    ...product.toObject(),
                    colors: colorsWithSizes
                };
            }));

            // Đếm tổng số sản phẩm
            const total = await Product.countDocuments(query);
            const totalPages = Math.ceil(total / itemsPerPage);

            // Chia dữ liệu thành current và prefetch
            const currentPageData = productsWithDetails.slice(0, itemsPerPage);
            const prefetchData = productsWithDetails.slice(itemsPerPage);

            res.json({
                products: currentPageData,
                prefetchedProducts: prefetch ? prefetchData : [], // Trả về dữ liệu prefetch nếu có yêu cầu
                total,
                totalPages,
                currentPage,
                hasMore: currentPage < totalPages,
                prefetchedPages: prefetch ? prefetchPages : 0
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
                error: error.message
            });
        }
    }

    // Lấy chi tiết sản phẩm theo ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({ productID: id, isActivated: true })
                .populate('targetInfo')
                .populate('categoryInfo');

            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }

            // Lấy colors và sizes
            const colors = await ProductColor.find({ productID: id });
            const colorsWithSizes = await Promise.all(colors.map(async (color) => {
                const sizes = await ProductSizeStock.find({ colorID: color.colorID });
                return {
                    ...color.toObject(),
                    sizes
                };
            }));

            res.json({
                ...product.toObject(),
                colors: colorsWithSizes
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy thông tin sản phẩm',
                error: error.message
            });
        }
    }

    // Tạo sản phẩm mới
    async createProduct(req, res) {
        try {
            const {
                name,
                targetID,
                description,
                price,
                categoryID,
                thumbnail,
                colors,
                sizes
            } = req.body;

            // Kiểm tra target và category tồn tại
            const [target, category] = await Promise.all([
                Target.findOne({ targetID }),
                Category.findOne({ categoryID })
            ]);

            if (!target || !category) {
                return res.status(400).json({
                    message: 'Target hoặc Category không tồn tại'
                });
            }

            // Tạo ID mới cho sản phẩm
            const lastProduct = await Product.findOne().sort({ productID: -1 });
            const productID = lastProduct ? lastProduct.productID + 1 : 1;

            // Tạo sản phẩm mới
            const product = new Product({
                productID,
                name,
                targetID,
                description,
                price,
                categoryID,
                thumbnail
            });

            await product.save();

            // Thêm màu sắc và size cho sản phẩm
            if (colors && colors.length > 0) {
                const colorDocs = colors.map(color => ({
                    productID,
                    colorName: color.name,
                    colorCode: color.code,
                    images: color.images
                }));
                await ProductColor.insertMany(colorDocs);
            }

            if (sizes && sizes.length > 0) {
                const sizeDocs = sizes.map(size => ({
                    productID,
                    size: size.name,
                    stock: size.stock,
                    price: size.price || product.price
                }));
                await ProductSizeStock.insertMany(sizeDocs);
            }

            res.status(201).json({
                message: 'Tạo sản phẩm thành công',
                product: {
                    ...product.toJSON(),
                    colors,
                    sizes
                }
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi tạo sản phẩm',
                error: error.message
            });
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Kiểm tra sản phẩm tồn tại
            const product = await Product.findOne({ productID: id });
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }

            // Nếu cập nhật target hoặc category, kiểm tra tồn tại
            if (updateData.targetID || updateData.categoryID) {
                const [target, category] = await Promise.all([
                    updateData.targetID ? Target.findOne({ targetID: updateData.targetID }) : Promise.resolve(true),
                    updateData.categoryID ? Category.findOne({ categoryID: updateData.categoryID }) : Promise.resolve(true)
                ]);

                if (!target || !category) {
                    return res.status(400).json({
                        message: 'Target hoặc Category không tồn tại'
                    });
                }
            }

            // Cập nhật thông tin sản phẩm
            Object.assign(product, updateData);
            await product.save();

            // Cập nhật màu sắc nếu có
            if (updateData.colors) {
                await ProductColor.deleteMany({ productID: id });
                if (updateData.colors.length > 0) {
                    const colorDocs = updateData.colors.map(color => ({
                        productID: id,
                        colorName: color.name,
                        colorCode: color.code,
                        images: color.images
                    }));
                    await ProductColor.insertMany(colorDocs);
                }
            }

            // Cập nhật size nếu có
            if (updateData.sizes) {
                await ProductSizeStock.deleteMany({ productID: id });
                if (updateData.sizes.length > 0) {
                    const sizeDocs = updateData.sizes.map(size => ({
                        productID: id,
                        size: size.name,
                        stock: size.stock,
                        price: size.price || product.price
                    }));
                    await ProductSizeStock.insertMany(sizeDocs);
                }
            }

            // Lấy sản phẩm đã cập nhật với đầy đủ thông tin
            const updatedProduct = await Product.findOne({ productID: id })
                .populate('targetInfo')
                .populate('categoryInfo')
                .populate('colors')
                .populate('sizes');

            res.json({
                message: 'Cập nhật sản phẩm thành công',
                product: updatedProduct
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi cập nhật sản phẩm',
                error: error.message
            });
        }
    }

    // Xóa sản phẩm (soft delete)
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findOne({ productID: id });
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }

            // Soft delete bằng cách set isActivated = false
            product.isActivated = false;
            await product.save();

            res.json({ message: 'Xóa sản phẩm thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi xóa sản phẩm',
                error: error.message
            });
        }
    }

    // Khôi phục sản phẩm đã xóa
    async restoreProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findOne({ productID: id });
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }

            // Khôi phục bằng cách set isActivated = true
            product.isActivated = true;
            await product.save();

            res.json({ message: 'Khôi phục sản phẩm thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi khôi phục sản phẩm',
                error: error.message
            });
        }
    }
}

module.exports = new ProductController();