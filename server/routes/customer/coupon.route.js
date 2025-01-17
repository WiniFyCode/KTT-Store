const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/customer/coupon.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.get('/available', couponController.getAvailableCoupons);
router.get('/used', couponController.getUsedCoupons);
router.post('/apply', couponController.applyCoupon);
router.post('/save-usage', couponController.saveCouponUsage);

module.exports = router;
