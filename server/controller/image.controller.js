const Image = require("../models/Image");
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const fsPromises = require('fs/promises');
const ProductVariant = require("../models/ProductVariant");

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads/products'));
   },
   filename: function (req, file, cb) {
      // Tạo tên file duy nhất bằng cách thêm timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
   const allowedTypes = /jpeg|jpg|png|gif|webp/;
   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = allowedTypes.test(file.mimetype);

   if (extname && mimetype) {
      return cb(null, true);
   } else {
      cb('Error: Chỉ chấp nhận file ảnh!');
   }
};

const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits: {
      fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
   }
}).single('image'); // 'image' là tên field trong form

// Đường dẫn thư mục lưu trữ ảnh
const uploadDir = path.join(__dirname, '../public/uploads/products');
const DEFAULT_IMAGE = 'default-image.webp';

// Hàm kiểm tra và xác thực file ảnh bất đồng bộ
async function validateImageFiles(images) {
   try {
      // Đọc danh sách file một lần để tối ưu hiệu suất
      const existingFiles = await fsPromises.readdir(uploadDir);

      return images.map(image => {
         // Trích xuất tên file từ imageURL
         const filename = path.basename(image.imageURL);

         // Kiểm tra file có tồn tại không
         const isValid = existingFiles.includes(filename);

         return {
            ...image,
            isValid: isValid,
            originalImageURL: image.imageURL,
            imageURL: isValid ? image.imageURL : DEFAULT_IMAGE
         };
      });
   } catch (error) {
      console.error('Lỗi khi kiểm tra file ảnh:', error);
      return images.map(image => ({
         ...image,
         isValid: false,
         imageURL: DEFAULT_IMAGE
      }));
   }
}

// Kiểm tra tồn tại của file ảnh
const checkImageFileExists = (filename) => {
   const uploadDir = path.join(__dirname, '../public/uploads/products');
   const filePath = path.join(uploadDir, filename);
   return fs.existsSync(filePath);
};

// Thêm hình ảnh mới
const uploadImage = async (req, res) => {
   upload(req, res, async (err) => {
      if (err) {
         return res.status(400).json({ message: err });
      }

      try {
         if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
         }

         const { isThumbnail, productID, variantID } = req.body;

         // Tạo đường dẫn tương đối cho imageURL
         const imageURL = `uploads/products/${req.file.filename}`;

         const newImage = new Image({
            imageURL,
            isThumbnail: isThumbnail === 'true',
            productID,
            variantID
         });

         await newImage.save();
         res.status(201).json(newImage);
      } catch (err) {
         res.status(500).json({ message: "Error adding image", error: err });
      }
   });
};

// Xóa hình ảnh
const deleteImage = async (req, res) => {
   try {
      const image = await Image.findById(req.params.id);
      if (!image) {
         return res.status(404).json({ message: "Image not found" });
      }

      // Xóa file ảnh từ server
      const filePath = path.join(__dirname, '..', image.imageURL);
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
      }

      await Image.findByIdAndDelete(req.params.id);
      res.json({ message: "Image deleted" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

// Lấy ảnh thumbnail của sản phẩm
const fetchThumbnail = async (req, res) => {
   try {
      const { productId } = req.params;

      const image = await Image.findOne({
         productID: productId,
         isThumbnail: true
      }).select('imageURL -_id');

      if (!image) {
         return res.send('');
      }

      res.send(image.imageURL);
   } catch (error) {
      console.error('Error in fetchThumbnail:', error);
      res.send('');
   }
};

// Lấy danh sách ảnh theo variant
const fetchImageVariants = async (req, res) => {
   try {
      const { variantId } = req.params;
      const images = await Image.find({
         variantID: variantId,
         isThumbnail: false
      });

      // Lọc các file tồn tại
      const existingImages = images.filter(image => 
         checkImageFileExists(image.imageURL)
      );

      // Trả về tên các file tồn tại
      const existingImageUrls = existingImages.map(image => image.imageURL);

      res.status(200).json(existingImageUrls);
   } catch (error) {
      console.error('Lỗi khi lấy ảnh variant:', error);
      res.status(500).json({
         message: "Lỗi khi lấy ảnh variant",
         error: error.message
      });
   }
};

module.exports = {
   uploadImage,
   deleteImage,
   fetchThumbnail,
   fetchImageVariants,
};
