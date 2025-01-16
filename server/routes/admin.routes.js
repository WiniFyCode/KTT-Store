const express = require("express");
const {
   getAllAdmins,
   getAdminById,
   updateAdmin,
   deleteAdmin,
} = require("../controller/admin.controller");
const authAdmin = require("../middlewares/authAdmin.middleware");

const router = express.Router();

// Route để lấy tất cả admin
router.get("/get-all", authAdmin, getAllAdmins);

// Route để lấy thông tin admin theo ID
router.get("/get/:id", authAdmin, getAdminById);

// Route để xóa admin
router.delete("/delete/:id", authAdmin, deleteAdmin);

// Route để cập nhật thông tin admin
router.put("/update/:id", authAdmin, updateAdmin);

module.exports = router;
