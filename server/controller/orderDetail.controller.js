const OrderDetail = require('../models/OrderDetail');

// Lấy tất cả chi tiết đơn hàng
exports.getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find()
            .populate('orderID')
            .populate('productID')
            .populate('variantID');
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết đơn hàng theo ID
exports.getOrderDetailById = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id)
            .populate('orderID')
            .populate('productID')
            .populate('variantID');
        if (!orderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        }
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết đơn hàng theo orderID
exports.getOrderDetailsByOrderId = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find({ orderID: req.params.orderId })
            .populate('productID')
            .populate('variantID');
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo chi tiết đơn hàng mới
exports.createOrderDetail = async (req, res) => {
    const orderDetail = new OrderDetail({
        orderID: req.body.orderID,
        productID: req.body.productID,
        variantID: req.body.variantID,
        quantity: req.body.quantity,
        price: req.body.price
    });

    try {
        const newOrderDetail = await orderDetail.save();
        res.status(201).json(newOrderDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật chi tiết đơn hàng
exports.updateOrderDetail = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        }

        if (req.body.quantity != null) {
            orderDetail.quantity = req.body.quantity;
        }
        if (req.body.price != null) {
            orderDetail.price = req.body.price;
        }

        const updatedOrderDetail = await orderDetail.save();
        res.status(200).json(updatedOrderDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa chi tiết đơn hàng
exports.deleteOrderDetail = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id);
        if (!orderDetail) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        }
        await orderDetail.remove();
        res.status(200).json({ message: 'Đã xóa chi tiết đơn hàng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
