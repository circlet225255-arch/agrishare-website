# AgriShare Website

Đây là bộ code website tĩnh cho ý tưởng AgriShare, được xây từ nội dung trong ảnh concept và các chỉnh sửa nhận diện thương hiệu.

## Nội dung chính

- Marketplace dự án đầu tư nông nghiệp.
- Dashboard theo dõi danh mục.
- Công cụ tính dòng tiền mẫu.
- Nội dung cho nông dân, nhà đầu tư và ban quản trị.
- Khung quản trị rủi ro: escrow, QA/QC, truy xuất, bảo hiểm.
- Logo, bảng màu và ảnh hero homepage theo nhận diện AgriShare.

## Cách chạy

Mở trực tiếp file `index.html` trong trình duyệt.

Nếu muốn chạy bằng local server:

```bash
python3 -m http.server 5173
```

Sau đó mở:

```text
http://localhost:5173
```

## Cấu trúc

```text
.
├── Agrishare.md
├── README.md
├── app.js
├── index.html
├── styles.css
└── assets/
```

## File tổng hợp project

Toàn bộ thông tin project, danh sách dự án, bảng màu, asset và hướng nâng cấp nằm trong `Agrishare.md`.

## Hướng nâng cấp thành sản phẩm thật

- Thay mảng `projects` trong `app.js` bằng API backend.
- Thêm đăng nhập theo vai trò: nhà đầu tư, nông dân, admin, QA/QC.
- Lưu nhật ký sản xuất, hợp đồng, giao dịch và báo cáo vào database.
- Tích hợp thanh toán/escrow, eKYC và chữ ký điện tử.
- Thêm trang quản trị để duyệt dự án, kiểm soát rủi ro và xuất báo cáo.
