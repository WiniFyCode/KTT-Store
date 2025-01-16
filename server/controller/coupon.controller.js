const Coupon = require('../models/Coupon');

// Tạo mã giảm giá mới
const createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            usageLimit,
            totalUsageLimit,
            couponType,
            minimumQuantity,
            appliedCategories
        } = req.body;

        // Validate đầu vào
        if (!code || !description || !discountType || !discountValue || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin mã giảm giá"
            });
        }

        // Kiểm tra mã đã tồn tại chưa
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Mã giảm giá đã tồn tại"
            });
        }

        // Kiểm tra giá trị giảm giá
        if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
            return res.status(400).json({
                success: false,
                message: "Giá trị phần trăm giảm giá phải từ 1 đến 100"
            });
        }

        // Tạo mã giảm giá mới
        const newCoupon = await Coupon.create({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            usageLimit,
            totalUsageLimit,
            couponType,
            minimumQuantity,
            appliedCategories
        });

        return res.status(201).json({
            success: true,
            message: "Tạo mã giảm giá thành công",
            data: newCoupon
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo mã giảm giá",
            error: error.message
        });
    }
};

// Lấy tất cả mã giảm giá
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .populate('appliedCategories', 'name');

        return res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách mã giảm giá",
            error: error.message
        });
    }
};

// Lấy mã giảm giá theo ID
const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id)
            .populate('appliedCategories', 'name');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy mã giảm giá"
            });
        }

        return res.status(200).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin mã giảm giá",
            error: error.message
        });
    }
};

// Cập nhật mã giảm giá
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Không cho phép cập nhật mã code
        if (updateData.code) {
            delete updateData.code;
        }

        // Không cho phép cập nhật số lần đã sử dụng
        if (updateData.usedCount) {
            delete updateData.usedCount;
        }

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy mã giảm giá"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật mã giảm giá thành công",
            data: coupon
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật mã giảm giá",
            error: error.message
        });
    }
};

// Xóa mã giảm giá
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy mã giảm giá"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa mã giảm giá thành công"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xóa mã giảm giá",
            error: error.message
        });
    }
};

// Kiểm tra mã giảm giá có hợp lệ không
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const { orderValue, categoryIds = [], quantity = 0 } = req.body;

        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Mã giảm giá không tồn tại hoặc đã hết hạn"
            });
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usedCount >= coupon.totalUsageLimit) {
            return res.status(400).json({
                success: false,
                message: "Mã giảm giá đã hết lượt sử dụng"
            });
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (orderValue < coupon.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Giá trị đơn hàng tối thiểu phải từ ${coupon.minOrderValue}đ`
            });
        }

        // Kiểm tra số lượng sản phẩm tối thiểu
        if (quantity < coupon.minimumQuantity) {
            return res.status(400).json({
                success: false,
                message: `Số lượng sản phẩm tối thiểu phải từ ${coupon.minimumQuantity}`
            });
        }

        // Kiểm tra danh mục áp dụng
        if (coupon.appliedCategories && coupon.appliedCategories.length > 0) {
            const hasValidCategory = categoryIds.some(catId => 
                coupon.appliedCategories.includes(catId)
            );
            if (!hasValidCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Mã giảm giá không áp dụng cho danh mục sản phẩm này"
                });
            }
        }

        // Tính toán số tiền giảm
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderValue * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        return res.status(200).json({
            success: true,
            message: "Mã giảm giá hợp lệ",
            data: {
                coupon,
                discountAmount
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi kiểm tra mã giảm giá",
            error: error.message
        });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};
