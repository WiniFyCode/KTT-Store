const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { verifyToken } = require('../middleware/auth');

// Tất cả routes đều yêu cầu đăng nhập
router.use(verifyToken);

// Routes cho giỏ hàng
router.get('/', CartController.getCart); // Lấy giỏ hàng của user
router.post('/add', CartController.addToCart); // Thêm sản phẩm vào giỏ
router.put('/:id', CartController.updateCartItem); // Cập nhật số lượng sản phẩm
router.delete('/:id', CartController.removeFromCart); // Xóa sản phẩm khỏi giỏ
router.delete('/', CartController.clearCart); // Xóa toàn bộ giỏ hàng

module.exports = router;
