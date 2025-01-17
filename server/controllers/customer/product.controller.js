const Product = require('../../models/Product');
const ProductColor = require('../../models/ProductColor');
const ProductSizeStock = require('../../models/ProductSizeStock');
const Review = require('../../models/Review');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách sản phẩm với filter và phân trang
exports.getProducts = handleAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };

    const products = await Product.find(filter)
        .populate('category', 'name')
        .skip(skip)
        .limit(limit)
        .sort(req.query.sort || '-createdAt');

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

    // Lấy đánh giá của sản phẩm
    const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'name avatar');

    res.status(200).json({
        status: 'success',
        data: {
            product,
            reviews
        }
    });
});

// Tìm kiếm sản phẩm
exports.searchProducts = handleAsync(async (req, res) => {
    const { keyword } = req.query;
    
    const products = await Product.find({
        $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ]
    })
    .populate('category', 'name')
    .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: products
    });
});

// Đánh giá sản phẩm
exports.reviewProduct = handleAsync(async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const productId = req.params.id;

    // Kiểm tra xem người dùng đã mua sản phẩm chưa
    const order = await Order.findOne({
        user: userId,
        'products.product': productId,
        status: 'completed'
    });

    if (!order) {
        throw new ApiError(400, 'Bạn cần mua sản phẩm trước khi đánh giá');
    }

    // Kiểm tra xem đã đánh giá chưa
    const existingReview = await Review.findOne({
        user: userId,
        product: productId
    });

    if (existingReview) {
        throw new ApiError(400, 'Bạn đã đánh giá sản phẩm này rồi');
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    // Cập nhật rating trung bình của sản phẩm
    const stats = await Review.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    await Product.findByIdAndUpdate(productId, {
        rating: stats[0].avgRating,
        numReviews: stats[0].numReviews
    });

    res.status(201).json({
        status: 'success',
        data: review
    });
});
