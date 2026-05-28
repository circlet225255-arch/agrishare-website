# AgriShare Website

Đây là bộ code website AgriShare gồm frontend, backend API và MongoDB. Website không còn chỉ là trang tĩnh: khách hàng có thể chọn dự án, chọn gói đầu tư, nhập thông tin, chọn hình thức nhận sản phẩm và gửi đơn về database.

## Nội dung chính

- Marketplace dự án đầu tư nông nghiệp.
- Dashboard theo dõi danh mục.
- Công cụ tính dòng tiền mẫu.
- Nội dung cho nông dân, nhà đầu tư và ban quản trị.
- Khung quản trị rủi ro: escrow, QA/QC, truy xuất, bảo hiểm.
- Logo, bảng màu và ảnh hero homepage theo nhận diện AgriShare.
- Form đặt đầu tư thật, lưu khách hàng và đơn đầu tư vào MongoDB.
- API checkout để ghi nhận đơn, tra cứu mã đơn và phục vụ trang quản trị.
- Trang `admin.html` để đăng nhập admin, xem danh sách đơn, tìm kiếm, lọc trạng thái, xuất CSV, cập nhật trạng thái/thanh toán và xem chi tiết từng đơn.
- Trang `track-order.html` để khách hàng tra cứu tiến độ đơn bằng mã đơn.
- Trang `project-detail.html` cho hồ sơ dự án/farm, quyền lợi gói đầu tư, rủi ro và nhật ký mùa vụ.
- Trang `thank-you.html` sau khi đặt đơn để hướng dẫn thanh toán và gửi biên lai.
- Trang `legal.html` cho điều khoản, bảo mật dữ liệu, hoàn/hủy và cảnh báo rủi ro.

## Cách chạy

Để website vận hành đầy đủ, chạy backend trước rồi mở frontend.

Frontend đọc địa chỉ API từ file `config.js`. Khi chạy local, file này đang trỏ về:

```text
http://localhost:5000/api/v1
```

Khi deploy thật, chỉ cần đổi `API_BASE_URL` trong `config.js` sang API online. Có file mẫu `config.production.example.js` để đối chiếu.

### 1. Chạy backend MongoDB

Backend nằm trong thư mục `backend/`.

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```

Server chạy tại:

```text
http://localhost:5000
```

### 2. Mở frontend

Mở trực tiếp file `index.html` trong trình duyệt, hoặc dùng local server:

Nếu muốn chạy frontend bằng local server:

```bash
python3 -m http.server 5173
```

Sau đó mở:

```text
http://localhost:5173
```

API Marketplace:

```text
http://localhost:5000/api/v1/projects/marketplace
```

API ghi nhận đơn đầu tư:

```text
POST http://localhost:5000/api/v1/checkout/investment-orders
```

API tra cứu đơn cho khách:

```text
GET http://localhost:5000/api/v1/checkout/orders/:orderCode
```

API admin cập nhật đơn:

```text
PATCH http://localhost:5000/api/v1/checkout/admin/orders/:id
```

API quản lý dự án/farm:

```text
GET /api/v1/projects
POST /api/v1/projects
PUT /api/v1/projects/:id
POST /api/v1/projects/:id/updates
GET /api/v1/projects/:id/updates
```

API CRM và analytics:

```text
GET /api/v1/checkout/admin/customers
PATCH /api/v1/checkout/admin/customers/:id
POST /api/v1/analytics/events
GET /api/v1/analytics/sales
```

Khi backend chạy, frontend sẽ tự đọc dữ liệu sản phẩm từ MongoDB và gửi đơn đầu tư về MongoDB. Nếu backend tắt, website vẫn dùng dữ liệu tĩnh trong `app.js`, nhưng không thể ghi nhận đơn thật.

## Mở trang quản trị đơn hàng

Sau khi backend chạy, mở file:

```text
C:\Users\ADMIN\Documents\Codex\2026-05-26\files-mentioned-by-the-user-z7867761357717\admin.html
```

Hoặc nếu đang dùng local server:

```text
http://localhost:5173/admin.html
```

Tài khoản admin mẫu được tạo bằng `npm run seed`:

```text
admin@agrishare.com
admin123
```

Trang admin sẽ gọi API:

```text
GET http://localhost:5000/api/v1/checkout/admin/orders
```

## Tra cứu đơn cho khách hàng

Sau khi khách gửi đơn đầu tư thành công, website hiển thị mã đơn và link tra cứu. Có thể mở trực tiếp:

```text
C:\Users\ADMIN\Documents\Codex\2026-05-26\files-mentioned-by-the-user-z7867761357717\track-order.html
```

Hoặc:

```text
http://localhost:5173/track-order.html
```

## Cấu trúc

```text
.
├── Agrishare.md
├── README.md
├── admin.css
├── admin.html
├── admin.js
├── app.js
├── backend/
├── index.html
├── legal.html
├── project-detail.css
├── project-detail.html
├── project-detail.js
├── thank-you.html
├── thank-you.js
├── track-order.css
├── track-order.html
├── track-order.js
├── styles.css
└── assets/
```

## File tổng hợp project

Toàn bộ thông tin project, danh sách dự án, bảng màu, asset và hướng nâng cấp nằm trong `Agrishare.md`.

## Deploy online

Hướng dẫn đưa website lên online để khách hàng đặt đơn thật nằm trong:

```text
DEPLOYMENT-GUIDE.md
```

Các file hỗ trợ deploy:

```text
config.js
config.production.example.js
backend/.env.production.example
render.yaml
netlify.toml
```

## Hướng nâng cấp tiếp theo

- Thêm đăng nhập theo vai trò: nhà đầu tư, nông dân, admin, QA/QC.
- Tích hợp thanh toán/escrow, eKYC và chữ ký điện tử.
- Thêm trang quản trị để duyệt dự án, kiểm soát rủi ro và xuất báo cáo.
