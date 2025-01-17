const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng (yêu cầu đăng nhập)
router.get('/my-orders', verifyToken, OrderController.getOrders); // Lấy danh sách đơn hàng của user
router.get('/my-orders/:id', verifyToken, OrderController.getOrderById); // Lấy chi tiết đơn hàng
router.post('/create', verifyToken, OrderController.createOrder); // Tạo đơn hàng mới
router.post('/cancel/:id', verifyToken, OrderController.cancelOrder); // Hủy đơn hàng

// Routes cho admin
router.get('/', verifyToken, isAdmin, OrderController.getAllOrders); // Lấy tất cả đơn hàng
router.put('/:id/status', verifyToken, isAdmin, OrderController.updateOrderStatus); // Cập nhật trạng thái đơn hàng

module.exports = router;
