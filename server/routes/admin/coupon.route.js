const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/admin/coupon.controller');
const { authenticateAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateAdmin);

router.route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

router.route('/:id')
    .get(couponController.getCoupon)
    .put(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);

router.get('/stats/usage', couponController.getCouponStats);

module.exports = router;
