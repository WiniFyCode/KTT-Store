const bcrypt = require("bcryptjs"); // Thư viện để hash mật khẩu
const jwt = require("jsonwebtoken"); // Thư viện để tạo và xác thực JWT
const crypto = require("crypto"); // Thư viện để tạo token ngẫu nhiên
const Customer = require("../models/Customer"); // Mô hình Customer từ MongoDB

// 1. Lấy danh sách tất cả khách hàng (có filter và phân trang)
const getAllCustomers = async (req, res) => {
   try {
      const {
         status, // active, disabled, all
         gender, // Nam, Nữ
         sort = 'createdAt', // Sắp xếp theo trường
         order = 'desc', // Thứ tự sắp xếp
         page = 1, // Trang hiện tại
         limit = 10 // Số lượng item mỗi trang
      } = req.query;

      // Xây dựng query
      let query = {};

      // Lọc theo trạng thái
      if (status && status !== 'all') {
         query.isDisable = status === 'disabled';
      }

      // Lọc theo giới tính
      if (gender) {
         query.sex = gender;
      }

      // Tính toán skip cho phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Query với filter và phân trang
      const customers = await Customer.find(query)
         .sort({ [sort]: order })
         .skip(skip)
         .limit(parseInt(limit))
         .select('-password'); // Không trả về mật khẩu

      // Đếm tổng số khách hàng thỏa mãn điều kiện
      const total = await Customer.countDocuments(query);

      // Thêm thông tin về trạng thái hoạt động
      const activeCount = await Customer.countDocuments({ ...query, isDisable: false });
      const disabledCount = await Customer.countDocuments({ ...query, isDisable: true });

      // Thống kê theo giới tính
      const maleCount = await Customer.countDocuments({ ...query, sex: 'Nam' });
      const femaleCount = await Customer.countDocuments({ ...query, sex: 'Nữ' });

      res.status(200).json({
         success: true,
         customers,
         pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit)
         },
         stats: {
            active: activeCount,
            disabled: disabledCount,
            male: maleCount,
            female: femaleCount
         }
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi lấy danh sách khách hàng",
         error: error.message
      });
   }
};

// 2. Lấy thông tin một khách hàng
const getCustomerById = async (req, res) => {
   try {
      const customer = await Customer.findById(req.params.id)
         .select('-password');

      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng"
         });
      }

      res.status(200).json({
         success: true,
         customer
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi lấy thông tin khách hàng",
         error: error.message
      });
   }
};

// 3. Tạo mới khách hàng
const createCustomer = async (req, res) => {
   try {
      const { email, password, fullname, phone, sex } = req.body;

      // Validate dữ liệu đầu vào
      if (!email || !password || !fullname || !phone || !sex) {
         return res.status(400).json({
            success: false,
            message: "Vui lòng điền đầy đủ thông tin"
         });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return res.status(400).json({
            success: false,
            message: "Email không hợp lệ"
         });
      }

      // Validate phone format (số điện thoại Việt Nam)
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
         return res.status(400).json({
            success: false,
            message: "Số điện thoại không hợp lệ"
         });
      }

      // Kiểm tra email đã tồn tại
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
         return res.status(400).json({
            success: false,
            message: "Email đã được sử dụng"
         });
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo khách hàng mới
      const customer = new Customer({
         email,
         password: hashedPassword,
         fullname,
         phone,
         sex
      });

      await customer.save();

      // Không trả về mật khẩu trong response
      const customerResponse = customer.toObject();
      delete customerResponse.password;

      res.status(201).json({
         success: true,
         message: "Tạo tài khoản thành công",
         customer: customerResponse
      });
   } catch (error) {
      console.error("Lỗi khi tạo khách hàng:", error);
      res.status(500).json({
         success: false,
         message: "Lỗi khi tạo khách hàng",
         error: error.message
      });
   }
};

// 4. Cập nhật thông tin khách hàng
const updateCustomer = async (req, res) => {
   try {
      const { fullname, phone, sex } = req.body;
      const customerId = req.params.id;

      const customer = await Customer.findById(customerId);
      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng"
         });
      }

      // Cập nhật thông tin
      customer.fullname = fullname || customer.fullname;
      customer.phone = phone || customer.phone;
      customer.sex = sex || customer.sex;

      await customer.save();

      // Không trả về mật khẩu
      const customerResponse = customer.toObject();
      delete customerResponse.password;

      res.status(200).json({
         success: true,
         message: "Cập nhật thông tin thành công",
         customer: customerResponse
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi cập nhật thông tin",
         error: error.message
      });
   }
};

// 5. Vô hiệu hóa tài khoản
const disableCustomer = async (req, res) => {
   try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng"
         });
      }

      customer.isDisable = !customer.isDisable;
      await customer.save();

      res.status(200).json({
         success: true,
         message: `Đã ${customer.isDisable ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản`,
         customer: {
            ...customer.toObject(),
            password: undefined
         }
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi thay đổi trạng thái tài khoản",
         error: error.message
      });
   }
};

// 6. Đăng nhập
const loginCustomer = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Tìm khách hàng theo email
      const customer = await Customer.findOne({ email });
      if (!customer) {
         return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không đúng"
         });
      }

      // Kiểm tra tài khoản có bị vô hiệu hóa
      if (customer.isDisable) {
         return res.status(403).json({
            success: false,
            message: "Tài khoản đã bị vô hiệu hóa"
         });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(password, customer.password);
      if (!isValidPassword) {
         return res.status(401).json({
            success: false,
            message: "Email hoặc mật khẩu không đúng"
         });
      }

      // Tạo JWT token
      const token = jwt.sign(
         { id: customer._id },
         process.env.CLIENT_SECRET_KEY,
         { expiresIn: '30d' }
      );

      res.status(200).json({
         success: true,
         message: "Đăng nhập thành công",
         token,
         customer: {
            ...customer.toObject(),
            password: undefined
         }
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi đăng nhập",
         error: error.message
      });
   }
};

// 7. Đổi mật khẩu
const changePasswordCustomer = async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body;
      const customerId = req.customer.id;

      const customer = await Customer.findById(customerId);
      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng"
         });
      }

      // Kiểm tra mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(currentPassword, customer.password);
      if (!isValidPassword) {
         return res.status(401).json({
            success: false,
            message: "Mật khẩu hiện tại không đúng"
         });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      customer.password = hashedPassword;
      await customer.save();

      res.status(200).json({
         success: true,
         message: "Đổi mật khẩu thành công"
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi đổi mật khẩu",
         error: error.message
      });
   }
};

// 8. Quên mật khẩu
const forgotPasswordCustomer = async (req, res) => {
   try {
      const { email } = req.body;

      const customer = await Customer.findOne({ email });
      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Email không tồn tại trong hệ thống"
         });
      }

      // Tạo token reset password
      const resetToken = crypto.randomBytes(32).toString('hex');
      customer.resetPasswordToken = resetToken;
      customer.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
      await customer.save();

      // TODO: Gửi email reset password

      res.status(200).json({
         success: true,
         message: "Đã gửi link reset password vào email"
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi xử lý quên mật khẩu",
         error: error.message
      });
   }
};

// 9. Reset mật khẩu
const resetPasswordCustomer = async (req, res) => {
   try {
      const { token, newPassword } = req.body;

      const customer = await Customer.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: Date.now() }
      });

      if (!customer) {
         return res.status(400).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
         });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      customer.password = hashedPassword;
      customer.resetPasswordToken = undefined;
      customer.resetPasswordExpires = undefined;
      await customer.save();

      res.status(200).json({
         success: true,
         message: "Đặt lại mật khẩu thành công"
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi reset mật khẩu",
         error: error.message
      });
   }
};

// 10. Tìm kiếm khách hàng
const searchCustomers = async (req, res) => {
   try {
      const { query } = req.query;
      const customers = await Customer.find({
         $or: [
            { fullname: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { phone: { $regex: query, $options: 'i' } }
         ]
      });

      res.status(200).json({
         success: true,
         customers
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi tìm kiếm khách hàng",
         error: error.message
      });
   }
};

// 11. Thống kê khách hàng
const getCustomerStats = async (req, res) => {
   try {
      const totalCustomers = await Customer.countDocuments();
      const activeCustomers = await Customer.countDocuments({ isDisable: false });
      const disabledCustomers = await Customer.countDocuments({ isDisable: true });

      const genderStats = await Customer.aggregate([
         {
            $group: {
               _id: "$sex",
               count: { $sum: 1 }
            }
         }
      ]);

      const newCustomersThisMonth = await Customer.countDocuments({
         createdAt: {
            $gte: new Date(new Date().setDate(1)), // Đầu tháng hiện tại
            $lte: new Date() // Hiện tại
         }
      });

      res.status(200).json({
         success: true,
         stats: {
            total: totalCustomers,
            active: activeCustomers,
            disabled: disabledCustomers,
            gender: genderStats,
            newThisMonth: newCustomersThisMonth
         }
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi lấy thống kê khách hàng",
         error: error.message
      });
   }
};

// 12. Xóa khách hàng
const deleteCustomer = async (req, res) => {
   try {
      const customerId = req.params.id;

      const customer = await Customer.findById(customerId);
      if (!customer) {
         return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng"
         });
      }

      await customer.remove();

      res.status(200).json({
         success: true,
         message: "Xóa khách hàng thành cong"
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi khi xóa khách hàng",
         error: error.message
      });
   }
};

// Export các hàm
module.exports = {
   getAllCustomers,
   getCustomerById,
   createCustomer,
   updateCustomer,
   disableCustomer,
   loginCustomer,
   changePasswordCustomer,
   forgotPasswordCustomer,
   resetPasswordCustomer,
   searchCustomers,
   getCustomerStats,
   deleteCustomer
};
