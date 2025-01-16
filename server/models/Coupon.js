const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    //Mã giảm giá (tên coupon)
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    //Loại giảm giá: phần trăm hoặc số tiền cố định
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    //Giá trị giảm giá
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    //Giá trị đơn hàng tối thiểu để áp dụng coupon
    minOrderValue: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    //Số tiền giảm tối đa (cho giảm giá theo phần trăm)
    maxDiscountAmount: {
        type: Number,
        min: 0
    },
    //Ngày bắt đầu áp dụng coupon
    startDate: {
        type: Date,
        required: true
    },
    //Ngày kết thúc áp dụng coupon
    endDate: {
        type: Date,
        required: true
    },
    //Số lần sử dụng tối đa cho mỗi người dùng
    usageLimit: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    //Tổng số lần mã có thể được sử dụng
    totalUsageLimit: {
        type: Number,
        required: true,
        min: 1
    },
    //Số lần mã đã được sử dụng
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    //Trạng thái coupon (active/inactive)
    isActive: {
        type: Boolean,
        default: true
    },
    couponType: {
        type: String,
        required: true,
        enum: ['new_user', 'seasonal', 'flash_sale', 'general'],
        default: 'general'
    },
    minimumQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    //Danh sách các danh mục áp dụng coupon
    appliedCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
}, { versionKey: false, timestamps: true });


const Coupon = mongoose.model('Coupon', couponSchema, 'coupons');

module.exports = Coupon;
