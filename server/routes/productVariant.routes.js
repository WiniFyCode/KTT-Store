const express = require('express');
const router = express.Router();
const {
    getAllProductVariants,
    getProductVariantById,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    getProductVariantsByProduct
} = require('../controller/productVariant.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');

// Lấy tất cả biến thể (public)
router.get('/', getAllProductVariants);

// Lấy tất cả biến thể của một sản phẩm (public)
router.get('/get/:productId', getProductVariantsByProduct);

// Tạo biến thể mới (admin only)
router.post('/create', authenticateAdmin, createProductVariant);

// Cập nhật biến thể (admin only)
router.put('/update/:id', authenticateAdmin, updateProductVariant);

// Xóa biến thể (admin only)
router.delete('/delete/:id', authenticateAdmin, deleteProductVariant);

module.exports = router;
