const express = require('express');
const router = express.Router();
const productController = require('../../controllers/customer/product.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);

// Routes cần xác thực
router.use(authenticateCustomer);
router.post('/:id/reviews', productController.reviewProduct);

module.exports = router;
