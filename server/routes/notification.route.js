const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Tất cả routes đều yêu cầu đăng nhập
router.use(verifyToken);

// Routes cho admin
router.get('/all', verifyToken, isAdmin, NotificationController.getAllNotifications); // Lấy tất cả thông báo
router.post('/create', verifyToken, isAdmin, NotificationController.createNotification); // Tạo thông báo mới
router.put('/:id', verifyToken, isAdmin, NotificationController.updateNotification); // Cập nhật thông báo
router.delete('/:id', verifyToken, isAdmin, NotificationController.deleteNotification); // Xóa thông báo

// Routes cho user
router.get('/', NotificationController.getUserNotifications); // Lấy thông báo của user
router.put('/read/:id', NotificationController.markAsRead); // Đánh dấu đã đọc
router.put('/read-all', NotificationController.markAllAsRead); // Đánh dấu tất cả đã đọc

module.exports = router;
