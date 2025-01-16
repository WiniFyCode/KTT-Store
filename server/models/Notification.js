const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["order", "coupon", "system", "other"],
      required: true,
    },
    // Số lượng người đã đọc
    readCount: {
      type: Number,
      default: 0,
    },
    // Thời gian bắt đầu hiển thị thông báo
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
    // Thời gian hết hạn thông báo
    expiresAt: {
      type: Date,
      default: null, // null nghĩa là không có hạn
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
  "notifications"
);

module.exports = Notification;

