const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controller/category.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');

// Lấy tất cả danh mục (public)
router.get('/', getAllCategories);

// Lấy danh mục theo ID (public)
router.get('/get/:id', getCategoryById);

// Tạo danh mục mới (admin only)
router.post('/create', authenticateAdmin, createCategory);

// Cập nhật danh mục (admin only)
router.put('/update/:id', authenticateAdmin, updateCategory);

// Xóa danh mục (admin only)
router.delete('/delete/:id', authenticateAdmin, deleteCategory);

module.exports = router;
