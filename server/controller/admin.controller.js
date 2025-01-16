const bcrypt = require("bcryptjs"); // Thư viện mã hóa mật khẩu
const jwt = require("jsonwebtoken"); // Thư viện tạo và xác thực token
const crypto = require("crypto"); // Thư viện tạo token ngẫu nhiên
const Admin = require("../models/Admin"); // Mô hình Admin từ MongoDB

// 1. Lấy danh sách tất cả Admins
const getAllAdmins = async (req, res) => {
   try {
      // Lấy toàn bộ danh sách Admin từ cơ sở dữ liệu
      const admins = await Admin.find();
      res.status(200).json(admins); // Trả về danh sách Admins
   } catch (err) {
      // Nếu có lỗi trong quá trình truy vấn
      res.status(500).json({ message: "Error retrieving admins", error: err });
   }
};

// 2. Lấy thông tin Admin theo ID
const getAdminById = async (req, res) => {
   try {
      const { id } = req.params; // Lấy ID từ URL
      const admin = await Admin.findById(id); // Tìm Admin theo ID
      if (!admin) {
         return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json(admin); // Trả về thông tin Admin
   } catch (err) {
      res.status(500).json({ message: "Error retrieving admin", error: err });
   }
};

// 3. Cập nhật thông tin Admin
const updateAdmin = async (req, res) => {
   try {
      const { id } = req.params; // Lấy ID từ URL
      const { username, email, phone } = req.body; // Lấy thông tin cần cập nhật

      // Cập nhật Admin theo ID
      const updatedAdmin = await Admin.findByIdAndUpdate(
         id,
         { username, email, phone },
         { new: true } // Trả về dữ liệu đã cập nhật
      );

      if (!updatedAdmin) {
         return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json(updatedAdmin); // Trả về thông tin Admin sau khi cập nhật
   } catch (err) {
      res.status(500).json({ message: "Error updating admin", error: err });
   }
};

// 4. Xóa Admin
const deleteAdmin = async (req, res) => {
   try {
      const { id } = req.params; // Lấy ID từ URL

      // Tìm và xóa Admin theo ID
      const deletedAdmin = await Admin.findByIdAndDelete(id);

      if (!deletedAdmin) {
         return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json({ message: "Admin deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting admin", error: err });
   }
};

// 5. Đăng nhập Admin
const loginAdmin = async (req, res) => {
   try {
      const { email, password } = req.body; // Lấy email và mật khẩu từ yêu cầu

      // Tìm Admin theo email
      const admin = await Admin.findOne({ email });
      if (!admin) {
         return res.status(404).json({ message: "Admin not found" });
      }

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      // Tạo token JWT
      const token = jwt.sign(
         { id: admin._id, email: admin.email },
         process.env.CLIENT_SECRET_KEY,
         { expiresIn: "7d" }
      );

      res.status(200).json({ token, admin }); // Trả về token và thông tin Admin
   } catch (err) {
      res.status(500).json({ message: "Error logging in", error: err });
   }
};

// 6. Đăng ký Admin
const registerAdmin = async (req, res) => {
   try {
      const { username, email, password, phone } = req.body; // Lấy dữ liệu từ yêu cầu

      // Kiểm tra email đã tồn tại chưa
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
         return res.status(400).json({ message: "Email already registered" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo Admin mới
      const newAdmin = new Admin({
         username,
         email,
         password: hashedPassword, // Lưu mật khẩu đã mã hóa
         phone,
      });

      // Lưu Admin vào cơ sở dữ liệu
      await newAdmin.save();
      res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
   } catch (err) {
      res.status(500).json({ message: "Error registering admin", error: err });
   }
};

// 7. Quên mật khẩu Admin
const forgotPasswordAdmin = async (req, res) => {
   try {
      const { email } = req.body;

      // Tìm Admin theo email
      const admin = await Admin.findOne({ email });
      if (!admin) {
         return res.status(404).json({ message: "Admin not found" });
      }

      // Tạo token reset mật khẩu
      const resetToken = crypto.randomBytes(20).toString("hex");

      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpires = Date.now() + 3600000; // Token có hiệu lực 1 giờ
      await admin.save();

      res.status(200).json({ message: "Reset password token generated", token: resetToken });
   } catch (err) {
      res.status(500).json({ message: "Error processing forgot password", error: err });
   }
};

// 8. Đổi mật khẩu Admin
const changePasswordAdmin = async (req, res) => {
   try {
      const { adminId, oldPassword, newPassword } = req.body;

      // Tìm Admin theo ID
      const admin = await Admin.findById(adminId);
      if (!admin) {
         return res.status(404).json({ message: "Admin not found" });
      }

      // Kiểm tra mật khẩu cũ
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
         return res.status(400).json({ message: "Old password is incorrect" });
      }

      // Mã hóa mật khẩu mới
      admin.password = await bcrypt.hash(newPassword, 10);
      await admin.save();

      res.status(200).json({ message: "Password updated successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error changing password", error: err });
   }
};

// 9. Đặt lại mật khẩu Admin
const resetPasswordAdmin = async (req, res) => {
   try {
      const { token, newPassword } = req.body;

      // Tìm Admin theo token và kiểm tra hạn
      const admin = await Admin.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: Date.now() },
      });

      if (!admin) {
         return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Cập nhật mật khẩu mới
      admin.password = await bcrypt.hash(newPassword, 10);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();

      res.status(200).json({ message: "Password reset successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error resetting password", error: err });
   }
};

module.exports = {
   getAllAdmins,
   getAdminById,
   updateAdmin,
   deleteAdmin,
   loginAdmin,
   registerAdmin,
   forgotPasswordAdmin,
   changePasswordAdmin,
   resetPasswordAdmin,
};
