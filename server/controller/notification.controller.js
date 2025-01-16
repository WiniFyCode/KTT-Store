const Notification = require("../models/Notification");
const Admin = require("../models/Admin");

// Lấy tất cả thông báo
const getAllNotifications = async (req, res) => {
   try {
      const notifications = await Notification.find().populate("adminID");
      res.status(200).json(notifications);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving notifications", error: err });
   }
};

// Lấy thông báo theo ID
const getNotificationById = async (req, res) => {
   try {
      const { id } = req.params;
      const notification = await Notification.findById(id).populate("adminID");
      if (!notification) return res.status(404).json({ message: "Notification not found" });
      res.status(200).json(notification);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving notification", error: err });
   }
};

// Tạo thông báo mới
const createNotification = async (req, res) => {
   try {
      const { adminID, title, message, type, scheduledFor, expiresAt } = req.body;

      const newNotification = new Notification({
         adminID,
         title,
         message,
         type,
         scheduledFor,
         expiresAt,
      });

      await newNotification.save();
      res.status(201).json(newNotification);
   } catch (err) {
      res.status(500).json({ message: "Error creating notification", error: err });
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

// Cập nhật thông báo
const updateNotification = async (req, res) => {
   try {
      const { id } = req.params;
      const updatedNotification = await Notification.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedNotification) return res.status(404).json({ message: "Notification not found" });
      res.status(200).json(updatedNotification);
   } catch (err) {
      res.status(500).json({ message: "Error updating notification", error: err });
   }
};

const sendNotification = async (req, res) => {
   try {
      const { customerId } = req.params;
      const { notificationId } = req.body;

      const customer = await Admin.findById(customerId);
      if (!customer) return res.status(404).json({ message: "Customer not found" });

      const notification = await Notification.findById(notificationId);
      if (!notification) return res.status(404).json({ message: "Notification not found" });

      const updatedNotification = await Notification.findByIdAndUpdate(
         notificationId,
         { $inc: { readCount: 1 } },
         { new: true }
      );

      const customerNotification = new CustomerNotification({
         notificationID: updatedNotification._id,
         customerID: customer._id,
         isRead: false,
         readAt: null,
      });

      await customerNotification.save();

      res.status(200).json({ message: "Notification sent successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error sending notification", error: err });
   }
};

module.exports = {
   getAllNotifications,
   getNotificationById,
   createNotification,
   deleteNotification,
   updateNotification,
   sendNotification
};
