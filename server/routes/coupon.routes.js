const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} = require('../controller/coupon.controller');
const authAdmin = require('../middlewares/authAdmin.middleware');
const authCustomer = require('../middlewares/authCustomer.middleware');

// Admin routes
router.post('/create', authAdmin, createCoupon);
router.get('/', authAdmin, getAllCoupons);
router.get('/get/:id', authAdmin, getCouponById);
router.put('/update/:id', authAdmin, updateCoupon);
router.delete('/delete/:id', authAdmin, deleteCoupon);

// Customer routes
router.post('/validate/:code', authCustomer, validateCoupon);

module.exports = router;
