const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/customer/order.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.route('/')
    .get(orderController.getMyOrders)
    .post(orderController.createOrder);

router.route('/:id')
    .get(orderController.getOrder)
    .post(orderController.cancelOrder);

module.exports = router;
