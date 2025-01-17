const Order = require('../../models/Order');
const OrderDetail = require('../../models/OrderDetail');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const ProductSizeStock = require('../../models/ProductSizeStock');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách đơn hàng của người dùng
exports.getMyOrders = handleAsync(async (req, res) => {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId })
        .populate('orderDetails')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        data: orders
    });
});

// Lấy chi tiết đơn hàng
exports.getOrder = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
        _id: orderId,
        user: userId
    }).populate({
        path: 'orderDetails',
        populate: {
            path: 'product color size',
            select: 'name price imageURL'
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

// Tạo đơn hàng mới từ giỏ hàng
exports.createOrder = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { addressId, paymentMethod } = req.body;

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, 'Giỏ hàng trống');
    }

    // Kiểm tra tồn kho và tính tổng tiền
    let totalAmount = 0;
    const orderDetails = [];

    for (const item of cart.items) {
        const stock = await ProductSizeStock.findOne({
            product: item.product,
            color: item.color,
            size: item.size
        });

        if (!stock || stock.quantity < item.quantity) {
            throw new ApiError(400, 'Một số sản phẩm không đủ số lượng trong kho');
        }

        const product = await Product.findById(item.product);
        totalAmount += product.price * item.quantity;

        orderDetails.push({
            product: item.product,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: product.price
        });

        // Cập nhật tồn kho
        stock.quantity -= item.quantity;
        await stock.save();
    }

    // Tạo đơn hàng
    const order = await Order.create({
        user: userId,
        address: addressId,
        paymentMethod,
        totalAmount,
        status: 'pending'
    });

    // Tạo chi tiết đơn hàng
    const details = await OrderDetail.insertMany(
        orderDetails.map(detail => ({
            ...detail,
            order: order._id
        }))
    );

    order.orderDetails = details.map(detail => detail._id);
    await order.save();

    // Xóa giỏ hàng
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
        status: 'success',
        data: order
    });
});

// Hủy đơn hàng
exports.cancelOrder = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new ApiError(404, 'Không tìm thấy đơn hàng');
    }

    if (order.status !== 'pending') {
        throw new ApiError(400, 'Không thể hủy đơn hàng ở trạng thái này');
    }

    // Hoàn lại tồn kho
    const orderDetails = await OrderDetail.find({ order: orderId });
    for (const detail of orderDetails) {
        const stock = await ProductSizeStock.findOne({
            product: detail.product,
            color: detail.color,
            size: detail.size
        });

        stock.quantity += detail.quantity;
        await stock.save();
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
        status: 'success',
        data: order
    });
});
