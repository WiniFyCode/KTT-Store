const mongoose = require('mongoose');

const UsageHistorySchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    usedAt: {
        type: Date,
        default: Date.now
    },
    discountAmount: {
        type: Number,
        required: true,
        min: 0
    }
});

const CustomerCouponSchema = new mongoose.Schema({
    couponID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    usageLeft: {
        type: Number,
        default: 1,
        min: 0
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'used', 'expired'],
        default: 'available'
    },
    usageHistory: [UsageHistorySchema],
    expiryDate: {
        type: Date,
        required: true
    }
}, { 
    versionKey: false,
    timestamps: true
});

const CustomerCoupon = mongoose.model('CustomerCoupon', CustomerCouponSchema, 'customer_coupons');

module.exports = CustomerCoupon;
