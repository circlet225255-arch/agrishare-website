# 🚀 Hướng Dẫn Chạy Backend AgriShare

## Yêu Cầu
- Node.js v14+
- npm hoặc yarn
- MongoDB Account (đã có: mongodb+srv://truong:truong@cluster0.bjcva1u.mongodb.net)

## Bước 1: Cài Đặt Dependencies

```bash
cd backend
npm install
```

Lệnh này sẽ cài các package sau:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Biến môi trường
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin requests
- `helmet` - Security headers

## Bước 2: Kiểm Tra File .env

File `.env` đã được tạo sẵn với:
```env
MONGODB_URI=mongodb+srv://truong:truong@cluster0.bjcva1u.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

✅ Sẵn sàng để chạy!

## Bước 3: Chạy Server

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

**Output:**
```
╔═══════════════════════════════════════╗
║   🚀 AgriShare Backend Server         ║
╠═══════════════════════════════════════╣
║ Server:  http://localhost:5000
║ API:     /api/v1
║ ENV:     development
║ Port:    5000
╚═══════════════════════════════════════╝
```

## Bước 4: Tạo Dữ Liệu Mẫu (Tùy Chọn)

```bash
npm run seed
```

Điều này sẽ tạo:
- 4 users (farmer, investor, auditor, admin)
- 3 projects mẫu

**Sample Credentials:**
```
Farmer:   farmer1@agrishare.com / password123
Investor: investor1@agrishare.com / password123
Auditor:  auditor@agrishare.com / password123
Admin:    admin@agrishare.com / admin123
```

## Bước 5: Test API

### Health Check
```bash
curl http://localhost:5000/health
```

### Đăng Ký
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "investor"
  }'
```

### Đăng Nhập
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Sẽ nhận được JWT token.

### Lấy Danh Sách Dự Án
```bash
curl http://localhost:5000/api/v1/projects
```

## 📊 Cấu Trúc Thư Mục

```
backend/
├── .env                 # Biến môi trường (MongoDB URI)
├── .gitignore
├── package.json         # Dependencies
├── server.js            # Entry point
├── README.md
├── QUICKSTART.md        # File này
├── config/
│   └── database.js      # MongoDB connection
├── models/              # Mongoose schemas (7 models)
├── controllers/         # Business logic
├── routes/              # API endpoints
├── middleware/          # Auth, error handling
├── scripts/
│   └── seedDatabase.js  # Tạo dữ liệu mẫu
└── utils/               # Utility functions
```

## 🔧 Các Lệnh NPM

| Lệnh | Chức Năng |
|------|---------|
| `npm start` | Chạy server (production) |
| `npm run dev` | Chạy server với auto-reload |
| `npm run seed` | Tạo dữ liệu mẫu |
| `npm test` | Chạy tests |

## 📝 API Endpoints

**Auth:**
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Info user
- `PUT /api/v1/auth/profile` - Update profile

**Projects:**
- `GET /api/v1/projects` - Danh sách
- `POST /api/v1/projects` - Tạo (farmer only)
- `GET /api/v1/projects/:id` - Chi tiết
- `PUT /api/v1/projects/:id` - Update (farmer only)

**Investments:**
- `POST /api/v1/investments` - Tạo đầu tư
- `GET /api/v1/investments` - Danh sách của investor
- `PUT /api/v1/investments/:id/confirm` - Confirm & escrow

## 🐛 Debug Issues

### 1. MongoDB Connection Failed
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```
**Fix:** Kiểm tra `.env` - MONGODB_URI có đúng không

### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Thay đổi PORT trong `.env` hoặc kill process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### 3. Module Not Found
```
Cannot find module 'express'
```
**Fix:** Cài lại dependencies
```bash
rm -rf node_modules
npm install
```

## 💾 MongoDB Dữ Liệu

Dữ liệu sẽ được lưu vào MongoDB Atlas cluster:
- **Cluster:** cluster0.bjcva1u.mongodb.net
- **Database:** agrishare (tự động tạo)
- **Collections:** users, projects, investments, transactions, escrows, quality_audits, traceability, project_updates

## ✅ Kiểm Tra Xong

Khi thấy:
```
✅ MongoDB Connected Successfully
   Database: agrishare
   Host: cluster0.bjcva1u.mongodb.net
```

Server đã sẵn sàng! 🎉

## 📞 Support

- Xem chi tiết API docs: [README.md](README.md)
- Database design: [DATABASE-DESIGN.md](../DATABASE-DESIGN.md)

---

**Happy coding!** 🚀
