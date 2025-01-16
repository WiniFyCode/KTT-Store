const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    targetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Target',
        required: true
    }
}, { 
    versionKey: false,
    timestamps: true 
});

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;
