const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product.controller');
const { authenticateAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateAdmin);

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

router.route('/:id')
    .get(productController.getProduct)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

router.put('/:id/status', productController.updateProductStatus);
router.put('/:id/images', productController.updateProductImages);
router.get('/stats/overview', productController.getProductStats);

module.exports = router;
