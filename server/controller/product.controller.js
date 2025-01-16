const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Category = require("../models/Category");
const Target = require("../models/Target");

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
   try {
      const products = await Product.find().populate("categoryID targetID");
      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving products", error: err });
   }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
   try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("categoryID targetID");
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(product);
   } catch (err) {
      res.status(500).json({ message: "Error retrieving product", error: err });
   }
};

// Tạo mới sản phẩm
const createProduct = async (req, res) => {
   try {
      const { name, description, price, categoryID, targetID } = req.body;
      const newProduct = new Product({
         name,
         description,
         price,
         categoryID,
         targetID,
      });
      await newProduct.save();
      res.status(201).json(newProduct);
   } catch (err) {
      res.status(500).json({ message: "Error creating product", error: err });
   }
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, description, price, categoryID, targetID } = req.body;

      // Validate dữ liệu
      if (!name || !description || !price || !categoryID || !targetID) {
         return res.status(400).json({ 
            message: "Missing required fields",
            received: { name, description, price, categoryID, targetID }
         });
      }

      // Kiểm tra danh mục và đối tượng tồn tại
      const [category, target] = await Promise.all([
         Category.findById(categoryID),
         Target.findById(targetID)
      ]);

      if (!category) {
         return res.status(400).json({ message: "Category not found" });
      }
      if (!target) {
         return res.status(400).json({ message: "Target not found" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
         id,
         { name, description, price, categoryID, targetID },
         { new: true }
      ).populate('categoryID targetID');

      if (!updatedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(updatedProduct);
   } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ 
         message: "Error updating product", 
         error: err.message 
      });
   }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct)
         return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ message: "Product deleted successfully" });
   } catch (err) {
      res.status(500).json({ message: "Error deleting product", error: err });
   }
};

// Lấy danh sách sản phẩm cho trang quản lý
const getAllProductsForAdmin = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortField = 'createdAt', 
            sortOrder = 'desc',
            searchTerm = '',
            categoryId = '',
            targetId = ''
        } = req.query;

        // Validate page number
        const pageNumber = parseInt(page);
        const itemsPerPage = parseInt(limit);
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ message: 'Số trang không hợp lệ' });
        }

        const skip = (pageNumber - 1) * itemsPerPage;

        // Xây dựng pipeline
        const pipeline = [
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'targets',
                    localField: 'targetID',
                    foreignField: '_id',
                    as: 'target'
                }
            },
            { $unwind: '$target' },
            {
                $lookup: {
                    from: 'images',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { 
                                    $and: [
                                        { $eq: ['$productID', '$$productId'] },
                                        { $eq: ['$isThumbnail', true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'thumbnail'
                }
            },
            {
                $addFields: {
                    thumbnailUrl: { $arrayElemAt: ['$thumbnail.imageURL', 0] }
                }
            }
        ];

        // Thêm điều kiện tìm kiếm
        if (searchTerm) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: searchTerm, $options: 'i' } },
                        { 'category.name': { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            });
        }

        // Lọc theo category
        if (categoryId) {
            pipeline.push({
                $match: { categoryID: categoryId }
            });
        }

        // Lọc theo target
        if (targetId) {
            pipeline.push({
                $match: { targetID: targetId }
            });
        }

        // Project các trường cần thiết
        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                description: 1,
                status: 1,
                categoryName: '$category.name',
                categoryId: '$category._id',
                target: '$target.target',
                targetId: '$target._id',
                thumbnailUrl: 1,
                createdAt: 1,
                updatedAt: 1
            }
        });

        // Đếm tổng số sản phẩm
        const totalProducts = await Product.aggregate([...pipeline, { $count: 'total' }]);
        const total = totalProducts.length > 0 ? totalProducts[0].total : 0;
        const totalPages = Math.ceil(total / itemsPerPage);

        // Thêm sort và pagination
        pipeline.push(
            { $sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 } },
            { $skip: skip },
            { $limit: itemsPerPage }
        );

        // Thực hiện truy vấn
        const products = await Product.aggregate(pipeline);

        res.status(200).json({
            products,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalItems: total,
                itemsPerPage
            }
        });

    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message 
        });
    }
};

// Lấy danh sách sản phẩm cho trang Products (customer)
const getProductsForCustomer = async (req, res) => {
    try {
        const {
            page = 1,
            search = '',
            categoryId = '',
            targetId = '',
            minPrice = 0,
            maxPrice = Number.MAX_SAFE_INTEGER,
            sortBy = 'newest',
            inStock = true
        } = req.query;

        // Validate page number
        const pageNumber = parseInt(page);
        const itemsPerPage = 12; // Cố định 12 sản phẩm mỗi trang

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ message: 'Số trang không hợp lệ' });
        }

        const skip = (pageNumber - 1) * itemsPerPage;

        // Xây dựng query cơ bản
        let query = {};

        // Thêm điều kiện tìm kiếm
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (categoryId) {
            query.categoryID = mongoose.Types.ObjectId(categoryId);
        }

        if (targetId) {
            query.targetID = mongoose.Types.ObjectId(targetId);
        }

        query.price = {
            $gte: parseFloat(minPrice),
            $lte: parseFloat(maxPrice)
        };

        // Tạo pipeline
        const pipeline = [
            { $match: query },
            // Lookup variants
            {
                $lookup: {
                    from: 'product_variants',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$productID', '$$productId'] }
                            }
                        },
                        {
                            $group: {
                                _id: '$productID',
                                totalStock: { $sum: '$stock' },
                                variants: {
                                    $push: {
                                        size: '$size',
                                        color: '$color',
                                        stock: '$stock'
                                    }
                                }
                            }
                        }
                    ],
                    as: 'variantInfo'
                }
            },
            {
                $unwind: {
                    path: '$variantInfo',
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        // Thêm điều kiện stock
        if (inStock === 'true') {
            pipeline.push({
                $match: {
                    'variantInfo.totalStock': { $gt: 0 }
                }
            });
        }

        // Lookup category và target
        pipeline.push(
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                    from: 'targets',
                    localField: 'targetID',
                    foreignField: '_id',
                    as: 'target'
                }
            },
            { $unwind: '$target' }
        );

        // Lookup thumbnail
        pipeline.push({
            $lookup: {
                from: 'images',
                let: { productId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$productID', '$$productId'] },
                                    { $eq: ['$isThumbnail', true] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            imageURL: 1
                        }
                    }
                ],
                as: 'thumbnail'
            }
        });

        // Project kết quả
        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                price: 1,
                category: {
                    _id: '$category._id',
                    name: '$category.name'
                },
                target: {
                    _id: '$target._id',
                    target: '$target.target'
                },
                variants: '$variantInfo.variants',
                totalStock: '$variantInfo.totalStock',
                inStock: { $gt: ['$variantInfo.totalStock', 0] },
                thumbnail: { $arrayElemAt: ['$thumbnail.imageURL', 0] },
                createdAt: 1
            }
        });

        // Sắp xếp với tiêu chí phụ là _id để đảm bảo thứ tự nhất quán
        let sortStage = {};
        switch (sortBy) {
            case 'price_asc':
                sortStage = { price: 1, _id: 1 };
                break;
            case 'price_desc':
                sortStage = { price: -1, _id: 1 };
                break;
            case 'name_asc':
                sortStage = { name: 1, _id: 1 };
                break;
            case 'name_desc':
                sortStage = { name: -1, _id: 1 };
                break;
            default: // newest
                sortStage = { createdAt: -1, _id: 1 };
        }

        pipeline.push({ $sort: sortStage });

        // Thực hiện đếm tổng số sản phẩm
        const totalCount = await Product.aggregate([...pipeline, { $count: 'total' }]);

        // Thêm phân trang
        pipeline.push(
            { $skip: skip },
            { $limit: itemsPerPage }
        );

        // Lấy danh sách sản phẩm
        const products = await Product.aggregate(pipeline);

        // Tính toán phân trang
        const total = totalCount[0]?.total || 0;
        const totalPages = Math.ceil(total / itemsPerPage);

        res.status(200).json({
            products,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalProducts: total,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        });

    } catch (err) {
        console.error('Error getting products:', err);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: err.message
        });
    }
};

module.exports = {
   getAllProducts,
   getProductById,
   createProduct,
   updateProduct,
   deleteProduct,
   getAllProductsForAdmin,
   getProductsForCustomer
};
