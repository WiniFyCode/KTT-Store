# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Tất cả các API (trừ đăng nhập/đăng ký) đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## User APIs

### Đăng ký
```http
POST /auth/register
Content-Type: application/json

{
    "username": "user123",
    "password": "Password123!",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "phone": "0123456789"
}
```

### Đăng nhập
```http
POST /auth/login
Content-Type: application/json

{
    "username": "user123",
    "password": "Password123!"
}
```

### Lấy thông tin user
```http
GET /users/profile
```

### Cập nhật thông tin user
```http
PUT /users/profile
Content-Type: application/json

{
    "fullName": "Nguyen Van A",
    "phone": "0123456789",
    "email": "user@example.com"
}
```

### Đổi mật khẩu
```http
PUT /users/change-password
Content-Type: application/json

{
    "oldPassword": "Password123!",
    "newPassword": "NewPassword123!"
}
```

## Address APIs

### Lấy danh sách địa chỉ
```http
GET /addresses
```

### Thêm địa chỉ mới
```http
POST /addresses
Content-Type: application/json

{
    "fullName": "Nguyen Van A",
    "phone": "0123456789",
    "province": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng",
    "street": "123 Xuân Thủy",
    "isDefault": true
}
```

### Cập nhật địa chỉ
```http
PUT /addresses/:id
Content-Type: application/json

{
    "fullName": "Nguyen Van A",
    "phone": "0123456789",
    "province": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng",
    "street": "123 Xuân Thủy",
    "isDefault": true
}
```

### Xóa địa chỉ
```http
DELETE /addresses/:id
```

## Product APIs

### Lấy danh sách sản phẩm
```http
GET /products?page=1&limit=10&category=1&target=2&minPrice=100000&maxPrice=500000&sort=price_asc
```

### Lấy chi tiết sản phẩm
```http
GET /products/:id
```

### Tìm kiếm sản phẩm
```http
GET /products/search?q=áo&page=1&limit=10
```

### [ADMIN] Thêm sản phẩm mới
```http
POST /products
Content-Type: application/json

{
    "name": "Áo thun nam",
    "description": "Áo thun nam cotton 100%",
    "categoryID": 1,
    "targetID": 1,
    "price": 199000,
    "images": ["image1.jpg", "image2.jpg"],
    "colors": [
        {
            "name": "Đen",
            "code": "#000000",
            "image": "black.jpg"
        }
    ],
    "sizes": [
        {
            "name": "M",
            "stock": 100
        }
    ]
}
```

### [ADMIN] Cập nhật sản phẩm
```http
PUT /products/:id
Content-Type: application/json

{
    "name": "Áo thun nam",
    "description": "Áo thun nam cotton 100%",
    "price": 199000,
    "images": ["image1.jpg", "image2.jpg"]
}
```

### [ADMIN] Xóa sản phẩm
```http
DELETE /products/:id
```

## Cart APIs

### Lấy giỏ hàng
```http
GET /cart
```

### Thêm vào giỏ hàng
```http
POST /cart/add
Content-Type: application/json

{
    "SKU": "AT001-DEN-M",
    "quantity": 1
}
```

### Cập nhật số lượng
```http
PUT /cart/:id
Content-Type: application/json

{
    "quantity": 2
}
```

### Xóa khỏi giỏ hàng
```http
DELETE /cart/:id
```

### Xóa toàn bộ giỏ hàng
```http
DELETE /cart
```

## Order APIs

### Tạo đơn hàng mới
```http
POST /orders
Content-Type: application/json

{
    "addressID": 1,
    "items": [
        {
            "SKU": "AT001-DEN-M",
            "quantity": 1
        }
    ],
    "couponCode": "SALE10"
}
```

### Lấy danh sách đơn hàng
```http
GET /orders?page=1&limit=10&status=pending
```

### Lấy chi tiết đơn hàng
```http
GET /orders/:id
```

### Hủy đơn hàng
```http
PUT /orders/:id/cancel
```

### [ADMIN] Cập nhật trạng thái đơn hàng
```http
PUT /orders/:id/status
Content-Type: application/json

{
    "status": "processing"
}
```

## Favorite APIs

### Lấy danh sách yêu thích
```http
GET /favorites?page=1&limit=10
```

### Thêm vào yêu thích
```http
POST /favorites/add
Content-Type: application/json

{
    "SKU": "AT001-DEN-M",
    "note": "Size M màu đen"
}
```

### Cập nhật ghi chú
```http
PUT /favorites/:id
Content-Type: application/json

{
    "note": "Size M màu đen đẹp"
}
```

### Xóa khỏi yêu thích
```http
DELETE /favorites/:id
```

### Kiểm tra sản phẩm có trong yêu thích
```http
GET /favorites/check/:SKU
```

## Coupon APIs

### Lấy danh sách coupon có thể sử dụng
```http
GET /coupons/available
```

### Lấy chi tiết coupon
```http
GET /coupons/:code
```

### [ADMIN] Tạo coupon mới
```http
POST /coupons
Content-Type: application/json

{
    "code": "SALE10",
    "type": "percent",
    "value": 10,
    "minOrderValue": 500000,
    "maxDiscount": 100000,
    "quantity": 100,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z"
}
```

### [ADMIN] Cập nhật coupon
```http
PUT /coupons/:code
Content-Type: application/json

{
    "quantity": 200,
    "endDate": "2024-12-31T23:59:59Z"
}
```

### [ADMIN] Xóa coupon
```http
DELETE /coupons/:code
```

## User Coupon APIs

### Lấy danh sách coupon của user
```http
GET /user-coupons?page=1&limit=10
```

### Thêm coupon vào ví
```http
POST /user-coupons/add
Content-Type: application/json

{
    "code": "SALE10"
}
```

### Hủy coupon
```http
DELETE /user-coupons/:id
```

## Notification APIs

### Lấy danh sách thông báo của user
```http
GET /notifications?page=1&limit=10&isRead=false
```

### Đánh dấu đã đọc
```http
PUT /notifications/read/:id
```

### Đánh dấu tất cả đã đọc
```http
PUT /notifications/read-all
```

### [ADMIN] Lấy tất cả thông báo
```http
GET /notifications/all?page=1&limit=10&type=system
```

### [ADMIN] Tạo thông báo mới
```http
POST /notifications/create
Content-Type: application/json

{
    "title": "Khuyến mãi mới",
    "type": "promotion",
    "message": "Giảm giá 50% cho tất cả sản phẩm",
    "scheduledFor": "2024-01-20T00:00:00Z",
    "expiresAt": "2024-01-31T23:59:59Z",
    "userIDs": [1, 2, 3]  // Optional: Nếu không có sẽ gửi cho tất cả user
}
```

### [ADMIN] Cập nhật thông báo
```http
PUT /notifications/:id
Content-Type: application/json

{
    "title": "Khuyến mãi hot",
    "message": "Giảm giá 50% cho tất cả sản phẩm mùa đông"
}
```

### [ADMIN] Xóa thông báo
```http
DELETE /notifications/:id
```
