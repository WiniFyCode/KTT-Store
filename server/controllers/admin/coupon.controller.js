const Coupon = require('../../models/Coupon');
const UserCoupon = require('../../models/UserCoupon');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách tất cả mã giảm giá
exports.getAllCoupons = handleAsync(async (req, res) => {
    const coupons = await Coupon.find().sort('-createdAt');
    
    res.status(200).json({
        status: 'success',
        data: coupons
    });
});

// Lấy chi tiết mã giảm giá
exports.getCoupon = handleAsync(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        throw new ApiError(404, 'Không tìm thấy mã giảm giá');
    }

    res.status(200).json({
        status: 'success',
        data: coupon
    });
});

// Tạo mã giảm giá mới
exports.createCoupon = handleAsync(async (req, res) => {
    const newCoupon = await Coupon.create(req.body);

    res.status(201).json({
        status: 'success',
        data: newCoupon
    });
});

// Cập nhật mã giảm giá
exports.updateCoupon = handleAsync(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!coupon) {
        throw new ApiError(404, 'Không tìm thấy mã giảm giá');
    }

    res.status(200).json({
        status: 'success',
        data: coupon
    });
});

// Xóa mã giảm giá
exports.deleteCoupon = handleAsync(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
        throw new ApiError(404, 'Không tìm thấy mã giảm giá');
    }

    // Xóa tất cả user coupon liên quan
    await UserCoupon.deleteMany({ coupon: req.params.id });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Xem thống kê sử dụng mã giảm giá
exports.getCouponStats = handleAsync(async (req, res) => {
    const stats = await UserCoupon.aggregate([
        {
            $group: {
                _id: '$coupon',
                usedCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'coupons',
                localField: '_id',
                foreignField: '_id',
                as: 'couponInfo'
            }
        },
        {
            $unwind: '$couponInfo'
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: stats
    });
});
