const Address = require('../../models/Address');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách địa chỉ của người dùng
exports.getMyAddresses = handleAsync(async (req, res) => {
    const userId = req.user.id;
    
    const addresses = await Address.find({ user: userId });

    res.status(200).json({
        status: 'success',
        data: addresses
    });
});

// Thêm địa chỉ mới
exports.addAddress = handleAsync(async (req, res) => {
    const userId = req.user.id;
    
    const address = await Address.create({
        user: userId,
        ...req.body
    });

    res.status(201).json({
        status: 'success',
        data: address
    });
});

// Cập nhật địa chỉ
exports.updateAddress = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndUpdate(
        {
            _id: addressId,
            user: userId
        },
        req.body,
        { new: true, runValidators: true }
    );

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    res.status(200).json({
        status: 'success',
        data: address
    });
});

// Xóa địa chỉ
exports.deleteAddress = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({
        _id: addressId,
        user: userId
    });

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Đặt địa chỉ mặc định
exports.setDefaultAddress = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Bỏ mặc định các địa chỉ khác
    await Address.updateMany(
        { user: userId },
        { isDefault: false }
    );

    // Đặt địa chỉ mới làm mặc định
    const address = await Address.findOneAndUpdate(
        {
            _id: addressId,
            user: userId
        },
        { isDefault: true },
        { new: true }
    );

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    res.status(200).json({
        status: 'success',
        data: address
    });
});
