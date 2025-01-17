const OrderDetail = require('../models/OrderDetail');
const Order = require('../models/Order');
const ProductSizeStock = require('../models/ProductSizeStock');

class OrderDetailController {
    // Lấy danh sách chi tiết đơn hàng
    async getOrderDetails(req, res) {
        try {
            const { orderID } = req.params;
            const userID = req.user.userID;

            // Kiểm tra đơn hàng tồn tại và thuộc về user
            const order = await Order.findOne({ orderID });
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Nếu không phải admin, kiểm tra đơn hàng có thuộc về user không
            if (req.user.role !== 'admin' && order.userID !== userID) {
                return res.status(403).json({
                    message: 'Bạn không có quyền xem chi tiết đơn hàng này'
                });
            }

            const orderDetails = await OrderDetail.find({ orderID })
                .populate({
                    path: 'productInfo',
                    populate: {
                        path: 'colorID',
                        populate: {
                            path: 'productID',
                            select: 'name price images'
                        }
                    }
                });

            res.json(orderDetails);
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng',
                error: error.message
            });
        }
    }

    // Lấy chi tiết một sản phẩm trong đơn hàng
    async getOrderDetailById(req, res) {
        try {
            const { orderID, id } = req.params;
            const userID = req.user.userID;

            // Kiểm tra đơn hàng tồn tại và thuộc về user
            const order = await Order.findOne({ orderID });
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Nếu không phải admin, kiểm tra đơn hàng có thuộc về user không
            if (req.user.role !== 'admin' && order.userID !== userID) {
                return res.status(403).json({
                    message: 'Bạn không có quyền xem chi tiết đơn hàng này'
                });
            }

            const orderDetail = await OrderDetail.findOne({
                orderDetailID: id,
                orderID
            }).populate({
                path: 'productInfo',
                populate: {
                    path: 'colorID',
                    populate: {
                        path: 'productID',
                        select: 'name price images'
                    }
                }
            });

            if (!orderDetail) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
            }

            res.json(orderDetail);
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng',
                error: error.message
            });
        }
    }

    // ADMIN: Thêm sản phẩm vào đơn hàng
    async addOrderDetail(req, res) {
        try {
            const { orderID } = req.params;
            const { SKU, quantity } = req.body;

            // Kiểm tra đơn hàng tồn tại
            const order = await Order.findOne({ orderID });
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }

            // Kiểm tra trạng thái đơn hàng
            if (order.status !== 'pending') {
                return res.status(400).json({
                    message: 'Chỉ có thể thêm sản phẩm cho đơn hàng đang chờ xử lý'
                });
            }

            // Kiểm tra sản phẩm tồn tại và còn đủ số lượng
            const stockItem = await ProductSizeStock.findOne({ SKU })
                .populate({
                    path: 'colorID',
                    populate: {
                        path: 'productID',
                        select: 'price'
                    }
                });
            
            if (!stockItem) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }

            if (stockItem.stock < quantity) {
                return res.status(400).json({
                    message: 'Số lượng sản phẩm trong kho không đủ',
                    available: stockItem.stock
                });
            }

            // Tạo ID mới cho order detail
            const lastOrderDetail = await OrderDetail.findOne().sort({ orderDetailID: -1 });
            const orderDetailID = lastOrderDetail ? lastOrderDetail.orderDetailID + 1 : 1;

            const orderDetail = new OrderDetail({
                orderDetailID,
                orderID,
                SKU,
                quantity
            });

            await orderDetail.save();

            // Cập nhật tổng tiền đơn hàng
            const productPrice = stockItem.colorID.productID.price;
            order.totalAmount += productPrice * quantity;
            await order.save();

            res.status(201).json({
                message: 'Thêm sản phẩm vào đơn hàng thành công',
                orderDetail
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi thêm sản phẩm vào đơn hàng',
                error: error.message
            });
        }
    }

    // ADMIN: Cập nhật số lượng sản phẩm trong đơn hàng
    async updateOrderDetail(req, res) {
        try {
            const { orderID, id } = req.params;
            const { quantity } = req.body;

            // Kiểm tra đơn hàng và chi tiết đơn hàng tồn tại
            const [order, orderDetail] = await Promise.all([
                Order.findOne({ orderID }),
                OrderDetail.findOne({ orderDetailID: id, orderID })
            ]);

            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            if (!orderDetail) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
            }

            // Kiểm tra trạng thái đơn hàng
            if (order.status !== 'pending') {
                return res.status(400).json({
                    message: 'Chỉ có thể cập nhật số lượng cho đơn hàng đang chờ xử lý'
                });
            }

            // Kiểm tra số lượng tồn kho
            const stockItem = await ProductSizeStock.findOne({ SKU: orderDetail.SKU })
                .populate({
                    path: 'colorID',
                    populate: {
                        path: 'productID',
                        select: 'price'
                    }
                });

            const quantityDiff = quantity - orderDetail.quantity;
            if (stockItem.stock < quantityDiff) {
                return res.status(400).json({
                    message: 'Số lượng sản phẩm trong kho không đủ',
                    available: stockItem.stock
                });
            }

            // Cập nhật số lượng và tồn kho
            await ProductSizeStock.updateOne(
                { SKU: orderDetail.SKU },
                { $inc: { stock: -quantityDiff } }
            );

            // Cập nhật tổng tiền đơn hàng
            const productPrice = stockItem.colorID.productID.price;
            order.totalAmount += productPrice * quantityDiff;
            await order.save();

            // Cập nhật số lượng chi tiết đơn hàng
            orderDetail.quantity = quantity;
            await orderDetail.save();

            res.json({
                message: 'Cập nhật số lượng sản phẩm thành công',
                orderDetail
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi cập nhật số lượng sản phẩm',
                error: error.message
            });
        }
    }

    // ADMIN: Xóa sản phẩm khỏi đơn hàng
    async deleteOrderDetail(req, res) {
        try {
            const { orderID, id } = req.params;

            // Kiểm tra đơn hàng và chi tiết đơn hàng tồn tại
            const [order, orderDetail] = await Promise.all([
                Order.findOne({ orderID }),
                OrderDetail.findOne({ orderDetailID: id, orderID })
            ]);

            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            if (!orderDetail) {
                return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
            }

            // Kiểm tra trạng thái đơn hàng
            if (order.status !== 'pending') {
                return res.status(400).json({
                    message: 'Chỉ có thể xóa sản phẩm khỏi đơn hàng đang chờ xử lý'
                });
            }

            // Lấy giá sản phẩm để cập nhật tổng tiền
            const stockItem = await ProductSizeStock.findOne({ SKU: orderDetail.SKU })
                .populate({
                    path: 'colorID',
                    populate: {
                        path: 'productID',
                        select: 'price'
                    }
                });

            // Cập nhật tổng tiền đơn hàng
            const productPrice = stockItem.colorID.productID.price;
            order.totalAmount -= productPrice * orderDetail.quantity;
            await order.save();

            // Xóa chi tiết đơn hàng
            await orderDetail.remove(); // Sẽ tự động hoàn lại số lượng tồn kho qua middleware

            res.json({ message: 'Xóa sản phẩm khỏi đơn hàng thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi xóa sản phẩm khỏi đơn hàng',
                error: error.message
            });
        }
    }
}

module.exports = new OrderDetailController();
