const express = require('express');
const router = express.Router();
const {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    sendNotification
} = require('../controller/notification.controller');
const authenticateAdmin = require('../middlewares/authAdmin.middleware');

// Lấy tất cả thông báo (admin only)
router.get('/', authenticateAdmin, getAllNotifications);

// Lấy thông báo theo ID (admin only)
router.get('/get/:id', authenticateAdmin, getNotificationById);

// Tạo thông báo mới (admin only)
router.post('/create', authenticateAdmin, createNotification);

// Cập nhật thông báo (admin only)
router.put('/update/:id', authenticateAdmin, updateNotification);

// Xóa thông báo (admin only)
router.delete('/delete/:id', authenticateAdmin, deleteNotification);

// Gửi thông báo cho khách hàng (admin only)
router.post('/send/:customerId', authenticateAdmin, sendNotification);

module.exports = router;
