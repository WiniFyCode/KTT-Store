const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/', ProductController.getProducts); // Lấy danh sách sản phẩm (có phân trang và lọc)
router.get('/:id', ProductController.getProductById); // Lấy chi tiết sản phẩm

// Routes cho admin (yêu cầu đăng nhập và quyền admin)
router.post('/', verifyToken, isAdmin, ProductController.createProduct); // Tạo sản phẩm mới
router.put('/:id', verifyToken, isAdmin, ProductController.updateProduct); // Cập nhật sản phẩm
router.delete('/:id', verifyToken, isAdmin, ProductController.deleteProduct); // Xóa sản phẩm (soft delete)
router.patch('/:id/restore', verifyToken, isAdmin, ProductController.restoreProduct); // Khôi phục sản phẩm

module.exports = router;
