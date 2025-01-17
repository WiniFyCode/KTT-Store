const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/customer/favorite.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.get('/', favoriteController.getFavorites);
router.post('/:productId', favoriteController.addToFavorites);
router.delete('/:productId', favoriteController.removeFromFavorites);
router.get('/:productId/check', favoriteController.checkFavorite);

module.exports = router;
