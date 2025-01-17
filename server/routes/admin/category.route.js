const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/category.controller');
const { authenticateAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateAdmin);

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

router.route('/:id')
    .get(categoryController.getCategory)
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
