const Review = require("../models/Review");
const Customer = require("../models/Customer");

// Lấy tất cả đánh giá cho một sản phẩm
const getProductReviews = async (req, res) => {
   try {
      const { productId } = req.params;
      const reviews = await Review.find({ productID: productId }).populate("customerID");
      res.status(200).json(reviews);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving product reviews", error: err });
   }
};

// Lấy tất cả đánh giá của khách hàng
const getCustomerReviews = async (req, res) => {
   try {
      const { customerID } = req.params;
      const reviews = await Review.find({ customerID: customerID }).populate("productID");
      res.status(200).json(reviews);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving customer reviews", error: err });
   }
}; 

// Lấy đánh giá theo ID
const getReviewById = async (req, res) => {
   try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.status(200).json(review);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving review", error: err });
   }
};

// Tạo đánh giá mới
const createReview = async (req, res) => {
   try {
      const { customerID, productID, rating, comment } = req.body;
      const customer = await Customer.findById(customerID);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      const review = new Review({ customerID, productID, rating, comment });
      await review.save();
      res.status(201).json(review);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating review", error: err });
   }
};

// Cập nhật đánh giá
const updateReview = async (req, res) => {
   try {
      const { id } = req.params;
      const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedReview) return res.status(404).json({ message: "Review not found" });
      res.status(200).json(updatedReview);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating review", error: err });
   }
};

// Xoa đánh giá
const deleteReview = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) return res.status(404).json({ message: "Review not found" });
      res.status(200).json({ message: "Review deleted successfully" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting review", error: err });
   }
};

// Lấy tất cả đánh giá
const getAllReviews = async (req, res) => {
   try {
      const reviews = await Review.find().populate("customerID");
      res.status(200).json(reviews);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving reviews", error: err });
   }
};

module.exports = {
   getAllReviews,
   getReviewById,
   createReview,
   updateReview,
   deleteReview,
   getProductReviews,
   getCustomerReviews
};
