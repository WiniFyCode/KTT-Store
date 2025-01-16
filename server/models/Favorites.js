const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product",
      required: true,
    },
    // Thêm trường variant nếu muốn lưu cả biến thể sản phẩm
    variantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    // Thêm trường note nếu muốn người dùng ghi chú
    note: {
      type: String,
      trim: true,
    },
    // Thêm trường addedAt để biết thời điểm thêm vào yêu thích
    addedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema, "favorites"); 

module.exports = Favorite;