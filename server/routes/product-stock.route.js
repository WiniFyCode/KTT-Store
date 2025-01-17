const express = require('express');
const router = express.Router();
const ProductSizeStockController = require('../controllers/ProductSizeStockController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/sku/:SKU', ProductSizeStockController.getStockBySKU); // Lấy thông tin tồn kho theo SKU
router.get('/color/:colorID', ProductSizeStockController.getStockByColor); // Lấy tồn kho theo màu

// Routes cho admin
router.post('/', verifyToken, isAdmin, ProductSizeStockController.addStock); // Thêm size và số lượng
router.put('/:SKU', verifyToken, isAdmin, ProductSizeStockController.updateStock); // Cập nhật số lượng
router.delete('/:SKU', verifyToken, isAdmin, ProductSizeStockController.deleteStock); // Xóa size
router.post('/check-batch', verifyToken, isAdmin, ProductSizeStockController.checkStockBatch); // Kiểm tra tồn kho hàng loạt

module.exports = router;
