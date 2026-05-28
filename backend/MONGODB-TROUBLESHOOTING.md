# MongoDB Connection Troubleshooting Guide

## ❌ Lỗi: `querySrv ECONNREFUSED _mongodb._tcp.cluster0.bjcva1u.mongodb.net`

Lỗi này có nghĩa là server không thể tìm DNS record cho MongoDB Atlas cluster.

## 🔍 Nguyên Nhân & Giải Pháp

### 1. **Vấn Đề DNS/Network**

**Nguyên nhân:**
- Không có kết nối internet
- VPN/Firewall chặn kết nối
- ISP chặn port MongoDB
- DNS server không phản hồi

**Giải Pháp:**
```bash
# Test kết nối internet
ping 8.8.8.8

# Test DNS resolution
nslookup cluster0.bjcva1u.mongodb.net

# Test MongoDB Atlas host
ping cluster0.bjcva1u.mongodb.net
```

### 2. **IP Whitelist MongoDB Atlas**

**Kiểm tra:** https://cloud.mongodb.com/
1. Đăng nhập MongoDB Atlas
2. Vào Network Access → IP Whitelist
3. **Thêm 0.0.0.0/0** (cho phép toàn bộ IP) hoặc thêm IP cụ thể của bạn

![MongoDB Whitelist](https://docs.mongodb.com/manual/_images/atlas-add-ip.png)

### 3. **Connection String Sai**

**Kiểm tra .env file:**
```bash
cat .env
```

Phải có dòng:
```env
MONGODB_URI=mongodb+srv://truong:truong@cluster0.bjcva1u.mongodb.net/?appName=Cluster0
```

### 4. **Firewall/VPN Chặn**

**Giải Pháp:**
- Tắt VPN tạm thời
- Kiểm tra Firewall Windows:
  ```powershell
  # Tắt Windows Firewall (tạm thời để test)
  Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $False
  
  # Bật lại
  Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $True
  ```

---

## ✅ Cách Chạy Server (Hiện Tại)

Backend hiện tại được cấu hình để:
✅ **Khởi động ngay cả khi MongoDB không kết nối** (Offline Mode)
✅ **Retry tự động 5 lần** với backoff exponential
✅ **Cung cấp thông tin chi tiết** về lỗi

### Chạy Server

```bash
cd backend
node server.js
```

**Khi thành công, sẽ thấy:**
```
✅ Mongoose connected to MongoDB
   Database: agrishare
```

**Nếu lỗi nhưng server vẫn chạy:**
```
⚠️  Starting server in OFFLINE MODE (no database)
```

### Test Server

```bash
# Health check
curl http://localhost:5000/health

# Response
{
  "success": true,
  "message": "Server is running",
  "database": "disconnected (offline mode)"
}
```

---

## 🔧 Giải Pháp Tạm Thời

### Option 1: Dùng Local MongoDB

Cài MongoDB Community Edition trên máy:

**Windows:**
```powershell
# Download MongoDB (https://www.mongodb.com/try/download/community)
# Hoặc dùng Chocolatey
choco install mongodb-community

# Start MongoDB service
net start MongoDB
```

**Cập nhật .env:**
```env
MONGODB_URI=mongodb://localhost:27017/agrishare
```

### Option 2: MongoDB Local (Docker)

```bash
# Chạy MongoDB trong Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Cập nhật .env
MONGODB_URI=mongodb://localhost:27017/agrishare
```

### Option 3: MongoDB Atlas (Online)

**Các bước:**
1. Đăng nhập https://cloud.mongodb.com/
2. Tạo Cluster mới (Free tier)
3. Tạo Database User
4. Thêm IP whitelist (0.0.0.0/0)
5. Copy connection string
6. Cập nhật .env

---

## 📋 Kiểm Tra Danh Sách

- [ ] Kiểm tra file .env có MONGODB_URI không
- [ ] Test `ping cluster0.bjcva1u.mongodb.net`
- [ ] Kiểm tra MongoDB Atlas IP whitelist
- [ ] Tắt VPN/Firewall tạm thời test
- [ ] Kiểm tra internet connection
- [ ] Restart terminal và chạy lại

---

## 🚀 Khi MongoDB Kết Nối Được

```bash
# Tạo dữ liệu mẫu
npm run seed

# Output
✅ Created 4 users
✅ Created 3 projects
✨ Database seeding completed successfully!
```

**Sample Credentials:**
```
farmer1@agrishare.com / password123
investor1@agrishare.com / password123
auditor@agrishare.com / password123
admin@agrishare.com / admin123
```

---

## 📞 Support

Nếu vẫn không kết nối được:

1. **Kiểm tra Chi Tiết:**
   - Verify username/password (truong/truong)
   - Check MongoDB Atlas cluster status
   - Verify connection string format

2. **Tìm Logs:**
   ```bash
   # Xem chi tiết lỗi
   node server.js 2>&1 | Tee-Object -FilePath "error.log"
   ```

3. **Tạo Cluster Mới (MongoDB Atlas):**
   - https://cloud.mongodb.com/
   - Create Project → Create Cluster
   - Choose Free tier (M0)
   - Wait 10 minutes for cluster to be ready
   - Copy connection string
   - Update .env

---

## 💡 Lưu Ý

✅ **Server sẽ khởi động** dù MongoDB chưa kết nối
✅ **Tất cả API endpoints** sẽ trả về error về database
✅ **Có thể test API structure** mà không cần database
✅ **Khi MongoDB sẵn sàng**, chỉ cần restart server

---

**Happy coding!** 🎉
