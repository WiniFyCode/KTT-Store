const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/order.controller');
const { authenticateAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateAdmin);

router.route('/')
    .get(orderController.getAllOrders);

router.route('/:id')
    .get(orderController.getOrder)
    .put(orderController.updateOrderStatus);

router.get('/stats/overview', orderController.getOrderStats);
router.get('/stats/revenue', orderController.getRevenue);

module.exports = router;
