const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getCustomerOrders,
    getOrderStats,
    updateOrder,
    deleteOrder
} = require('../controller/order.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');
const authenticateCustomer = require('../middlewares/authCustomer.middleware');

// Routes cho Admin (yêu cầu xác thực)
router.get('/', authenticateAdmin, getAllOrders);
router.get('/stats', authenticateAdmin, getOrderStats);
router.get('/:id', authenticateAdmin, getOrderById);
router.post('/create', authenticateAdmin, createOrder);
router.put('/update/:id', authenticateAdmin, updateOrder);
router.put('/status/:id', authenticateAdmin, updateOrderStatus);
router.delete('/delete/:id', authenticateAdmin, deleteOrder);

// Routes cho Customer (yêu cầu xác thực)
router.get('/my-orders', authenticateCustomer, getCustomerOrders);
router.post('/create', authenticateCustomer, createOrder);
router.put('/cancel/:id', authenticateCustomer, cancelOrder);

module.exports = router;
