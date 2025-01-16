const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// Định nghĩa schema cho collection 'customers'
const CustomerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true, // Họ và tên là bắt buộc
    },
    email: {
      type: String,
      required: true, // Email là bắt buộc
      unique: true, // Email phải là duy nhất
    },
    password: {
      type: String,
      required: true, // Mật khẩu là bắt buộc
    },
    phone: {
      type: String,
      required: true, // Số điện thoại là bắt buộc
    },
    sex: {
      type: String,
      enum: ["Nam", "Nữ"], // Giới tính chỉ được chọn từ các giá trị này
      required: true, // Giới tính là bắt buộc
    },
    isDisable: {
      type: Boolean,
      default: false, // Trạng thái vô hiệu hóa, mặc định là false
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

// Tạo model cho collection 'customers'
const Customer = mongoose.model("Customer", CustomerSchema, "customers");

// Xuất module
module.exports = Customer;
