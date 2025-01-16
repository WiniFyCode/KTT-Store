const CustomerNotification = require("../models/CustomerNotifications");
const Notification = require("../models/Notification");

// Lấy tất cả thông báo của khách hàng
const getCustomerNotifications = async (req, res) => {
   try {
      const { customerID } = req.params;
      const notifications = await CustomerNotification.find({ customerID }).populate("notificationID");
      res.status(200).json(notifications);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving notifications", error: err });
   }
};

// Đánh dấu thông báo là đã đọc
const markAsRead = async (req, res) => {
   try {
      const { id } = req.params;

      const updatedNotification = await CustomerNotification.findByIdAndUpdate(
         id,
         { isRead: true, readAt: new Date() },
         { new: true }
      );

      if (!updatedNotification)
         return res.status(404).json({ message: "Notification not found" });

      res.status(200).json(updatedNotification);
   } catch (err) {
      res.status(500).json({ message: "Error updating notification", error: err });
   }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
   try {
      const { id } = req.params;

      const deletedNotification = await Notification.findByIdAndDelete(id);
      if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });

      res.status(200).json({ message: "Notification deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting notification", error: err });
   }
};

module.exports = {
   getCustomerNotifications,
   markAsRead,
   deleteNotification
};
