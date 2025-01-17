const express = require('express');
const router = express.Router();
const TargetController = require('../controllers/TargetController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes cho người dùng
router.get('/', TargetController.getTargets); // Lấy tất cả target
router.get('/:id', TargetController.getTargetById); // Lấy chi tiết target

// Routes cho admin (yêu cầu đăng nhập và quyền admin)
router.post('/', verifyToken, isAdmin, TargetController.createTarget); // Tạo target mới
router.put('/:id', verifyToken, isAdmin, TargetController.updateTarget); // Cập nhật target
router.delete('/:id', verifyToken, isAdmin, TargetController.deleteTarget); // Xóa target

module.exports = router;
