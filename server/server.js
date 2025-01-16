const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const fs = require('fs');
// Cấu hình môi trường
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Cấu hình static files
// Endpoint để lấy danh sách file
app.get('/api/files', (req, res) => {
  const dirPath = path.join(__dirname, 'public/uploads/products');

  fs.readdir(dirPath, (err, files) => {
      if (err) {
          console.error('Error reading directory:', err);
          return res.status(500).json({ error: 'Failed to read directory' });
      }

      // Trả về danh sách file
      res.json(files);
  });
});
app.use('/public/uploads/products', express.static(path.join(__dirname, 'public/uploads/products')));

// Kết nối đến MongoDB
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("✅Kết nối đến MongoDB thành công"))
  .catch((err) => console.error("❌Kết nối đến MongoDB thất bại:", err));

// Import authentication middleware
const authenticateAdmin = require("./middlewares/authAdmin.middleware");
const authenticateCustomer = require("./middlewares/authCustomer.middleware");

// Import các routes
//Auth routes
const authRoutes = require("./routes/auth.routes");

// Admin routes
const authAdmin = require("./routes/auth.routes"); // Routes không cần xác thực
const adminRoutes = require("./routes/admin.routes"); // Routes cần xác thực
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const productVariantRoutes = require("./routes/productVariant.routes");
const couponRoutes = require("./routes/coupon.routes");
const imageRoutes = require("./routes/image.routes");
const orderRoutes = require("./routes/order.routes");
const notificationRoutes = require("./routes/notification.routes");
const targetRoutes = require("./routes/target.routes");
const orderDetailRoutes = require("./routes/orderDetail.routes");

// Customer routes
const customerAuthRoutes = require("./routes/auth.routes"); // Routes không cần xác thực
const customerRoutes = require("./routes/customer.routes"); // Routes cần xác thực
const cartRoutes = require("./routes/cart.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const reviewRoutes = require("./routes/review.routes");
const customerNotificationRoutes = require("./routes/customerNotification.routes");
const customerCouponRoutes = require("./routes/customerCoupon.routes");



// Định nghĩa routes cho admin//

// Routes không cần xác thực
// app.use("/api/b", adminAuthRoutes);

// Routes cần xác thực
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admins/customers", customerRoutes); // Route cho customer management
app.use("/api/admins/categories", categoryRoutes);
app.use("/api/admins/products", productRoutes);
app.use("/api/admins/targets", targetRoutes);
app.use("/api/admins/product-variants", productVariantRoutes);
app.use("/api/admins/coupons", couponRoutes);
app.use("/api/admins/images", imageRoutes);
app.use("/api/admins/orders", orderRoutes);
app.use("/api/admins/reviews", reviewRoutes);
app.use("/api/admins/notifications", notificationRoutes);
app.use("/api/admins/order-details", orderDetailRoutes);

// Định nghĩa routes cho customer//

// Routes không cần xác thực
// app.use("/api/a", customerAuthRoutes);

// Routes cần xác thực
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customers/orders", orderRoutes);
app.use("/api/customers/carts", cartRoutes);
app.use("/api/customers/favorites", favoriteRoutes);
app.use("/api/customers/reviews", reviewRoutes);
app.use("/api/customers/notifications", customerNotificationRoutes);
app.use("/api/customers/coupons", customerCouponRoutes);
app.use("/api/customers/orderDetails", orderDetailRoutes);

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
