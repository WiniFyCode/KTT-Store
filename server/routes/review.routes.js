const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getCustomerReviews
} = require('../controller/review.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');
const authenticateCustomer = require('../middlewares/authCustomer.middleware');
const checkAuth = require('../middlewares/checkAuth.middleware');

// Lấy tất cả đánh giá (admin only)
router.get('/all', authenticateAdmin, getAllReviews);

// Lấy đánh giá của sản phẩm (public)
router.get('/get/:productId', getProductReviews);

// Lấy đánh giá của khách hàng (yêu cầu xác thực)
router.get('/my-reviews', authenticateCustomer, getCustomerReviews);

// Tạo đánh giá mới (yêu cầu xác thực)
router.post('/create', authenticateCustomer, createReview);

// ​‌‌‌⁡⁢⁣⁢Nào sài tính sau⁡​

// Cập nhật đánh giá (yêu cầu xác thực + chỉ người tạo)
router.put('/update/:id', checkAuth, updateReview);

// Xóa đánh giá (admin hoặc người tạo)
router.delete('/delete/:id', checkAuth, deleteReview);

module.exports = router;
