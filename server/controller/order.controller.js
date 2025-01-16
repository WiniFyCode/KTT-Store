const Order = require("../models/Order");
const Customer = require("../models/Customer");
const CustomerCoupon = require("../models/CustomerCoupons");
const OrderDetail = require("../models/OrderDetail");

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
   try {
      const orders = await Order.find().populate("customerID CustomerCouponsID");
      res.status(200).json(orders);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving orders", error: err });
   }
};

// Lấy chi tiết đơn hàng theo ID
const getOrderById = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      // Lấy chi tiết đơn hàng và populate thông tin sản phẩm
      const orderDetails = await OrderDetail.find({ orderID: order._id })
         .populate({
            path: 'productID',
            select: 'name price description'
         })
         .populate({
            path: 'variantID',
            select: 'size color stock'
         });

      // Kết hợp thông tin đơn hàng và chi tiết
      const orderWithDetails = {
         ...order.toObject(),
         orderDetails: orderDetails
      };

      res.status(200).json(orderWithDetails);
   } catch (error) {
      console.error('Error in getOrderById:', error);
      res.status(500).json({ message: error.message });
   }
};

// Tạo mới đơn hàng
const createOrder = async (req, res) => {
   try {
      const {
         customerID,
         fullname,
         phone,
         address,
         totalPrice,
         orderStatus,
         shippingStatus,
         isPayed,
         paymentPrice,
         CustomerCouponsID,
      } = req.body;

      const newOrder = new Order({
         customerID,
         fullname,
         phone,
         address,
         totalPrice,
         orderStatus,
         shippingStatus,
         isPayed,
         paymentPrice,
         CustomerCouponsID,
      });

      await newOrder.save();
      res.status(201).json(newOrder);
   } catch (err) {
      res.status(500).json({ message: "Error creating order", error: err });
   }
};

// Cập nhật đơn hàng
const updateOrder = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      // Cập nhật các trường
      const updates = {};
      
      if (req.body.orderStatus) updates.orderStatus = req.body.orderStatus;
      if (req.body.shippingStatus) updates.shippingStatus = req.body.shippingStatus;
      if (req.body.isPayed !== undefined) updates.isPayed = req.body.isPayed;

      const updatedOrder = await Order.findByIdAndUpdate(
         req.params.id,
         { $set: updates },
         { new: true }
      );

      res.status(200).json(updatedOrder);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id);
      if (!order) {
         return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }

      // Xóa tất cả chi tiết đơn hàng liên quan
      await OrderDetail.deleteMany({ orderID: req.params.id });

      // Xóa đơn hàng
      await Order.findByIdAndDelete(req.params.id);
      
      res.status(200).json({ message: 'Đã xóa đơn hàng và chi tiết đơn hàng' });
   } catch (error) {
      console.error('Error in deleteOrder:', error);
      res.status(500).json({ message: error.message });
   }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { orderStatus, shippingStatus, isPayed } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
         id,
         { orderStatus, shippingStatus, isPayed },
         { new: true }
      );

      if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

      res.status(200).json(updatedOrder);
   } catch (err) {
      res.status(500).json({ message: "Error updating order status", error: err });
   }
};

// Huy đơn hàng
const cancelOrder = async (req, res) => {
   try {
      const { id } = req.params;

      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

      res.status(200).json({ message: "Order canceled successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error canceling order", error: err });
   }
};

// Lấy tất cả đơn hàng của khách hàng
const getCustomerOrders = async (req, res) => {
   try {
      const { id } = req.params;
      const orders = await Order.find({ customerID: id }).populate("customerID CustomerCouponsID");
      if (!orders) return res.status(404).json({ message: "Customer orders not found" });
      res.status(200).json(orders);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving customer orders", error: err });
   }
};

// Lấy thống kê đơn hàng
const getOrderStats = async (req, res) => {
   try {
      const stats = await Order.aggregate([
         { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]);
      res.status(200).json(stats);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving order stats", error: err });
   }
};

module.exports = {
   getAllOrders,
   getOrderById,
   createOrder,
   updateOrder,
   deleteOrder,
   updateOrderStatus,
   cancelOrder,
   getCustomerOrders,
   getOrderStats
};
