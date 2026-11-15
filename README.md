# Ticket Frontend (`ticketvue`)

## Giới thiệu dự án

**Ticket** là ứng dụng web mô phỏng nền tảng đặt vé và quản lý sự kiện trực tuyến, kết nối 3 nhóm người dùng chính trên cùng một hệ thống: **Khách hàng (Customer)**, **Ban tổ chức (Organizer)** và **Quản trị viên (Admin)**.

Repository này là phần **Frontend** được xây dựng bằng **Vue 3** và **Vite**, giao tiếp với backend Laravel qua REST API (`src/config/api.js`).

## Các chức năng chính

### 1. Dành cho Khách hàng (Customer)
- **Trang chủ & Khám phá sự kiện:** Hiển thị sự kiện xu hướng, sự kiện cuối tuần, cuối tháng, các địa điểm nổi bật và danh sách sự kiện theo từng danh mục.
- **Tìm kiếm & Lọc sự kiện:** Tìm theo từ khóa, lọc theo danh mục, địa điểm và khoảng thời gian.
- **Chi tiết sự kiện:** Xem thông tin ban tổ chức, mô tả sự kiện, các hạng vé/giá vé và đánh giá từ người tham gia.
- **Giỏ hàng & Thanh toán:** Thêm/cập nhật/xóa vé trong giỏ hàng (lưu trạng thái bằng Pinia), chọn vé thanh toán và tạo đơn hàng qua **PayOS** (hoặc xử lý trực tiếp với đơn vé miễn phí 0đ).
- **Quản lý cá nhân:** Xem danh sách đơn hàng, vé đã mua (kèm mã QR), cập nhật thông tin tài khoản, đổi mật khẩu, gửi đánh giá và báo cáo sự kiện.
- **Xác thực tài khoản:** Đăng ký (kèm xác thực mã qua email), đăng nhập, đăng nhập nhanh bằng Google và quên/đặt lại mật khẩu.

### 2. Dành cho Ban tổ chức (Organizer)
- **Tạo sự kiện nhiều bước:** Nhập thông tin cơ bản & trình soạn thảo mô tả (`TinyMCE`), thiết lập thời gian & hạng vé, thông tin thanh toán và điều khoản pháp lý.
- **Quản lý sự kiện của tôi:** Theo dõi trạng thái duyệt, tìm kiếm và lọc danh sách sự kiện đã tạo.

### 3. Dành cho Quản trị viên (Admin)
- **Dashboard thống kê:** Theo dõi số liệu tổng quan và biểu đồ doanh thu (`Chart.js`).
- **Kiểm duyệt sự kiện:** Xem chi tiết hồ sơ sự kiện đang chờ và thực hiện duyệt hoặc từ chối.
- **Quản lý vận hành:** Theo dõi đơn hàng đã thanh toán, danh sách ban tổ chức, kiểm duyệt đánh giá và xử lý báo cáo từ người dùng.

## Công nghệ sử dụng

- **Core:** Vue 3 (`<script setup>`), Vite 7, Vue Router 4, Pinia
- **Giao diện:** Tailwind CSS v4 (`@tailwindcss/cli`), Boxicons, Font Awesome, SweetAlert2
- **Tiện ích & Tích hợp:** Axios, Chart.js (`vue-chartjs`), TinyMCE (`@tinymce/tinymce-vue`), `@vuepic/vue-datepicker`, Firebase, `vue3-google-login`

## Cấu trúc thư mục chính

```text
ticketvue/
├── src/
│   ├── assets/          # CSS (input.css, output.css, admin.css)
│   ├── components/      # Component dùng chung (common, auth, customers, organizers, admin)
│   ├── config/          # Cấu hình Axios & API URL (api.js, const.js)
│   ├── router/          # Định tuyến & authGuard
│   ├── stores/          # Pinia stores (auth, cart)
│   └── views/           # Các trang theo vai trò (customer, organizer, admin)
├── .env.example         # Biến môi trường mẫu (Firebase)
└── package.json
```

---

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu môi trường
- **Node.js:** `^20.19.0` hoặc `>= 22.12.0`
- Backend `ticket_backend` đã được khởi chạy (mặc định tại `http://127.0.0.1:8000`)

### Các bước thực hiện

1. **Cài đặt dependencies:**
   ```sh
   cd ticketvue
   npm install
   ```

2. **Cấu hình biến môi trường:**
   - Sao chép `.env.example` thành `.env`:
     ```sh
     cp .env.example .env
     ```
   - Điền các biến cấu hình Firebase (`VITE_FIREBASE_*`) nếu sử dụng tính năng Firebase trên frontend.
   - *(Tùy chọn)* Nếu backend chạy ở địa chỉ khác `http://127.0.0.1:8000`, thêm biến sau vào `.env`:
     ```env
     VITE_API_BASE_URL=http://127.0.0.1:8000
     ```

3. **Chạy môi trường phát triển (Development):**
   ```sh
   npm run dev
   ```
   Lệnh này chạy song song `tailwindcss --watch` (biên dịch `src/assets/input.css` ra `src/assets/output.css`) và `vite` dev server.

4. **Build cho môi trường Production:**
   ```sh
   npm run build
   ```
   Hoặc xem trước bản build bằng:
   ```sh
   npm run preview
   ```
