# Hồ Sơ Project AgriShare

## Vị Trí Project

Đường dẫn Windows:

```text
C:\Users\ADMIN\Documents\Codex\2026-05-26\files-mentioned-by-the-user-z7867761357717
```

Đường dẫn trong Codex/WSL:

```text
/mnt/c/Users/ADMIN/Documents/Codex/2026-05-26/files-mentioned-by-the-user-z7867761357717
```

File mở website:

```text
index.html
```

## Mục Tiêu Website

AgriShare là website nền tảng đầu tư nông nghiệp minh bạch, kết nối nông dân, nhà đầu tư, người tiêu dùng, đơn vị kiểm định và cộng đồng. Website hiện đang là bản frontend tĩnh, có thể mở trực tiếp bằng trình duyệt và tiếp tục nâng cấp thành sản phẩm vận hành thật bằng backend/API.

## Bộ Nhận Diện Hiện Tại

Logo và hình ảnh nhận diện:

- `assets/agrishare-emblem.png`: biểu tượng logo sắc nét dùng trên website.
- `assets/agrishare-logo-icon.png`: icon/favicon.
- `assets/agrishare-brand-sheet.png`: ảnh bảng logo và màu gốc.
- `assets/agrishare-hero-platform.png`: ảnh hero homepage mới.

Bảng màu:

- Xanh lá chính: `#4CAF50`
- Xanh lá đậm: `#388E3C`
- Nâu đất: `#8B5A2B`
- Cam vàng: `#F5A623`
- Be sáng: `#F7F3E9`
- Xanh lá nhạt: `#E8F5E9`

## Cấu Trúc File

```text
.
├── Agrishare.md
├── README.md
├── app.js
├── index.html
├── styles.css
└── assets/
    ├── agrishare-brand-sheet.png
    ├── agrishare-concept-01.jpg
    ├── agrishare-concept-02.jpg
    ├── agrishare-concept-03.jpg
    ├── agrishare-emblem.png
    ├── agrishare-hero-platform.png
    ├── agrishare-logo-horizontal.png
    ├── agrishare-logo-icon.png
    └── agrishare-logo-large.png
```

## Các Module Website Đã Có

- Header với logo AgriShare chuẩn hóa bằng biểu tượng ảnh và chữ CSS sắc nét.
- Homepage hero với ảnh minh họa nông nghiệp số và dashboard đầu tư.
- Thanh đối tác hệ sinh thái.
- Mô hình vận hành 4 bước.
- Marketplace dự án đầu tư.
- Bộ lọc dự án theo nhóm.
- Popup hồ sơ chi tiết dự án.
- Máy tính lợi nhuận đầu tư mẫu.
- Dashboard danh mục đầu tư.
- Khu vực dành cho nông dân và hợp tác xã.
- Quản trị rủi ro: escrow, QA/QC, cảnh báo sản xuất, bảo hiểm.
- Lộ trình mở rộng theo giai đoạn.

## Mô Hình Marketplace Đầu Tư

### Front End

Luồng khách hàng trên giao diện:

1. Khách hàng chọn sản phẩm/dự án trong Marketplace.
2. Khách hàng bấm `Lựa chọn gói đầu tư`.
3. Popup hiển thị 4 lựa chọn:
   - Gói 1: 10 triệu
   - Gói 2: 20 triệu
   - Gói 3: 50 triệu
   - Khác: tùy chọn đầu tư của khách hàng
4. Sau khi chọn gói, hệ thống hiển thị giá trị sản phẩm nhận lại:
   - Sản lượng/sản phẩm nhận lại theo từng gói.
   - Nhật ký mùa vụ và tiến độ thu hoạch.
   - Thông tin kiểm soát chất lượng và truy xuất lô sản xuất.
   - Quyền trải nghiệm farm nếu khách hàng chọn nhận tại farm.
5. Khách hàng chọn một trong hai hình thức nhận sản phẩm:
   - Nhận hàng tại nhà.
   - Trải nghiệm và nhận sản phẩm tại Farm của nhà nông.

### Back End

Các API nên có khi nâng cấp thành sản phẩm thật:

- `GET /products`: lấy danh sách sản phẩm/dự án.
- `GET /products/:id`: lấy chi tiết sản phẩm/dự án.
- `GET /products/:id/packages`: lấy danh sách gói đầu tư.
- `POST /investment-orders`: tạo đơn đầu tư sau khi khách hàng chọn gói.
- `POST /investment-orders/:id/fulfillment`: lưu hình thức nhận hàng hoặc trải nghiệm farm.
- `GET /investment-orders/:id/rewards`: hiển thị quyền lợi, sản phẩm nhận lại và lịch giao.
- `GET /investment-orders/:id/farm-updates`: lấy nhật ký mùa vụ, hình ảnh, chất lượng và mốc thu hoạch.

Các xử lý chính:

- Tính sản phẩm nhận lại theo số tiền đầu tư.
- Ghi nhận gói đầu tư, số tiền, sản phẩm, hình thức nhận.
- Tạo lịch giao hàng hoặc lịch trải nghiệm farm.
- Lưu trạng thái đơn đầu tư: mới tạo, đã xác nhận, đang mùa vụ, sẵn sàng giao, đã hoàn tất.
- Liên kết dữ liệu mùa vụ, kiểm định chất lượng và truy xuất nguồn gốc.

### Database

Các bảng dữ liệu đề xuất:

- `users`: thông tin khách hàng, nông dân, admin.
- `products`: sản phẩm/dự án đầu tư như bưởi da xanh, gạo, mật ong dú, sữa chua.
- `farms`: thông tin farm, nhà nông, vị trí, chứng nhận.
- `investment_packages`: gói 10 triệu, 20 triệu, 50 triệu và gói tùy chọn.
- `investment_orders`: đơn đầu tư của khách hàng.
- `reward_rules`: quy tắc quy đổi sản phẩm nhận lại theo từng gói.
- `fulfillment_options`: nhận hàng tại nhà hoặc trải nghiệm và nhận tại farm.
- `shipments`: lịch giao hàng, trạng thái giao, địa chỉ nhận.
- `farm_visits`: lịch trải nghiệm farm, số người tham gia, trạng thái xác nhận.
- `season_updates`: nhật ký mùa vụ, hình ảnh, tiến độ, chất lượng.
- `quality_checks`: kiểm định chất lượng, phân loại sản phẩm, truy xuất lô.

## Danh Sách Dự Án Trong Website

### 1. Vườn xoài Hòa Lộc An Giang

- Nhóm: Cây ăn trái
- Địa điểm: An Giang
- Vốn cần gọi: 320.000.000 VND
- Đã tài trợ: 72%
- Thời gian: 9 tháng
- Lợi nhuận dự kiến: 12-16%
- Rủi ro: Trung bình
- Tags: Camera, GPS, Escrow
- Mô tả: Tái canh tác 4ha xoài Hòa Lộc, tiêu chuẩn VietGAP, thu hoạch theo hợp đồng bán sỉ và kênh quà tặng doanh nghiệp.

### 2. Nhà kính rau sạch Đà Lạt

- Nhóm: Rau sạch
- Địa điểm: Lâm Đồng
- Vốn cần gọi: 180.000.000 VND
- Đã tài trợ: 58%
- Thời gian: 6 tháng
- Lợi nhuận dự kiến: 8-12%
- Rủi ro: Thấp
- Tags: Nhà kính, QA/QC, Nhật ký
- Mô tả: Mở rộng nhà kính rau ăn lá, có cảm biến độ ẩm, lịch giao hàng hằng tuần cho nhà hàng và người dùng thành thị.

### 3. Farmstay vườn trái cây Bến Tre

- Nhóm: Farmstay
- Địa điểm: Bến Tre
- Vốn cần gọi: 520.000.000 VND
- Đã tài trợ: 31%
- Thời gian: 12 tháng
- Lợi nhuận dự kiến: 14-20%
- Rủi ro: Cao
- Tags: Du lịch, Nông sản, Cộng đồng
- Mô tả: Kết hợp đầu tư vườn dừa, trái cây theo mùa và trải nghiệm lưu trú cuối tuần cho gia đình, doanh nghiệp.

### 4. Vườn bưởi hữu cơ miền Tây

- Nhóm: Cây ăn trái
- Địa điểm: Vĩnh Long
- Vốn cần gọi: 260.000.000 VND
- Đã tài trợ: 84%
- Thời gian: 8 tháng
- Lợi nhuận dự kiến: 10-14%
- Rủi ro: Trung bình
- Tags: Hữu cơ, Truy xuất, Bảo hiểm
- Mô tả: Đầu tư chăm sóc vườn bưởi đã vào giai đoạn cho trái, sản lượng dự kiến được bao tiêu một phần.

### 5. Tổ hợp tác rau thủy canh

- Nhóm: Rau sạch
- Địa điểm: Đồng Nai
- Vốn cần gọi: 140.000.000 VND
- Đã tài trợ: 65%
- Thời gian: 5 tháng
- Lợi nhuận dự kiến: 7-11%
- Rủi ro: Thấp
- Tags: Thủy canh, Bán lẻ, Đơn hàng
- Mô tả: Tài trợ vật tư và mở rộng kênh bán lẻ cho tổ hợp tác rau thủy canh gần khu đô thị.

### 6. Trang trại giáo dục trẻ em

- Nhóm: Farmstay
- Địa điểm: Củ Chi
- Vốn cần gọi: 390.000.000 VND
- Đã tài trợ: 46%
- Thời gian: 10 tháng
- Lợi nhuận dự kiến: 11-17%
- Rủi ro: Trung bình
- Tags: Giáo dục, Trải nghiệm, CSR
- Mô tả: Xây dựng khu trải nghiệm nông nghiệp cho trường học, kết hợp bán nông sản và gói CSR doanh nghiệp.

## Cách Mở Website

Mở trực tiếp:

```text
C:\Users\ADMIN\Documents\Codex\2026-05-26\files-mentioned-by-the-user-z7867761357717\index.html
```

Hoặc chạy local server trong thư mục project:

```bash
python3 -m http.server 5173
```

Sau đó mở:

```text
http://localhost:5173
```

## Hướng Nâng Cấp Tiếp Theo

- Dữ liệu Marketplace hiện đã có thể đọc từ MongoDB qua backend `GET /api/v1/projects/marketplace`.
- Tạo trang chi tiết dự án riêng thay vì chỉ dùng popup.
- Thêm hệ thống đăng nhập theo vai trò: nhà đầu tư, nông dân, admin, QA/QC.
- Thêm dashboard thật cho dòng tiền, tiến độ, nhật ký sản xuất và hợp đồng.
- Tích hợp thanh toán/escrow, eKYC và chữ ký điện tử.
- Thêm trang quản trị để duyệt dự án, kiểm soát rủi ro và xuất báo cáo.
