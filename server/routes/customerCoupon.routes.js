const express = require('express');
const router = express.Router();
const {
    getCustomerCoupons,
    addCustomerCoupon,
    removeCustomerCoupon,
    useCustomerCoupon
} = require('../controller/customerCoupon.controller');
const authCustomer = require('../middlewares/authCustomer.middleware');

// Lấy tất cả mã giảm giá của khách hàng
router.get('/', authCustomer, getCustomerCoupons);

// Thêm mã giảm giá cho khách hàng
router.post('/add', authCustomer, addCustomerCoupon);

// Xóa mã giảm giá của khách hàng
router.delete('/delete/:couponId', authCustomer, removeCustomerCoupon);

// Sử dụng mã giảm giá
router.post('/use/:couponId', authCustomer, useCustomerCoupon);

module.exports = router;
