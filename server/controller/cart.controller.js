const Cart = require('../models/Cart');
const ProductVariant = require('../models/ProductVariant');

// Lấy giỏ hàng của khách hàng
const getCustomerCart = async (req, res) => {
    try {
        const customerID = req.user._id;
        
        const cartItems = await Cart.find({ customerID })
            .populate('productID')
            .populate('variantID');

        return res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy giỏ hàng",
            error: error.message
        });
    }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const customerID = req.user._id;
        const { productID, variantID, quantity } = req.body;

        // Validate input
        if (!productID || !variantID || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm"
            });
        }

        // Kiểm tra số lượng hợp lệ
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Số lượng sản phẩm phải lớn hơn 0"
            });
        }

        // Kiểm tra variant có đủ số lượng không
        const variant = await ProductVariant.findById(variantID);
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy biến thể sản phẩm"
            });
        }

        if (variant.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Số lượng sản phẩm trong kho không đủ"
            });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        let cartItem = await Cart.findOne({
            customerID,
            productID,
            variantID
        });

        if (cartItem) {
            // Nếu đã có, cập nhật số lượng
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Nếu chưa có, tạo mới
            cartItem = await Cart.create({
                customerID,
                productID,
                variantID,
                quantity
            });
        }

        return res.status(200).json({
            success: true,
            message: "Thêm vào giỏ hàng thành công",
            data: cartItem
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi thêm vào giỏ hàng",
            error: error.message
        });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
    try {
        const customerID = req.user._id;
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        // Validate input
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Số lượng sản phẩm không hợp lệ"
            });
        }

        // Tìm item trong giỏ hàng
        const cartItem = await Cart.findOne({
            _id: cartItemId,
            customerID
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong giỏ hàng"
            });
        }

        // Kiểm tra số lượng trong kho
        const variant = await ProductVariant.findById(cartItem.variantID);
        if (variant.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Số lượng sản phẩm trong kho không đủ"
            });
        }

        // Cập nhật số lượng
        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật giỏ hàng thành công",
            data: cartItem
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật giỏ hàng",
            error: error.message
        });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        const customerID = req.user._id;
        const { cartItemId } = req.params;

        const result = await Cart.findOneAndDelete({
            _id: cartItemId,
            customerID
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong giỏ hàng"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ hàng"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
            error: error.message
        });
    }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
    try {
        const customerID = req.user._id;

        await Cart.deleteMany({ customerID });

        return res.status(200).json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xóa giỏ hàng",
            error: error.message
        });
    }
};

module.exports = {
    getCustomerCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
