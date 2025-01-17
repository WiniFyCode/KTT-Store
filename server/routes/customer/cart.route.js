const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/customer/cart.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.route('/')
    .get(cartController.getCart)
    .post(cartController.addToCart)
    .delete(cartController.clearCart);

router.route('/:itemId')
    .put(cartController.updateCartItem)
    .delete(cartController.removeFromCart);

module.exports = router;
