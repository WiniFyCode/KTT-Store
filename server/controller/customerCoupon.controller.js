const CustomerCoupon = require("../models/CustomerCoupons");
const Coupon = require("../models/Coupon");

// Lấy tất cả mã giảm giá của khách hàng
const getCouponsByCustomer = async (req, res) => {
   try {
      const { customerID } = req.params;
      const coupons = await CustomerCoupon.find({ customerID }).populate("couponID");
      res.status(200).json(coupons);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving coupons", error: err });
   }
};

// Thêm mã giảm giá mới cho khách hàng
const addCustomerCoupon = async (req, res) => {
   try {
      const { couponID, customerID, usageLeft, expiryDate } = req.body;

      const newCustomerCoupon = new CustomerCoupon({
         couponID,
         customerID,
         usageLeft,
         expiryDate,
      });

      await newCustomerCoupon.save();
      res.status(201).json(newCustomerCoupon);
   } catch (err) {
      res.status(500).json({ message: "Error adding customer coupon", error: err });
   }
};

// Sử dụng má giảm giá
const useCustomerCoupon = async (req, res) => {
   try {
      const { customerCouponID } = req.params;
      const customerCoupon = await CustomerCoupon.findById(customerCouponID);
      if (!customerCoupon) {
         return res.status(404).json({ message: "Customer coupon not found" });
      }
      customerCoupon.usageLeft -= 1;
      await customerCoupon.save();
      res.status(200).json(customerCoupon);
   } catch (err) {
      res.status(500).json({ message: "Error using customer coupon", error: err });
   }
};

// Xóa má giảm giá của khách hàng
const removeCustomerCoupon = async (req, res) => {
   try {
      const { customerCouponID } = req.params;
      const customerCoupon = await CustomerCoupon.findByIdAndDelete(customerCouponID);
      if (!customerCoupon) {
         return res.status(404).json({ message: "Customer coupon not found" });
      }
      res.status(200).json({ message: "Customer coupon deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting customer coupon", error: err });
   }
};

// Lấy tất cả má giảm giá của khách hàng
const getCustomerCoupons = async (req, res) => {
   try {
      const customerCoupons = await CustomerCoupon.find().populate("couponID");
      res.status(200).json(customerCoupons);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving customer coupons", error: err });
   }
};

module.exports = {
   getCouponsByCustomer,
   addCustomerCoupon,
   useCustomerCoupon,
   removeCustomerCoupon,
   getCustomerCoupons
};
