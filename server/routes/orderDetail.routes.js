const express = require('express');
const {
    getAllOrderDetails,
    getOrderDetailById,
    getOrderDetailsByOrderId,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
} = require('../controller/orderDetail.controller');
const authenticateAdmin = require("../middlewares/authAdmin.middleware");

const router = express.Router();

// Lấy tất cả chi tiết đơn hàng
router.get('/', getAllOrderDetails);

// Lấy chi tiết đơn hàng theo ID
router.get('/:id', getOrderDetailById);

// Lấy chi tiết đơn hàng theo orderID
router.get('/order/:orderId', getOrderDetailsByOrderId);

// Tạo chi tiết đơn hàng mới
router.post('/create', authenticateAdmin, createOrderDetail);

// Cập nhật chi tiết đơn hàng
router.put('/update/:id', authenticateAdmin, updateOrderDetail);

// Xóa chi tiết đơn hàng
router.delete('/delete/:id', authenticateAdmin, deleteOrderDetail);

module.exports = router;
