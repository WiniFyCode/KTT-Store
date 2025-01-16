const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Middleware kiểm tra xác thực admin
const authenticateAdmin = async (req, res, next) => {
   // 1. Lấy token từ header Authorization
   const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

   // 2. Nếu không có token
   if (!token) {
      return res.status(401).json({
         success: false,
         message: "Bạn cần đăng nhập để thực hiện thao tác này"
      });
   }

   try {
      // 3. Xác minh token
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
      
      // 4. Kiểm tra admin trong database
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
         return res.status(403).json({
            success: false,
            message: "Bạn không có quyền thực hiện thao tác này"
         });
      }

      // 5. Lưu thông tin xác thực
      req.isAuthenticated = true;
      req.admin = admin;
      
      next();
   } catch (err) {
      // 6. Token không hợp lệ
      return res.status(403).json({
         success: false,
         message: "Token không hợp lệ hoặc đã hết hạn"
      });
   }
};

module.exports = authenticateAdmin;
