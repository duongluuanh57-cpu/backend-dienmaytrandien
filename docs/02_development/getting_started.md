# 🚀 Getting Started - Hướng dẫn Cài đặt & Phát triển Backend

Tài liệu này hướng dẫn chi tiết cách cài đặt môi trường phát triển cục bộ (Local Development), cấu hình các biến môi trường và chạy dự án Backend Điện Máy Trần Điền thành công.

## 📋 Yêu cầu hệ thống trước khi cài đặt
*   **Runtime**: [Node.js](https://nodejs.org/) (v18 trở lên) hoặc [Bun](https://bun.sh/) (Khuyên dùng để tối ưu hiệu năng tối đa).
*   **Database**: Tài khoản [Supabase](https://supabase.com/) đã có dự án được khởi tạo.

---

## 🛠️ Quy trình cài đặt 4 bước nhanh gọn

### Bước 1: Clone dự án và di chuyển vào thư mục Backend
```bash
cd Backend
```

### Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)
Sử dụng npm:
```bash
npm install
```
Hoặc sử dụng Bun (tốc độ cài đặt nhanh gấp nhiều lần):
```bash
bun install
```

### Bước 3: Cấu hình biến môi trường
Tạo một file có tên `.env` tại thư mục gốc của Backend (`Backend/.env`) và cấu hình các biến môi trường cần thiết:
```env
PORT=3001
NODE_ENV=development

# URL kết nối cơ sở dữ liệu Supabase của bạn
# Sử dụng cổng 6543 (Pooler) cho chạy ứng dụng, cổng 5432 (Direct) cho Migration
DATABASE_URL="postgresql://postgres.assitagvsrtdaazwfugl:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
```

> [!IMPORTANT]
> Tuyệt đối không bao giờ được `push` file `.env` lên GitHub công khai để tránh bị đánh cắp mật khẩu database và các khóa bảo mật quan trọng khác. File `.env` đã được cấu hình trong `.gitignore` để tự động bỏ qua.

### Bước 4: Khởi động máy chủ phát triển cục bộ (Local Server)
Chạy lệnh sau để khởi động Hono API Server ở chế độ hot-reload (tự động nhận thay đổi khi sửa file):
```bash
npm run dev
```
Server sẽ chạy thành công tại địa chỉ: `http://localhost:3001` 🚀.

---

## 🧪 Chạy kiểm thử đơn vị & tích hợp (Testing Suite)
Dự án tích hợp sẵn framework **Vitest** để chạy kiểm thử siêu tốc. 

### Chạy kiểm thử một lần duy nhất:
```bash
npm run test
```

### Chạy kiểm thử ở chế độ theo dõi (Watch Mode - Tự động chạy lại khi sửa file):
```bash
npx vitest
```
Toàn bộ các test cases tại thư mục `Testing_Backend/` sẽ được thực thi để đảm bảo tính ổn định và toàn vẹn của mã nguồn.
