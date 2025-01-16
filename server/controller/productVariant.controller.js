const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Target = require("../models/Target");

// Lấy tất cả các biến thể sản phẩm
const getAllProductVariants = async (req, res) => {
   try {
      const variants = await ProductVariant.find()
         .populate("productID", "_id")
         .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
      
      return res.status(200).json(variants);
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi lấy danh sách biến thể sản phẩm",
         error: err.message
      });
   }
};

// Lấy thông tin biến thể theo ID
const getProductVariantById = async (req, res) => {
   try {
      const { id } = req.params;
      
      // Kiểm tra ID hợp lệ
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({
            message: "ID biến thể không hợp lệ"
         });
      }

      const variant = await ProductVariant.findById(id)
         .populate("productID", "_id");
      
      if (!variant) {
         return res.status(404).json({
            message: "Không tìm thấy biến thể sản phẩm"
         });
      }

      return res.status(200).json(variant);
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi lấy thông tin biến thể sản phẩm",
         error: err.message
      });
   }
};

// Tạo mới biến thể sản phẩm
const createProductVariant = async (req, res) => {
   try {
      const { productID, size, color, stock } = req.body;

      // Validate input
      if (!productID || !size || !color || stock === undefined) {
         return res.status(400).json({
            message: "Vui lòng điền đầy đủ thông tin biến thể"
         });
      }

      // Kiểm tra size hợp lệ
      const validSizes = ['S', 'M', 'L', 'XL', 'XXL'];
      if (!validSizes.includes(size)) {
         return res.status(400).json({
            message: "Kích thước không hợp lệ"
         });
      }

      // Kiểm tra stock
      if (stock < 0) {
         return res.status(400).json({
            message: "Số lượng tồn kho không được âm"
         });
      }

      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findById(productID);
      if (!product) {
         return res.status(404).json({
            message: "Không tìm thấy sản phẩm"
         });
      }

      // Kiểm tra xem biến thể với size và color đã tồn tại chưa
      const existingVariant = await ProductVariant.findOne({ 
         productID, 
         size, 
         color 
      });

      if (existingVariant) {
         return res.status(400).json({
            message: "Biến thể sản phẩm này đã tồn tại"
         });
      }

      const variant = await ProductVariant.create({
         productID,
         size,
         color,
         stock
      });

      return res.status(201).json(variant);
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi tạo biến thể sản phẩm",
         error: err.message
      });
   }
};

// Cập nhật biến thể sản phẩm
const updateProductVariant = async (req, res) => {
   try {
      const { id } = req.params;
      const updateData = req.body;

      // Kiểm tra ID hợp lệ
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({
            message: "ID biến thể không hợp lệ"
         });
      }

      // Kiểm tra biến thể tồn tại
      const existingVariant = await ProductVariant.findById(id);
      if (!existingVariant) {
         return res.status(404).json({
            message: "Không tìm thấy biến thể sản phẩm"
         });
      }


     

      // Kiểm tra xem update có tạo ra duplicate không
      if (updateData.size || updateData.color || updateData.productID) {
         const duplicateCheck = await ProductVariant.findOne({
            _id: { $ne: id }, // Loại trừ variant hiện tại
            productID: updateData.productID || existingVariant.productID,
            size: updateData.size || existingVariant.size,
            color: updateData.color || existingVariant.color
         });

         if (duplicateCheck) {
            return res.status(400).json({
               message: "Biến thể sản phẩm này đã tồn tại"
            });
         }
      }

      // Cập nhật biến thể
      const updatedVariant = await ProductVariant.findByIdAndUpdate(
         id,
         { $set: updateData },
         { new: true, runValidators: true }
      ).populate("productID", "_id");

      return res.status(200).json(updatedVariant);
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi cập nhật biến thể sản phẩm",
         error: err.message
      });
   }
};

// Xóa biến thể sản phẩm
const deleteProductVariant = async (req, res) => {
   try {
      const { id } = req.params;

      // Kiểm tra ID hợp lệ
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({
            message: "ID biến thể không hợp lệ"
         });
      }

      // Kiểm tra biến thể tồn tại
      const variant = await ProductVariant.findById(id);
      if (!variant) {
         return res.status(404).json({
            message: "Không tìm thấy biến thể sản phẩm"
         });
      }

      await ProductVariant.findByIdAndDelete(id);

      return res.status(200).json({ message: "Xóa biến thể sản phẩm thành công" });
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi xóa biến thể sản phẩm",
         error: err.message
      });
   }
};

// Lấy tất cả biến thể của một sản phẩm
const getProductVariantsByProduct = async (req, res) => {
   try {
      const { productId } = req.params;

      // Kiểm tra ID sản phẩm hợp lệ
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({
            message: "ID sản phẩm không hợp lệ"
         });
      }

      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({
            message: "Không tìm thấy sản phẩm"
         });
      }

      const variants = await ProductVariant.find({ productID: productId })
         .populate("productID", "_id");

      return res.status(200).json(variants);
   } catch (err) {
      return res.status(500).json({
         message: "Lỗi khi lấy danh sách biến thể sản phẩm",
         error: err.message
      });
   }
};

module.exports = {
   getAllProductVariants,
   getProductVariantById,
   createProductVariant,
   updateProductVariant,
   deleteProductVariant,
   getProductVariantsByProduct
};
