const Category = require("../models/Category");

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
   try {
      const categories = await Category.find();
      res.status(200).json(categories);
   } catch (err) {
      res
         .status(500)
         .json({ message: "Error retrieving categories", error: err });
   }
};

// Lấy thông tin danh mục theo ID
const getCategoryById = async (req, res) => {
   try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category)
         return res.status(404).json({ message: "Category not found" });
      res.status(200).json(category);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving category", error: err });
   }
};

// Tạo mới danh mục
const createCategory = async (req, res) => {
   try {
      const { name, description } = req.body;

      // Kiểm tra nếu tên danh mục đã tồn tại
      const existingCategory = await Category.findOne({ name });
      if (existingCategory)
         return res.status(400).json({ message: "Category name already exists" });

      const newCategory = new Category({ name, description });
      await newCategory.save();
      res.status(201).json(newCategory);
   } catch (err) {
      res.status(500).json({ message: "Error creating category", error: err });
   }
};

// Cập nhật thông tin danh mục
const updateCategory = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updatedCategory = await Category.findByIdAndUpdate(
         id,
         { name, description },
         { new: true }
      );

      if (!updatedCategory)
         return res.status(404).json({ message: "Category not found" });

      res.status(200).json(updatedCategory);
   } catch (err) {
      res.status(500).json({ message: "Error updating category", error: err });
   }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
   try {
      const { id } = req.params;

      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory)
         return res.status(404).json({ message: "Category not found" });

      res.status(200).json({ message: "Category deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting category", error: err });
   }
};

module.exports = {
   getAllCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory,
};
