// Middleware kiểm tra quyền truy cập
const jwt = require('jsonwebtoken'); 
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

const checkAuth = async (req, res, next) => {
   try {
      // 1. Lấy token từ header Authorization
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Bạn cần đăng nhập để thực hiện thao tác này"
         });
      }

      // 2. Xác minh token
      const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);

      // 3. Thử tìm trong Admin collection
      const admin = await Admin.findById(decoded.id);
      if (admin) {
         // Nếu là admin, thêm thông tin vào request
         req.user = admin;
         req.role = 'admin';
         req.isAdmin = true;
         return next();
      }

      // 4. Thử tìm trong Customer collection
      const customer = await Customer.findById(decoded.id);
      if (customer) {
         // Kiểm tra tài khoản có bị vô hiệu hóa không
         if (customer.isDisable) {
            return res.status(403).json({
               success: false,
               message: "Tài khoản của bạn đã bị vô hiệu hóa"
            });
         }
         // Nếu là customer, thêm thông tin vào request
         req.user = customer;
         req.role = 'customer';
         req.isAdmin = false;
         return next();
      }

      // 5. Không tìm thấy user trong cả 2 collection
      return res.status(401).json({
         success: false,
         message: "Token không hợp lệ hoặc người dùng không tồn tại"
      });

   } catch (error) {
      if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({
            success: false,
            message: "Token không hợp lệ"
         });
      }
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({
            success: false,
            message: "Token đã hết hạn"
         });
      }
      return res.status(500).json({
         success: false,
         message: "Lỗi xác thực người dùng",
         error: error.message
      });
   }
};

module.exports = checkAuth;
