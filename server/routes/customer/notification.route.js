const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/customer/notification.controller');
const { authenticateCustomer } = require('../../middlewares/auth.middleware');

router.use(authenticateCustomer);

router.route('/')
    .get(notificationController.getMyNotifications)
    .delete(notificationController.deleteAllNotifications);

router.route('/:id')
    .post(notificationController.markAsRead)
    .delete(notificationController.deleteNotification);

router.post('/mark-all-read', notificationController.markAllAsRead);
router.get('/unread/count', notificationController.getUnreadCount);

module.exports = router;
