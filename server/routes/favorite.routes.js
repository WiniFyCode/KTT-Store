const express = require('express');
const router = express.Router();
const {
    getFavorites,
    addToFavorites,
    removeFavorite
} = require('../controller/favorite.controller');
const authenticateCustomer = require('../middlewares/authCustomer.middleware');

// Lấy danh sách yêu thích
router.get('/', authenticateCustomer, getFavorites);

// Thêm vào danh sách yêu thích
router.post('/add/:productId', authenticateCustomer, addToFavorites);

// Xóa khỏi danh sách yêu thích
router.delete('/delete/:productId', authenticateCustomer, removeFavorite);

module.exports = router;
