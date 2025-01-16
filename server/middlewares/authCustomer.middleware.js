const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

// Middleware kiểm tra xem customer có token hợp lệ không
const authenticateCustomer = async (req, res, next) => {
   // 1. Lấy token từ header Authorization
   const token = req.headers.authorization?.split(" ")[1]; // Header có dạng: Bearer <token>

   if (!token) {
      return res.status(401).json({
         success: false,
         message: "Bạn cần đăng nhập để thực hiện thao tác này"
      });
   }

   try {
      // 2. Xác minh token
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);

      // 3. Kiểm tra customer trong database
      const customer = await Customer.findById(decoded.id);
      if (!customer) {
         return res.status(403).json({
            success: false,
            message: "Token không hợp lệ cho tài khoản khách hàng"
         });
      }

      // 4. Kiểm tra tài khoản có bị vô hiệu hóa không
      if (customer.isDisable) {
         return res.status(403).json({
            success: false,
            message: "Tài khoản đã bị vô hiệu hóa"
         });
      }

      // 5. Lưu thông tin customer vào req để sử dụng sau
      req.customer = customer;

      // 6. Cho phép tiếp tục
      next();
   } catch (err) {
      return res.status(403).json({
         success: false,
         message: "Token không hợp lệ hoặc đã hết hạn"
      });
   }
};

module.exports = authenticateCustomer;
