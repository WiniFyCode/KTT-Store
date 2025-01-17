const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/profile', verifyToken, UserController.getProfile); // Lấy thông tin cá nhân
router.put('/profile', verifyToken, UserController.updateProfile); // Cập nhật thông tin cá nhân
router.put('/change-password', verifyToken, UserController.changePassword); // Đổi mật khẩu

// Routes cho admin
router.get('/', verifyToken, isAdmin, UserController.getUsers); // Lấy danh sách người dùng
router.get('/:id', verifyToken, isAdmin, UserController.getUserById); // Lấy chi tiết người dùng
router.post('/', verifyToken, isAdmin, UserController.createUser); // Tạo tài khoản mới
router.put('/:id', verifyToken, isAdmin, UserController.updateUser); // Cập nhật thông tin người dùng
router.patch('/:id/status', verifyToken, isAdmin, UserController.toggleUserStatus); // Vô hiệu hóa/Kích hoạt tài khoản

module.exports = router;
