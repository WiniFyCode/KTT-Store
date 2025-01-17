const Coupon = require('../../models/Coupon');
const UserCoupon = require('../../models/UserCoupon');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách mã giảm giá có thể sử dụng
exports.getAvailableCoupons = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const currentDate = new Date();

    // Lấy các mã giảm giá còn hiệu lực và chưa sử dụng
    const coupons = await Coupon.find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
        isActive: true
    });

    // Kiểm tra xem người dùng đã sử dụng mã giảm giá nào
    const userCoupons = await UserCoupon.find({ user: userId });
    const usedCouponIds = userCoupons.map(uc => uc.coupon.toString());

    // Lọc ra các mã giảm giá chưa sử dụng
    const availableCoupons = coupons.filter(
        coupon => !usedCouponIds.includes(coupon._id.toString())
    );

    res.status(200).json({
        status: 'success',
        data: availableCoupons
    });
});

// Lấy danh sách mã giảm giá đã sử dụng
exports.getUsedCoupons = handleAsync(async (req, res) => {
    const userId = req.user.id;

    const userCoupons = await UserCoupon.find({ user: userId })
        .populate('coupon')
        .sort('-usedAt');

    res.status(200).json({
        status: 'success',
        data: userCoupons
    });
});

// Áp dụng mã giảm giá
exports.applyCoupon = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { code } = req.body;
    const currentDate = new Date();

    // Tìm mã giảm giá
    const coupon = await Coupon.findOne({
        code,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
        isActive: true
    });

    if (!coupon) {
        throw new ApiError(400, 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra xem đã sử dụng chưa
    const existingUserCoupon = await UserCoupon.findOne({
        user: userId,
        coupon: coupon._id
    });

    if (existingUserCoupon) {
        throw new ApiError(400, 'Bạn đã sử dụng mã giảm giá này');
    }

    // Kiểm tra điều kiện áp dụng (ví dụ: giá trị đơn hàng tối thiểu)
    const { cartTotal } = req.body;
    if (cartTotal < coupon.minOrderAmount) {
        throw new ApiError(400, `Giá trị đơn hàng tối thiểu phải là ${coupon.minOrderAmount}`);
    }

    // Tính số tiền giảm
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
        discountAmount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
    } else {
        discountAmount = coupon.value;
    }

    res.status(200).json({
        status: 'success',
        data: {
            coupon,
            discountAmount,
            finalAmount: cartTotal - discountAmount
        }
    });
});

// Lưu thông tin sử dụng mã giảm giá
exports.saveCouponUsage = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const { couponId, orderId, discountAmount } = req.body;

    const userCoupon = await UserCoupon.create({
        user: userId,
        coupon: couponId,
        order: orderId,
        discountAmount,
        usedAt: new Date()
    });

    res.status(201).json({
        status: 'success',
        data: userCoupon
    });
});
