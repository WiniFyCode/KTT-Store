const express = require("express");
const router = express.Router();
const {
   getAllTargets,
   getTargetById,
   createTarget,
   updateTarget,
   deleteTarget,
} = require("../controller/target.controller");

// Lấy tất cả mục tiêu
router.get("/", getAllTargets);

// Lấy thông tin mục tiêu theo ID
router.get("/get/:id", getTargetById);

// Tạo mới mục tiêu
router.post("/create", createTarget);

// Cập nhật mục tiêu theo ID
router.put("/update/:id", updateTarget);

// Xóa mục tiêu theo ID
router.delete("/delete/:id", deleteTarget);

module.exports = router;
