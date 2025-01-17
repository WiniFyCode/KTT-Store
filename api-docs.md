# API Documentation

## Authentication APIs
### Public Routes
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

## User Management APIs
### Customer Routes (Yêu cầu xác thực)
- `GET /api/users/profile` - Lấy thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin cá nhân
- `PUT /api/users/change-password` - Đổi mật khẩu

### Admin Routes (Yêu cầu quyền admin)
- `GET /api/admin/users` - Lấy danh sách người dùng
- `GET /api/admin/users/:id` - Lấy chi tiết người dùng
- `POST /api/admin/users` - Tạo tài khoản mới
- `PUT /api/admin/users/:id` - Cập nhật thông tin người dùng
- `PATCH /api/admin/users/:id/status` - Vô hiệu hóa/Kích hoạt tài khoản

## Product Management APIs
### Public Routes
- `GET /api/products` - Lấy danh sách sản phẩm (có phân trang và lọc)
- `GET /api/products/:id` - Lấy chi tiết sản phẩm

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/products` - Tạo sản phẩm mới
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm (soft delete)
- `PATCH /api/admin/products/:id/restore` - Khôi phục sản phẩm

## Category Management APIs
### Public Routes
- `GET /api/categories` - Lấy tất cả danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/categories` - Tạo danh mục mới
- `PUT /api/admin/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/categories/:id` - Xóa danh mục

## Cart Management APIs (Yêu cầu xác thực)
- `GET /api/cart` - Lấy giỏ hàng của user
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/:id` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/:id` - Xóa sản phẩm khỏi giỏ

## Favorite Management APIs (Yêu cầu xác thực)
- `GET /api/favorite` - Lấy danh sách yêu thích
- `POST /api/favorite/:productId` - Thêm sản phẩm vào yêu thích
- `DELETE /api/favorite/:productId` - Xóa sản phẩm khỏi yêu thích

## Order Management APIs
### Customer Routes (Yêu cầu xác thực)
- `GET /api/order/my-orders` - Lấy danh sách đơn hàng của user
- `GET /api/order/my-orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/order/create` - Tạo đơn hàng mới
- `POST /api/order/cancel/:id` - Hủy đơn hàng

### Admin Routes (Yêu cầu quyền admin)
- `GET /api/admin/orders` - Lấy tất cả đơn hàng
- `PUT /api/admin/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Order Detail Management APIs (Yêu cầu xác thực)
- `GET /api/order-detail/order/:orderID` - Lấy danh sách chi tiết đơn hàng
- `GET /api/order-detail/order/:orderID/detail/:id` - Lấy chi tiết một sản phẩm

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/order-detail/order/:orderID` - Thêm sản phẩm vào đơn hàng
- `PUT /api/admin/order-detail/order/:orderID/detail/:id` - Cập nhật số lượng sản phẩm
- `DELETE /api/admin/order-detail/order/:orderID/detail/:id` - Xóa sản phẩm khỏi đơn hàng

## Product Color Management APIs
### Public Routes
- `GET /api/product-color/product/:productID` - Lấy tất cả màu của sản phẩm
- `GET /api/product-color/:id` - Lấy chi tiết màu

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/product-color` - Thêm màu mới
- `PUT /api/admin/product-color/:id` - Cập nhật màu
- `DELETE /api/admin/product-color/:id` - Xóa màu
- `POST /api/admin/product-color/:id/images` - Upload hình ảnh
- `DELETE /api/admin/product-color/:id/images` - Xóa hình ảnh

## Product Stock Management APIs
### Public Routes
- `GET /api/product-stock/sku/:SKU` - Lấy thông tin tồn kho theo SKU
- `GET /api/product-stock/product/:productID` - Lấy thông tin tồn kho theo sản phẩm

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/product-stock` - Thêm size và số lượng
- `PUT /api/admin/product-stock/:SKU` - Cập nhật số lượng
- `DELETE /api/admin/product-stock/:SKU` - Xóa size
- `POST /api/admin/product-stock/check-batch` - Kiểm tra tồn kho hàng loạt

## Review Management APIs (Yêu cầu xác thực)
- `GET /api/review/product/:productId` - Lấy đánh giá của sản phẩm
- `POST /api/review/product/:productId` - Thêm đánh giá mới
- `PUT /api/review/:id` - Cập nhật đánh giá
- `DELETE /api/review/:id` - Xóa đánh giá

## Address Management APIs (Yêu cầu xác thực)
- `GET /api/address` - Lấy danh sách địa chỉ
- `GET /api/address/:id` - Lấy chi tiết địa chỉ
- `POST /api/address` - Thêm địa chỉ mới
- `PUT /api/address/:id` - Cập nhật địa chỉ
- `DELETE /api/address/:id` - Xóa địa chỉ

## Coupon Management APIs
### Customer Routes (Yêu cầu xác thực)
- `GET /api/coupon/available` - Lấy danh sách mã có thể sử dụng
- `POST /api/coupon/apply` - Áp dụng mã giảm giá
- `GET /api/coupon/history` - Lấy lịch sử sử dụng mã

### Admin Routes (Yêu cầu quyền admin)
- `GET /api/admin/coupons/all` - Lấy tất cả mã giảm giá
- `POST /api/admin/coupons` - Tạo mã giảm giá mới
- `PUT /api/admin/coupons/:id` - Cập nhật mã giảm giá
- `DELETE /api/admin/coupons/:id` - Xóa mã giảm giá

## User-Coupon Management APIs
### Customer Routes (Yêu cầu xác thực)
- `GET /api/user-coupon/my-coupons` - Lấy danh sách mã giảm giá của user
- `GET /api/user-coupon/my-coupons/:id` - Lấy chi tiết mã giảm giá
- `POST /api/user-coupon/:id/use` - Sử dụng mã giảm giá

### Admin Routes (Yêu cầu quyền admin)
- `GET /api/admin/user-coupon` - Lấy danh sách mã giảm giá của tất cả user
- `POST /api/admin/user-coupon` - Thêm mã giảm giá cho user
- `PUT /api/admin/user-coupon/:id` - Cập nhật mã giảm giá
- `PATCH /api/admin/user-coupon/:id/cancel` - Hủy mã giảm giá

## Notification Management APIs
### Customer Routes (Yêu cầu xác thực)
- `GET /api/notification` - Lấy thông báo của user

### Admin Routes (Yêu cầu quyền admin)
- `GET /api/admin/notification/all` - Lấy tất cả thông báo
- `POST /api/admin/notification/create` - Tạo thông báo mới
- `PUT /api/admin/notification/:id` - Cập nhật thông báo
- `DELETE /api/admin/notification/:id` - Xóa thông báo

## Target Management APIs
### Public Routes
- `GET /api/target` - Lấy tất cả target
- `GET /api/target/:id` - Lấy chi tiết target

### Admin Routes (Yêu cầu quyền admin)
- `POST /api/admin/target` - Tạo target mới
- `PUT /api/admin/target/:id` - Cập nhật target
- `DELETE /api/admin/target/:id` - Xóa target
