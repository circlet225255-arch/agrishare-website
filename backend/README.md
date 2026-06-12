# AgriShare Backend - API Server

Backend API cho nền tảng đầu tư nông nghiệp AgriShare, được xây dựng bằng Node.js, Express và MongoDB.

## 🚀 Cài Đặt & Chạy

### 1. Cài Đặt Dependencies

```bash
cd backend
npm install
```

### 2. Cấu Hình Environment

Tạo file `.env` từ `.env.example`, sau đó điền MongoDB connection string của bạn:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
MONGODB_DB_NAME=agrishare
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_a_long_random_secret
```

### 3. Chạy Server

**Development (với auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

### 4. Seed Database (Tạo Dữ Liệu Mẫu)

```bash
npm run seed
```

Điều này sẽ tạo/cập nhật user và project mẫu để test mà không xóa dữ liệu cũ. Nếu muốn reset dữ liệu mẫu, chạy `npm run seed -- --reset`.

---

### 5. Kiểm Tra Kết Nối Frontend

Sau khi backend chạy, frontend có thể đọc dữ liệu MongoDB qua:

```text
GET http://localhost:5000/api/v1/projects/marketplace
```

Nếu backend chưa chạy, website vẫn dùng dữ liệu tĩnh trong `app.js` để không bị trắng Marketplace.

### 6. Ghi Nhận Đơn Đầu Tư Thật Từ Website

Popup `Lựa chọn gói đầu tư` trên frontend gửi dữ liệu về API công khai:

```text
POST http://localhost:5000/api/v1/checkout/investment-orders
```

API này lưu 2 collection chính:

- `customers`: thông tin khách hàng, số điện thoại, email, địa chỉ, nguồn lead.
- `investmentorders`: mã đơn, dự án, gói đầu tư, số tiền, hình thức nhận hàng/farm, thanh toán và timeline vận hành.

Ví dụ payload:

```json
{
  "projectId": "PROJECT_OBJECT_ID",
  "packageKey": "goi-2",
  "customAmount": 20000000,
  "customer": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "user@example.com",
    "address": "TP.HCM"
  },
  "deliveryMethod": "home_delivery",
  "delivery": {
    "address": "TP.HCM",
    "participants": 1,
    "note": "Liên hệ giờ hành chính"
  },
  "consentAccepted": true
}
```

Tra cứu đơn bằng mã:

```text
GET http://localhost:5000/api/v1/checkout/orders/AGS-YYYYMMDD-XXXXX
```

Admin xem danh sách đơn:

```text
GET http://localhost:5000/api/v1/checkout/admin/orders
Authorization: Bearer <admin_token>
```

Admin cập nhật trạng thái đơn, thanh toán và ghi chú:

```text
PATCH http://localhost:5000/api/v1/checkout/admin/orders/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "paid",
  "paymentStatus": "paid",
  "paymentReference": "VCB-AGS-001",
  "internalNote": "Đã xác nhận chuyển khoản"
}
```


## 📊 Cấu Trúc Project

```
backend/
├── config/              # Cấu hình (Database)
│   └── database.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── projectController.js
│   └── investmentController.js
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Customer.js
│   ├── InvestmentOrder.js
│   ├── Project.js
│   ├── Investment.js
│   ├── Transaction.js
│   ├── Escrow.js
│   ├── QualityAudit.js
│   ├── Traceability.js
│   └── ProjectUpdate.js
├── routes/              # API endpoints
│   ├── auth.js
│   ├── projects.js
│   ├── checkout.js
│   └── investments.js
├── middleware/          # Middleware
│   ├── auth.js          # JWT authentication
│   └── errorHandler.js
├── scripts/             # Utility scripts
│   └── seedDatabase.js
├── .env                 # Environment variables
├── package.json
└── server.js            # Entry point
```

---

## 🔐 Authentication

### Đăng Ký

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "role": "investor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "role": "investor"
  }
}
```

### Đăng Nhập

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📋 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại (yêu cầu token)
- `PUT /api/v1/auth/profile` - Cập nhật hồ sơ (yêu cầu token)

### Projects
- `GET /api/v1/projects` - Lấy danh sách dự án
- `GET /api/v1/projects/:id` - Lấy chi tiết dự án
- `POST /api/v1/projects` - Tạo dự án (yêu cầu token + vai trò farmer)
- `PUT /api/v1/projects/:id` - Cập nhật dự án (yêu cầu token)
- `DELETE /api/v1/projects/:id` - Xóa dự án (yêu cầu token)
- `PUT /api/v1/projects/:id/funding` - Cập nhật tài chính dự án

### Investments
- `GET /api/v1/investments` - Lấy danh sách đầu tư của investor (yêu cầu token)
- `GET /api/v1/investments/:id` - Lấy chi tiết đầu tư (yêu cầu token)
- `POST /api/v1/investments` - Tạo đầu tư (yêu cầu token)
- `PUT /api/v1/investments/:id/confirm` - Xác nhận đầu tư & tạo escrow
- `PUT /api/v1/investments/:id/cancel` - Hủy đầu tư

### Checkout
- `POST /api/v1/checkout/investment-orders` - Website gửi đơn đầu tư công khai
- `GET /api/v1/checkout/orders/:orderCode` - Tra cứu đơn theo mã
- `GET /api/v1/checkout/admin/orders` - Admin xem toàn bộ đơn đầu tư, hỗ trợ `status` và `search`
- `PATCH /api/v1/checkout/admin/orders/:id` - Admin cập nhật trạng thái đơn, thanh toán và ghi chú

---

## 🧪 Ví Dụ API Calls

### 1. Tạo Dự Án (Farmer)

```bash
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bưởi da xanh Sông Xoài",
  "description": "Dự án trồng bưởi da xanh chất lượng cao",
  "category": "Bưởi da xanh",
  "location": {
    "province": "Tây Ninh",
    "district": "Sông Xoài",
    "coordinates": {
      "lat": 11.0,
      "lng": 105.5
    }
  },
  "capitalRequired": 260000000,
  "duration": "8 tháng",
  "expectedReturnRate": "10-14%",
  "riskLevel": "Ổn định chất lượng",
  "tags": ["Chất lượng", "Mùa vụ ổn định"]
}
```

### 2. Tạo Đầu Tư (Investor)

```bash
POST /api/v1/investments
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439011",
  "packageId": "507f1f77bcf86cd799439012",
  "amount": 20000000
}
```

### 3. Xác Nhận Đầu Tư (Tạo Escrow)

```bash
PUT /api/v1/investments/507f1f77bcf86cd799439013/confirm
Authorization: Bearer <token>
```

---

## 👥 Roles & Permissions

| Role | Permissions |
|------|-----------|
| **investor** | Tạo đầu tư, xem danh sách đầu tư, xem dự án |
| **farmer** | Tạo/sửa dự án, cập nhật tiến độ, xem đầu tư vào dự án |
| **auditor** | Tạo báo cáo QA/QC, xem dự án |
| **consumer** | Xem dự án, xem cộng đồng |
| **admin** | Quản lý toàn bộ hệ thống |

---

## 📦 Collections trong MongoDB

1. **users** - Quản lý người dùng
2. **projects** - Dự án đầu tư
3. **customers** - Khách hàng/lead từ website
4. **investmentorders** - Đơn đặt đầu tư, gói vốn, giao hàng/farm, timeline xử lý
5. **investments** - Danh mục đầu tư đã đăng nhập
6. **transactions** - Ghi chép giao dịch
7. **escrows** - Quản lý tiền ký quỹ
8. **quality_audits** - QA/QC
9. **traceability** - Truy xuất sản phẩm
10. **project_updates** - Nhật ký tiến độ cập nhật 1 lần mỗi tuần, kèm hình ảnh và video thực tế

---

## 🔒 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Error handling

---

## 📝 Sample Users (Sau khi Seed)

```
Farmer:
- Email: farmer1@agrishare.com
- Password: password123

Investor:
- Email: investor1@agrishare.com
- Password: password123

Auditor:
- Email: auditor@agrishare.com
- Password: password123

Admin:
- Email: admin@agrishare.com
- Password: admin123
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
❌ MongoDB Connection Error:
   Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Kiểm tra MongoDB URI trong `.env` hoặc chắc chắn MongoDB Atlas connection string đúng.

### JWT Token Expired

```
{
  "success": false,
  "message": "JSON Web Token is expired, try again"
}
```

**Solution:** Lấy token mới bằng cách đăng nhập lại.

### CORS Error

Nếu gặp lỗi CORS từ frontend, kiểm tra `CORS_ORIGIN` trong `.env`:

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

---

## 📚 Tài Liệu Tham Khảo

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)

---

## 📞 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. `.env` configuration
2. MongoDB connection
3. Node.js version (v14+)
4. Dependencies installation

---

**Happy coding! 🎉**
