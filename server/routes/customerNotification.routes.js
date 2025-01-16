const express = require('express');
const router = express.Router();
const {
    getCustomerNotifications,
    markAsRead,
    deleteNotification
} = require('../controller/customerNotification.controller');
const authenticateCustomer = require('../middlewares/authCustomer.middleware');

// Lấy tất cả thông báo của khách hàng
router.get('/', authenticateCustomer, getCustomerNotifications);

// Đánh dấu thông báo đã đọc
router.patch('/mark-read/:id', authenticateCustomer, markAsRead);

// Xóa thông báo
router.delete('/delete/:id', authenticateCustomer, deleteNotification);

module.exports = router;
