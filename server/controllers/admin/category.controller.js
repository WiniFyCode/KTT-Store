const Category = require('../../models/Category');
const ApiError = require('../../utils/ApiError');
const { handleAsync } = require('../../utils/handleAsync');

// Lấy danh sách tất cả danh mục
exports.getAllCategories = handleAsync(async (req, res) => {
    const categories = await Category.find().sort({ categoryID: 1 });
    res.status(200).json({
        status: 'success',
        data: categories
    });
});

// Lấy chi tiết một danh mục
exports.getCategory = handleAsync(async (req, res) => {
    const category = await Category.findOne({ categoryID: req.params.id });
    if (!category) {
        throw new ApiError(404, 'Không tìm thấy danh mục');
    }
    res.status(200).json({
        status: 'success',
        data: category
    });
});

// Tạo danh mục mới
exports.createCategory = handleAsync(async (req, res) => {
    const lastCategory = await Category.findOne().sort({ categoryID: -1 });
    const categoryID = lastCategory ? lastCategory.categoryID + 1 : 1;

    const newCategory = await Category.create({
        ...req.body,
        categoryID
    });

    res.status(201).json({
        status: 'success',
        data: newCategory
    });
});

// Cập nhật danh mục
exports.updateCategory = handleAsync(async (req, res) => {
    const category = await Category.findOneAndUpdate(
        { categoryID: req.params.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!category) {
        throw new ApiError(404, 'Không tìm thấy danh mục');
    }

    res.status(200).json({
        status: 'success',
        data: category
    });
});

// Xóa danh mục
exports.deleteCategory = handleAsync(async (req, res) => {
    const category = await Category.findOneAndDelete({ categoryID: req.params.id });

    if (!category) {
        throw new ApiError(404, 'Không tìm thấy danh mục');
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
