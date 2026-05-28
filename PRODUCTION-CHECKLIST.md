# AgriShare Production Checklist

## Thanh toán

- Cấu hình ngân hàng nhận tiền trong `admin.html` > `Cấu hình`.
- Nếu dùng VietQR, nhập đúng `bankCode` và `accountNumber`.
- Khách hàng có thể gửi mã giao dịch, link biên lai hoặc upload ảnh/PDF biên lai từ trang cảm ơn.
- Admin có thể upload chứng từ, xác nhận `paid` và mở biên nhận để in/lưu PDF.
- Khi dùng VNPAY/MoMo/ZaloPay, tạo tài khoản merchant và thêm endpoint callback riêng.
- Bổ sung quy trình hoàn tiền và đối soát hằng ngày.

## Giao hàng và farm visit

- Mỗi đơn cần có trạng thái giao hàng/farm visit trong admin.
- Cập nhật đơn vị vận chuyển, mã vận đơn, lịch giao hoặc lịch đến farm.
- Khi hoàn tất, chuyển trạng thái đơn sang `completed`.
- Farm/auditor có thể thêm nhật ký mùa vụ, chỉ số sinh trưởng và ảnh minh chứng trong tab `Dự án/Farm`.

## CRM sale

- Cập nhật trạng thái khách hàng sau mỗi lần tư vấn.
- Ghi chú lịch gọi lại trong hồ sơ khách.
- Phân quyền hiện có: admin, sale, farm, auditor. Nên tạo tài khoản thật và đổi mật khẩu seed trước khi vận hành.

## Pháp lý

- Hoàn thiện điều khoản, chính sách bảo mật, hoàn/hủy, rủi ro mùa vụ.
- Làm rõ mô hình giao dịch: đặt trước sản phẩm, hợp tác mùa vụ hay hình thức khác.
- Chuẩn bị thông báo website TMĐT bán hàng trên `online.gov.vn` khi vận hành công khai.

## Bảo mật và dữ liệu

- Chạy production bằng HTTPS.
- Đặt `CORS_ORIGIN` đúng domain thật, không dùng `*`.
- Đổi `JWT_SECRET` mạnh.
- Backup MongoDB Atlas định kỳ.
- Theo dõi tab `Nhật ký hệ thống` để kiểm tra thao tác sửa đơn, dự án, cấu hình, upload và đổi mật khẩu.
- Chuyển upload local `backend/uploads` sang cloud storage khi deploy nhiều server hoặc cần CDN.

## Deploy

- Frontend: Vercel, Netlify, Cloudflare Pages hoặc hosting tĩnh.
- Backend: Render, Railway, Fly.io, VPS hoặc cloud server.
- Database: MongoDB Atlas production cluster.
- Monitoring: uptime check, log lỗi, cảnh báo downtime.

## Marketing

- Cấu hình Google Analytics, Meta Pixel, TikTok Pixel trong admin.
- Đo các sự kiện: page view, xem chi tiết dự án, click chọn gói, gửi đơn, gửi biên lai.
- Theo dõi tỷ lệ từ đơn mới sang đã thanh toán.
