const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Cart = require('../models/Cart');
const ProductSizeStock = require('../models/ProductSizeStock');
const UserCoupon = require('../models/UserCoupon');

class OrderController {
    // Lấy danh sách đơn hàng của user
    async getOrders(req, res) {
        try {
            const userID = req.user.userID;
            const { page = 1, limit = 10, status } = req.query;

            // Tạo filter dựa trên status nếu có
            const filter = { userID };
            if (status) {
                filter.orderStatus = status;
            }

            // Lấy danh sách đơn hàng với phân trang
            const orders = await Order.find(filter)
                .sort('-createdAt')
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('orderDetails');

            // Đếm tổng số đơn hàng
            const total = await Order.countDocuments(filter);

            res.json({
                orders,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy danh sách đơn hàng',
                error: error.message
            });
        }
    }

    // Lấy chi tiết đơn hàng
    async getOrderById(req, res) {
        try {
            const userID = req.user.userID;
            const { id } = req.params;

            const order = await Order.findOne({ orderID: id, userID })
                .populate({
                    path: 'orderDetails',
                    populate: {
                        path: 'SKU',
                        populate: {
                            path: 'productID',
                            model: 'Product',
                            populate: ['targetInfo', 'categoryInfo', 'colors']
                        }
                    }
                });

            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng',
                error: error.message
            });
        }
    }

    // Tạo đơn hàng mới từ giỏ hàng
    async createOrder(req, res) {
        try {
            const userID = req.user.userID;
            const { fullname, phone, address, userCouponsID } = req.body;

            // Lấy các items trong giỏ hàng
            const cartItems = await Cart.find({ userID });
            if (cartItems.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng trống' });
            }

            // Tính tổng tiền và kiểm tra tồn kho
            let totalPrice = 0;
            const orderItems = [];
            for (const item of cartItems) {
                const stockItem = await ProductSizeStock.findOne({ SKU: item.SKU });
                if (!stockItem) {
                    return res.status(404).json({ message: `Sản phẩm với SKU ${item.SKU} không tồn tại` });
                }
                if (stockItem.stock < item.quantity) {
                    return res.status(400).json({ message: `Sản phẩm ${stockItem.productID.name} không đủ số lượng` });
                }
                totalPrice += stockItem.price * item.quantity;
                orderItems.push({
                    SKU: item.SKU,
                    quantity: item.quantity,
                    price: stockItem.price
                });
            }

            // Xử lý mã giảm giá nếu có
            let paymentPrice = totalPrice;
            if (userCouponsID) {
                const coupon = await UserCoupon.findOne({ userCouponsID, userID, isUsed: false });
                if (!coupon) {
                    return res.status(400).json({ message: 'Mã giảm giá không hợp lệ' });
                }
                if (coupon.couponInfo.minOrderValue > totalPrice) {
                    return res.status(400).json({ message: `Đơn hàng phải từ ${coupon.couponInfo.minOrderValue}đ để sử dụng mã giảm giá` });
                }
                const discountAmount = Math.min(
                    coupon.couponInfo.maxDiscountValue,
                    totalPrice * (coupon.couponInfo.discountPercent / 100)
                );
                paymentPrice = totalPrice - discountAmount;
            }

            // Tạo đơn hàng mới
            const lastOrder = await Order.findOne().sort({ orderID: -1 });
            const orderID = lastOrder ? lastOrder.orderID + 1 : 1;

            const order = new Order({
                orderID,
                userID,
                fullname,
                phone,
                address,
                totalPrice,
                userCouponsID,
                paymentPrice
            });

            // Tạo chi tiết đơn hàng
            const orderDetails = await Promise.all(orderItems.map(async (item, index) => {
                const lastOrderDetail = await OrderDetail.findOne().sort({ orderDetailID: -1 });
                const orderDetailID = lastOrderDetail ? lastOrderDetail.orderDetailID + 1 : 1;

                return new OrderDetail({
                    orderDetailID,
                    orderID,
                    SKU: item.SKU,
                    quantity: item.quantity
                });
            }));

            // Lưu đơn hàng và chi tiết đơn hàng
            await order.save();
            await OrderDetail.insertMany(orderDetails);

            // Cập nhật trạng thái mã giảm giá
            if (userCouponsID) {
                await UserCoupon.updateOne(
                    { userCouponsID, userID },
                    { isUsed: true, usedAt: new Date() }
                );
            }

            // Xóa giỏ hàng
            await Cart.deleteMany({ userID });

            res.status(201).json({
                message: 'Tạo đơn hàng thành công',
                order
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi tạo đơn hàng',
                error: error.message
            });
        }
    }

    // Hủy đơn hàng
    async cancelOrder(req, res) {
        try {
            const userID = req.user.userID;
            const { id } = req.params;

            const order = await Order.findOne({ orderID: id, userID });
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
            if (!['pending', 'confirmed'].includes(order.orderStatus)) {
                return res.status(400).json({ message: 'Không thể hủy đơn hàng ở trạng thái này' });
            }

            // Cập nhật trạng thái đơn hàng
            order.orderStatus = 'cancelled';
            await order.save();

            // Hoàn lại số lượng tồn kho
            const orderDetails = await OrderDetail.find({ orderID: id });
            await Promise.all(orderDetails.map(detail => 
                ProductSizeStock.updateOne(
                    { SKU: detail.SKU },
                    { $inc: { stock: detail.quantity } }
                )
            ));

            // Hoàn lại mã giảm giá nếu có
            if (order.userCouponsID) {
                await UserCoupon.updateOne(
                    { userCouponsID: order.userCouponsID, userID },
                    { isUsed: false, usedAt: null }
                );
            }

            res.json({
                message: 'Hủy đơn hàng thành công',
                order
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi hủy đơn hàng',
                error: error.message
            });
        }
    }

    // ADMIN: Lấy tất cả đơn hàng
    async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 10, status, search } = req.query;

            // Tạo filter dựa trên status và search nếu có
            const filter = {};
            if (status) {
                filter.orderStatus = status;
            }
            if (search) {
                filter.$or = [
                    { fullname: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } }
                ];
            }

            // Lấy danh sách đơn hàng với phân trang
            const orders = await Order.find(filter)
                .sort('-createdAt')
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('orderDetails')
                .populate('userInfo', 'username email');

            // Đếm tổng số đơn hàng
            const total = await Order.countDocuments(filter);

            res.json({
                orders,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy danh sách đơn hàng',
                error: error.message
            });
        }
    }

    // ADMIN: Cập nhật trạng thái đơn hàng
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { orderStatus, shippingStatus } = req.body;

            const order = await Order.findOne({ orderID: id });
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Cập nhật trạng thái
            if (orderStatus) {
                order.orderStatus = orderStatus;
            }
            if (shippingStatus) {
                order.shippingStatus = shippingStatus;
            }

            await order.save();

            res.json({
                message: 'Cập nhật trạng thái đơn hàng thành công',
                order
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng',
                error: error.message
            });
        }
    }
}

module.exports = new OrderController();
