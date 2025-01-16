const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
    size: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL'], 
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Số lượng tồn kho không được âm'], 
        max: [10000, 'Số lượng tồn kho quá lớn'] 
    },
}, { 
    versionKey: false, 
    timestamps: true 
});

// Đảm bảo mỗi sản phẩm chỉ có một biến thể duy nhất với size và color
ProductVariantSchema.index({ productID: 1, size: 1, color: 1 }, { unique: true });

const ProductVariant = mongoose.model('ProductVariant', ProductVariantSchema, 'product_variants');

module.exports = ProductVariant;
