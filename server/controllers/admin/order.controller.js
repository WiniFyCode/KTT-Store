const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách tất cả đơn hàng
exports.getAllOrders = handleAsync(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: orders
    });
});

// Lấy chi tiết đơn hàng
exports.getOrder = handleAsync(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate({
            path: 'orderDetails',
            populate: {
                path: 'product',
                select: 'name price'
            }
        });

    if (!order) {
        throw new ApiError(404, 'Không tìm thấy đơn hàng');
    }

    res.status(200).json({
        status: 'success',
        data: order
    });
});

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = handleAsync(async (req, res) => {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!order) {
        throw new ApiError(404, 'Không tìm thấy đơn hàng');
    }

    res.status(200).json({
        status: 'success',
        data: order
    });
});

// Xem thống kê đơn hàng
exports.getOrderStats = handleAsync(async (req, res) => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: stats
    });
});

// Xem doanh thu theo thời gian
exports.getRevenue = handleAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    const revenue = await Order.aggregate([
        {
            $match: {
                status: 'completed',
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        status: 'success',
        data: revenue
    });
});
