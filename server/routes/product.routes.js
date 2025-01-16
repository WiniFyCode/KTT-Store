const express = require("express");
const {
   getAllProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
   getProductsForCustomer
} = require("../controller/product.controller");
const authenticateAdmin = require("../middlewares/authAdmin.middleware");

const router = express.Router();

// Lấy tất cả sản phẩm
router.get("/", getAllProducts);

// Lấy tất cả sản phẩm cho khách hàng
router.get("/customer", getProductsForCustomer);

// Lấy sản phẩm theo ID
router.get("/get/:id", getProductById); 

// Lấy thông tin chi tiết sản phẩm bao gồm variants
// router.get("/detail/:id", getProductDetails);

// Tạo sản phẩm mới
router.post("/create", authenticateAdmin, createProduct); 

// Cập nhật sản phẩm
router.put("/update/:id", authenticateAdmin, updateProduct); 

// Xóa sản phẩm
router.delete("/delete/:id", authenticateAdmin, deleteProduct); 

module.exports = router;
