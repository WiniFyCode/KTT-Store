const express = require('express');
const router = express.Router();
const {
    uploadImage,
    deleteImage,
    fetchThumbnail,
    fetchImageVariants,
    listFiles
} = require('../controller/image.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');

// Upload hình ảnh (admin only)
router.post('/upload', authenticateAdmin, uploadImage);

// Xóa hình ảnh (admin only)
router.delete('/delete/:id', authenticateAdmin, deleteImage);

// Lấy ảnh thumbnail của sản phẩm
router.get('/thumbnail/:productId', fetchThumbnail);

// Lấy danh sách ảnh theo variant
router.get('/variants/:variantId', fetchImageVariants);

module.exports = router;
