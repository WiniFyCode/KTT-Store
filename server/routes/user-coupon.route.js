const express = require('express');
const router = express.Router();
const UserCouponController = require('../controllers/UserCouponController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/my-coupons', verifyToken, UserCouponController.getUserCoupons); // Lấy danh sách mã giảm giá của user
router.get('/my-coupons/:id', verifyToken, UserCouponController.getUserCouponById); // Lấy chi tiết mã giảm giá
router.post('/:id/use', verifyToken, UserCouponController.useUserCoupon); // Sử dụng mã giảm giá

// Routes cho admin
router.get('/', verifyToken, isAdmin, UserCouponController.getAllUserCoupons); // Lấy danh sách mã giảm giá của tất cả user
router.post('/', verifyToken, isAdmin, UserCouponController.addUserCoupon); // Thêm mã giảm giá cho user
router.put('/:id', verifyToken, isAdmin, UserCouponController.updateUserCoupon); // Cập nhật mã giảm giá
router.patch('/:id/cancel', verifyToken, isAdmin, UserCouponController.cancelUserCoupon); // Hủy mã giảm giá

module.exports = router;
