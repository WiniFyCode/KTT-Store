const mongoose = require('mongoose');

// Định nghĩa schema cho collection 'addresses'
const AddressSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với collection 'customers'
    ref: 'Customer',
    required: true
  },
  address: {
    type: String, // Địa chỉ không bắt buộc
    default: "" // Mặc định là chuỗi rỗng
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isDelete: {
    type: Boolean,
    default: false
  }
}, { versionKey: false , timestamps: true });

// Tạo model cho collection 'addresses'
const Address = mongoose.model('Address', AddressSchema, 'addresses');

// Xuất module
module.exports = Address;