const Notification = require('../../models/Notification');
const UserNotification = require('../../models/UserNotification');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách thông báo của người dùng
exports.getMyNotifications = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await UserNotification.find({ user: userId })
        .populate('notification')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await UserNotification.countDocuments({ user: userId });

    // Đánh dấu là đã xem
    await UserNotification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        status: 'success',
        data: notifications,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Đánh dấu thông báo là đã đọc
exports.markAsRead = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await UserNotification.findOneAndUpdate(
        {
            _id: notificationId,
            user: userId
        },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, 'Không tìm thấy thông báo');
    }

    res.status(200).json({
        status: 'success',
        data: notification
    });
});

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = handleAsync(async (req, res) => {
    const userId = req.user.id;

    await UserNotification.updateMany(
        { user: userId },
        { isRead: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Đã đánh dấu tất cả thông báo là đã đọc'
    });
});

// Xóa thông báo
exports.deleteNotification = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await UserNotification.findOneAndDelete({
        _id: notificationId,
        user: userId
    });

    if (!notification) {
        throw new ApiError(404, 'Không tìm thấy thông báo');
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Xóa tất cả thông báo
exports.deleteAllNotifications = handleAsync(async (req, res) => {
    const userId = req.user.id;

    await UserNotification.deleteMany({ user: userId });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Lấy số lượng thông báo chưa đọc
exports.getUnreadCount = handleAsync(async (req, res) => {
    const userId = req.user.id;

    const count = await UserNotification.countDocuments({
        user: userId,
        isRead: false
    });

    res.status(200).json({
        status: 'success',
        data: { count }
    });
});
