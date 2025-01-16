const mongoose = require("mongoose");

const customerNotificationSchema = new mongoose.Schema(
  {
    notificationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CustomerNotification = mongoose.model(
  "CustomerNotification",
  customerNotificationSchema,
  "customer_notifications"
);

module.exports = CustomerNotification;
