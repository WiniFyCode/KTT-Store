const express = require("express");
const {
   getAllCustomers,
   getCustomerById,
   updateCustomer,
   deleteCustomer,
   changePasswordCustomer,
   disableCustomer,
   searchCustomers,
   getCustomerStats
} = require("../controller/customer.controller");
const authenticateAdmin = require("../middlewares/authAdmin.middleware");
const authenticateCustomer = require("../middlewares/authCustomer.middleware");

const router = express.Router();

// Admin routes
router.get("/", getAllCustomers); // Lấy tất cả khách hàng
router.get("/stats", getCustomerStats); // Thống kê khách hàng
router.get("/search", searchCustomers); // Tìm kiếm khách hàng
router.get("/get/:id", getCustomerById); // Lấy thông tin khách hàng theo ID
router.put("/update/:id", updateCustomer); // Cập nhật thông tin khách hàng
router.delete("/delete/:id", deleteCustomer); // Xóa khách hàng
router.patch("/:id/toggle-status", disableCustomer); // Vô hiệu hóa/Kích hoạt tài khoản

// Customer routes (yêu cầu xác thực customer)
router.get('/profile', authenticateCustomer, getCustomerById); // Lấy thông tin cá nhân
router.put('/profile/update', authenticateCustomer, updateCustomer); // Cập nhật thông tin cá nhân
router.post('/:id/change-password', authenticateCustomer, changePasswordCustomer); // Đổi mật khẩu

module.exports = router;
