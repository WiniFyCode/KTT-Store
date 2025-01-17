const express = require('express');
const router = express.Router();
const ProductColorController = require('../controllers/ProductColorController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/product/:productID', ProductColorController.getProductColors); // Lấy tất cả màu của sản phẩm
router.get('/:id', ProductColorController.getColorById); // Lấy chi tiết màu

// Routes cho admin
router.post('/', verifyToken, isAdmin, ProductColorController.addColor); // Thêm màu mới
router.put('/:id', verifyToken, isAdmin, ProductColorController.updateColor); // Cập nhật màu
router.delete('/:id', verifyToken, isAdmin, ProductColorController.deleteColor); // Xóa màu
router.post('/:id/images', verifyToken, isAdmin, ProductColorController.uploadImages); // Upload hình ảnh
router.delete('/:id/images', verifyToken, isAdmin, ProductColorController.deleteImage); // Xóa hình ảnh

module.exports = router;
