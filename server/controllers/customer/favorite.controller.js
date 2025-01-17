const Favorite = require('../../models/Favorite');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách sản phẩm yêu thích
exports.getFavorites = handleAsync(async (req, res) => {
    const userId = req.user.id;
    
    const favorites = await Favorite.find({ user: userId })
        .populate({
            path: 'product',
            select: 'name price imageURL rating numReviews',
            populate: {
                path: 'category',
                select: 'name'
            }
        });

    res.status(200).json({
        status: 'success',
        data: favorites
    });
});

// Thêm sản phẩm vào danh sách yêu thích
exports.addToFavorites = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Kiểm tra xem đã có trong danh sách yêu thích chưa
    const existingFavorite = await Favorite.findOne({
        user: userId,
        product: productId
    });

    if (existingFavorite) {
        throw new ApiError(400, 'Sản phẩm đã có trong danh sách yêu thích');
    }

    const favorite = await Favorite.create({
        user: userId,
        product: productId
    });

    res.status(201).json({
        status: 'success',
        data: favorite
    });
});

// Xóa sản phẩm khỏi danh sách yêu thích
exports.removeFromFavorites = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    const favorite = await Favorite.findOneAndDelete({
        user: userId,
        product: productId
    });

    if (!favorite) {
        throw new ApiError(404, 'Không tìm thấy sản phẩm trong danh sách yêu thích');
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Kiểm tra sản phẩm có trong danh sách yêu thích không
exports.checkFavorite = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    const favorite = await Favorite.findOne({
        user: userId,
        product: productId
    });

    res.status(200).json({
        status: 'success',
        data: {
            isFavorite: !!favorite
        }
    });
});
