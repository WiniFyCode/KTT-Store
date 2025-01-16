const express = require("express");
const { 
    loginAdmin, 
    registerAdmin, 
    forgotPasswordAdmin, 
    changePasswordAdmin, 
    resetPasswordAdmin 
} = require("../controller/admin.controller");
const {
    loginCustomer,
    createCustomer,
    forgotPasswordCustomer,
    resetPasswordCustomer,
    changePasswordCustomer
} = require('../controller/customer.controller');
const checkAuth = require('../middlewares/checkAuth.middleware');
const authController = require('../controller/auth.controller'); // thêm dòng này
const router = express.Router();

// ========== Routes cho Admin ==========
// Đăng nhập Admin
router.post("/admin/login", loginAdmin);

// Đăng ký Admin
router.post("/admin/register", registerAdmin);

// Quên mật khẩu Admin
router.post("/admin/forgot-password", forgotPasswordAdmin);

// Đổi mật khẩu Admin (yêu cầu đăng nhập)
router.post("/admin/change-password", changePasswordAdmin);

// Đặt lại mật khẩu Admin (reset password)
router.post("/admin/reset-password", resetPasswordAdmin);


// ========== Routes cho Customer ==========

// Đăng nhập
router.post("/customer/login", loginCustomer);

// Đăng ký
router.post("/customer/register", createCustomer);

// Quên mật khẩu
router.post("/customer/forgot-password", authController.forgotPassword); // thay thế dòng này

// Reset mật khẩu
router.post("/customer/reset-password", authController.resetPassword); // thay thế dòng này

// Đổi mật khẩu (yêu cầu xác thực)
router.post("/customer/change-password", checkAuth, changePasswordCustomer);

module.exports = router;
