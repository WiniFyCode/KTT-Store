const Favorite = require("../models/Favorites");
const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");

// Lấy tất cả sản phẩm yêu thích của khách hàng
const getFavorites = async (req, res) => {
   try {
      const { customerID } = req.params;
      const favorites = await Favorite.find({ customerID }).populate("productID variantID");
      if (!favorites || favorites.length === 0)
         return res.status(404).json({ message: "No favorites found for this customer" });

      res.status(200).json(favorites);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving favorites", error: err });
   }
};

// Thêm sản phẩm vào danh sách yêu thích
const addToFavorites = async (req, res) => {
   try {
      const { customerID, productID, variantID, note } = req.body;

      // Kiểm tra xem sản phẩm đã tồn tại trong danh sách yêu thích chưa
      const existingFavorite = await Favorite.findOne({ customerID, productID, variantID });
      if (existingFavorite)
         return res.status(400).json({ message: "Product already in favorites" });

      const newFavorite = new Favorite({
         customerID,
         productID,
         variantID,
         note,
      });

      await newFavorite.save();
      res.status(201).json(newFavorite);
   } catch (err) {
      res.status(500).json({ message: "Error adding favorite", error: err });
   }
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
   try {
      const { id } = req.params;

      const deletedFavorite = await Favorite.findByIdAndDelete(id);
      if (!deletedFavorite)
         return res.status(404).json({ message: "Favorite not found" });

      res.status(200).json({ message: "Favorite deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting favorite", error: err });
   }
};

module.exports = {
   getFavorites,
   addToFavorites,
   removeFavorite,
};
