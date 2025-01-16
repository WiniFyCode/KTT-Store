const express = require('express');
const router = express.Router();
const {
    getCustomerCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controller/cart.controller');
const authenticateCustomer = require('../middlewares/authCustomer.middleware');

// Tất cả routes yêu cầu xác thực customer
router.get('/', authenticateCustomer, getCustomerCart);
router.post('/add', authenticateCustomer, addToCart);
router.put('/update/:cartItemId', authenticateCustomer, updateCartItem);
router.delete('/delete/:cartItemId', authenticateCustomer, removeFromCart);
router.delete('/clear', authenticateCustomer, clearCart);

module.exports = router;
