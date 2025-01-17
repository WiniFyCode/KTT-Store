const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const ProductSizeStock = require('../../models/ProductSizeStock');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy giỏ hàng của người dùng
exports.getCart = handleAsync(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: 'items.product',
            select: 'name price imageURL'
        })
        .populate('items.color')
        .populate('items.size');

    if (!cart) {
        return res.status(200).json({
            status: 'success',
            data: {
                items: [],
                totalAmount: 0
            }
        });
    }

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { productId, colorId, sizeId, quantity } = req.body;

    // Kiểm tra tồn kho
    const stock = await ProductSizeStock.findOne({
        product: productId,
        color: colorId,
        size: sizeId
    });

    if (!stock || stock.quantity < quantity) {
        throw new ApiError(400, 'Sản phẩm không đủ số lượng trong kho');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId &&
        item.color.toString() === colorId &&
        item.size.toString() === sizeId
    );

    if (itemIndex > -1) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
        cart.items[itemIndex].quantity += quantity;
    } else {
        // Thêm sản phẩm mới vào giỏ
        cart.items.push({
            product: productId,
            color: colorId,
            size: sizeId,
            quantity
        });
    }

    // Tính lại tổng tiền
    const product = await Product.findById(productId);
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * product.price);
    }, 0);

    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItem = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, 'Không tìm thấy giỏ hàng');
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm trong giỏ hàng');
    }

    // Kiểm tra tồn kho
    const stock = await ProductSizeStock.findOne({
        product: item.product,
        color: item.color,
        size: item.size
    });

    if (!stock || stock.quantity < quantity) {
        throw new ApiError(400, 'Sản phẩm không đủ số lượng trong kho');
    }

    item.quantity = quantity;

    // Tính lại tổng tiền
    const product = await Product.findById(item.product);
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * product.price);
    }, 0);

    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, 'Không tìm thấy giỏ hàng');
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    // Tính lại tổng tiền
    const product = await Product.findById(item.product);
    cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * product.price);
    }, 0);

    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

// Xóa toàn bộ giỏ hàng
exports.clearCart = handleAsync(async (req, res) => {
    const userId = req.user.id;

    await Cart.findOneAndDelete({ user: userId });

    res.status(204).json({
        status: 'success',
        data: null
    });
});
