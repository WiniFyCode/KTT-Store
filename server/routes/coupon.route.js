const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho admin
router.get('/all', verifyToken, isAdmin, CouponController.getAllCoupons); // Lấy tất cả mã giảm giá
router.post('/', verifyToken, isAdmin, CouponController.createCoupon); // Tạo mã giảm giá mới
router.put('/:id', verifyToken, isAdmin, CouponController.updateCoupon); // Cập nhật mã giảm giá
router.delete('/:id', verifyToken, isAdmin, CouponController.deleteCoupon); // Xóa mã giảm giá

// Routes cho người dùng
router.get('/available', verifyToken, CouponController.getAvailableCoupons); // Lấy danh sách mã có thể sử dụng
router.post('/apply', verifyToken, CouponController.applyCoupon); // Áp dụng mã giảm giá
router.get('/history', verifyToken, CouponController.getCouponHistory); // Lấy lịch sử sử dụng mã

module.exports = router;
