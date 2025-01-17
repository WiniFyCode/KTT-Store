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

// Kết nối đến MongoDB
mongoose
  .connect(process.env.MONGODB_URI,)
  .then(() => console.log("✅Kết nối đến MongoDB thành công"))
  .catch((err) => console.error("❌Kết nối đến MongoDB thất bại:", err));

// Import routes
const authRoutes = require('./routes/auth.route');

// Import admin routes
const adminCategoryRoutes = require('./routes/admin/category.route');
const adminOrderRoutes = require('./routes/admin/order.route');
const adminUserRoutes = require('./routes/admin/user.route');
const adminCouponRoutes = require('./routes/admin/coupon.route');
const adminProductRoutes = require('./routes/admin/product.route');

// Import customer routes
const customerProductRoutes = require('./routes/customer/product.route');
const customerCartRoutes = require('./routes/customer/cart.route');
const customerOrderRoutes = require('./routes/customer/order.route');
const customerAddressRoutes = require('./routes/customer/address.route');
const customerFavoriteRoutes = require('./routes/customer/favorite.route');
const customerNotificationRoutes = require('./routes/customer/notification.route');
const customerCouponRoutes = require('./routes/customer/coupon.route');

// Import authentication middleware
const { authenticateAdmin, authenticateCustomer } = require("./middlewares/auth.middleware");

// Import error middleware
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/products', adminProductRoutes);

// Customer routes
app.use('/api/products', customerProductRoutes);
app.use('/api/cart', customerCartRoutes);
app.use('/api/orders', customerOrderRoutes);
app.use('/api/addresses', customerAddressRoutes);
app.use('/api/favorites', customerFavoriteRoutes);
app.use('/api/notifications', customerNotificationRoutes);
app.use('/api/coupons', customerCouponRoutes);

// Error handling
app.use(errorConverter);
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
