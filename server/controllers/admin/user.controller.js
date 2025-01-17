const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách tất cả người dùng
exports.getAllUsers = handleAsync(async (req, res) => {
    const users = await User.find()
        .select('-password')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: users
    });
});

// Lấy chi tiết người dùng
exports.getUser = handleAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password');

    if (!user) {
        throw new ApiError(404, 'Không tìm thấy người dùng');
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

// Cập nhật trạng thái người dùng
exports.updateUserStatus = handleAsync(async (req, res) => {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new ApiError(404, 'Không tìm thấy người dùng');
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

// Xem thống kê người dùng
exports.getUserStats = handleAsync(async (req, res) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: stats
    });
});

// Xem lịch sử hoạt động của người dùng
exports.getUserActivity = handleAsync(async (req, res) => {
    const userId = req.params.id;
    
    // Lấy lịch sử đơn hàng
    const orders = await Order.find({ user: userId })
        .select('orderID status totalAmount createdAt')
        .sort('-createdAt');

    // Lấy lịch sử đánh giá
    const reviews = await Review.find({ user: userId })
        .select('product rating comment createdAt')
        .populate('product', 'name')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: {
            orders,
            reviews
        }
    });
});
