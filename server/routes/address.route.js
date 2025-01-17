const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const { verifyToken } = require('../middleware/auth');

// Tất cả routes đều yêu cầu đăng nhập
router.use(verifyToken);

router.get('/', AddressController.getAddresses); // Lấy danh sách địa chỉ
router.get('/:id', AddressController.getAddressById); // Lấy chi tiết địa chỉ
router.post('/', AddressController.addAddress); // Thêm địa chỉ mới
router.put('/:id', AddressController.updateAddress); // Cập nhật địa chỉ
router.delete('/:id', AddressController.deleteAddress); // Xóa địa chỉ
router.patch('/:id/default', AddressController.setDefaultAddress); // Set địa chỉ mặc định

module.exports = router;
