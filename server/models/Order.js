const mongoose = require('mongoose');
const CustomerCoupon = require('./CustomerCoupons');

const orderSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingStatus: {
      type: String,
      enum: ["preparing", "shipping", "delivered", "failed"],
      default: "preparing",
    },
    isPayed: {
      type: Boolean,
      default: false,
    },
    paymentPrice: {
      type: Number,
      required: true,
    },
    CustomerCouponsID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerCoupon",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema, 'orders'); 

module.exports = Order;