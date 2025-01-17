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

// Import authentication middleware
const { authenticateAdmin, authenticateCustomer } = require("./middlewares/auth.middleware");

// Routes
app.use('/api/auth', authRoutes);// Đăng ký và đăng nhập

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
