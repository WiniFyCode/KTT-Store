const express = require('express');
const router = express.Router();
const OrderDetailController = require('../controllers/OrderDetailController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/order/:orderID', verifyToken, OrderDetailController.getOrderDetails); // Lấy danh sách chi tiết đơn hàng
router.get('/order/:orderID/detail/:id', verifyToken, OrderDetailController.getOrderDetailById); // Lấy chi tiết một sản phẩm

// Routes cho admin
router.post('/order/:orderID', verifyToken, isAdmin, OrderDetailController.addOrderDetail); // Thêm sản phẩm vào đơn hàng
router.put('/order/:orderID/detail/:id', verifyToken, isAdmin, OrderDetailController.updateOrderDetail); // Cập nhật số lượng sản phẩm
router.delete('/order/:orderID/detail/:id', verifyToken, isAdmin, OrderDetailController.deleteOrderDetail); // Xóa sản phẩm khỏi đơn hàng

module.exports = router;
