const Cart = require('../models/Cart');
const ProductSizeStock = require('../models/ProductSizeStock');
const Product = require('../models/Product');

class CartController {
    // Lấy giỏ hàng của user
    async getCart(req, res) {
        try {
            // Lấy các items trong giỏ hàng
            const userID = req.user.userID;

            // Lấy các items trong giỏ hàng
            const cartItems = await Cart.find({ userID });

            // Tính tổng tiền
            let totalAmount = 0;
            const items = await Promise.all(cartItems.map(async (item) => {
                // Tìm thông tin size và stock
                const sizeStock = await ProductSizeStock.findOne({ SKU: item.SKU });
                if (!sizeStock) {
                    throw new Error(`Không tìm thấy thông tin size cho SKU: ${item.SKU}`);
                }

                // Parse productID từ SKU (format: productID_colorID_size_version)
                // Ví dụ: SKU = "1_1_S_1" => productID = 1
                const [productID] = sizeStock.SKU.split('_');

                // Lấy thông tin sản phẩm
                const product = await Product.findOne({ productID: parseInt(productID) })
                    .populate(['targetInfo', 'categoryInfo', 'colors']);
                if (!product) {
                    throw new Error(`Không tìm thấy thông tin sản phẩm cho productID: ${productID}`);
                }

                // Tính tổng giá trị của mỗi sản phẩm
                const price = product.price;
                const subtotal = price * item.quantity;
                totalAmount += subtotal;

                // Trả về dữ liệu
                return {
                    cartID: item.cartID,
                    product,
                    size: sizeStock.size,
                    color: sizeStock.color,
                    quantity: item.quantity,
                    price,
                    subtotal,
                    stock: sizeStock.stock
                };
            }));

            // Trả về dữ liệu
            res.json({
                message: 'Lấy giỏ hàng thành công',
                items,
                totalAmount,
                itemCount: items.length
            });
        } catch (error) {
            console.error('Error in getCart:', error);
            res.status(500).json({
                message: 'Có lỗi xảy ra khi lấy giỏ hàng',
                error: error.message
            });
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(req, res) {
        try {
            const userID = req.user.userID;
            const { SKU, quantity = 1 } = req.body;

            // Kiểm tra sản phẩm tồn tại và còn hàng
            const stockItem = await ProductSizeStock.findOne({ SKU });
            if (!stockItem) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }

            if (stockItem.stock < quantity) {
                return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ' });
            }

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            let cartItem = await Cart.findOne({ userID, SKU });

            if (cartItem) {
                // Nếu đã có, cập nhật số lượng
                const newQuantity = cartItem.quantity + quantity;
                if (newQuantity > stockItem.stock) {
                    return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ', maxQuantity: stockItem.stock });
                }

                cartItem.quantity = newQuantity;
                await cartItem.save();
            } else {
                // Nếu chưa có, tạo mới
                const lastCart = await Cart.findOne().sort({ cartID: -1 });
                const cartID = lastCart ? lastCart.cartID + 1 : 1;

                cartItem = new Cart({
                    cartID,
                    userID,
                    SKU,
                    quantity
                });
                await cartItem.save();
            }

            res.status(201).json({
                message: 'Thêm vào giỏ hàng thành công',
                cartItem
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi thêm vào giỏ hàng',
                error: error.message
            });
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ
    async updateCartItem(req, res) {
        try {
            const userID = req.user.userID;
            const { id } = req.params;
            const { quantity } = req.body;

            // Kiểm tra item tồn tại trong giỏ
            const cartItem = await Cart.findOne({ cartID: id, userID });
            if (!cartItem) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }

            // Kiểm tra số lượng tồn kho
            const stockItem = await ProductSizeStock.findOne({ SKU: cartItem.SKU });
            if (stockItem.stock < quantity) {
                return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ', maxQuantity: stockItem.stock });
            }

            // Cập nhật số lượng
            cartItem.quantity = quantity;
            await cartItem.save();

            res.json({
                message: 'Cập nhật số lượng thành công',
                cartItem
            });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi cập nhật số lượng',
                error: error.message
            });
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(req, res) {
        try {
            const userID = req.user.userID;
            const { id } = req.params;

            const cartItem = await Cart.findOne({ cartID: id, userID });
            if (!cartItem) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }

            await cartItem.deleteOne();

            res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng',
                error: error.message
            });
        }
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart(req, res) {
        try {
            const userID = req.user.userID;
            
            await Cart.deleteMany({ userID });

            res.json({ message: 'Xóa giỏ hàng thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Có lỗi xảy ra khi xóa giỏ hàng',
                error: error.message
            });
        }
    }
}

module.exports = new CartController();
