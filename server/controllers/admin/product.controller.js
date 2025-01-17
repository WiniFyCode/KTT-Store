const Product = require('../../models/Product');
const ProductColor = require('../../models/ProductColor');
const ProductSizeStock = require('../../models/ProductSizeStock');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách tất cả sản phẩm với filter và phân trang
exports.getAllProducts = handleAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) {
        filter.price = filter.price || {};
        filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.status) filter.status = req.query.status;

    const products = await Product.find(filter)
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate('colors')
        .populate('sizes')
        .skip(skip)
        .limit(limit)
        .sort(req.query.sort || '-createdAt')
        .lean();

    const total = await Product.countDocuments(filter);

    res.status(200).json({
        status: 'success',
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Lấy chi tiết sản phẩm
exports.getProduct = handleAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category', 'name')
        .populate('colors')
        .populate('sizes');

    if (!product) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

// Tạo sản phẩm mới
exports.createProduct = handleAsync(async (req, res) => {
    const { colors, sizes, ...productData } = req.body;

    // Tạo sản phẩm
    const product = await Product.create(productData);

    // Tạo màu sắc
    if (colors && colors.length > 0) {
        const productColors = await ProductColor.insertMany(
            colors.map(color => ({
                ...color,
                product: product._id
            }))
        );
        product.colors = productColors.map(color => color._id);
    }

    // Tạo size và tồn kho
    if (sizes && sizes.length > 0) {
        const productSizes = await ProductSizeStock.insertMany(
            sizes.map(size => ({
                ...size,
                product: product._id
            }))
        );
        product.sizes = productSizes.map(size => size._id);
    }

    await product.save();

    res.status(201).json({
        status: 'success',
        data: product
    });
});

// Cập nhật sản phẩm
exports.updateProduct = handleAsync(async (req, res) => {
    const { colors, sizes, ...productData } = req.body;
    const productId = req.params.id;

    // Cập nhật thông tin sản phẩm
    const product = await Product.findByIdAndUpdate(
        productId,
        productData,
        { new: true, runValidators: true }
    );

    if (!product) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Cập nhật màu sắc
    if (colors) {
        // Xóa màu cũ
        await ProductColor.deleteMany({ product: productId });
        
        // Thêm màu mới
        const productColors = await ProductColor.insertMany(
            colors.map(color => ({
                ...color,
                product: productId
            }))
        );
        product.colors = productColors.map(color => color._id);
    }

    // Cập nhật size và tồn kho
    if (sizes) {
        // Xóa size cũ
        await ProductSizeStock.deleteMany({ product: productId });
        
        // Thêm size mới
        const productSizes = await ProductSizeStock.insertMany(
            sizes.map(size => ({
                ...size,
                product: productId
            }))
        );
        product.sizes = productSizes.map(size => size._id);
    }

    await product.save();

    res.status(200).json({
        status: 'success',
        data: product
    });
});

// Xóa sản phẩm
exports.deleteProduct = handleAsync(async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    // Xóa màu sắc và size liên quan
    await ProductColor.deleteMany({ product: productId });
    await ProductSizeStock.deleteMany({ product: productId });

    await product.remove();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Cập nhật trạng thái sản phẩm
exports.updateProductStatus = handleAsync(async (req, res) => {
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

// Quản lý hình ảnh sản phẩm
exports.updateProductImages = handleAsync(async (req, res) => {
    const { images } = req.body;
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
        productId,
        { $set: { images } },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm');
    }

    res.status(200).json({
        status: 'success',
        data: product
    });
});

// Thống kê sản phẩm
exports.getProductStats = handleAsync(async (req, res) => {
    const stats = await Product.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        }
    ]);

    const categoryStats = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            statusStats: stats,
            categoryStats
        }
    });
});
