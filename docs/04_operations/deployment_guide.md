# 🚢 Deployment Guide - Hướng dẫn Triển khai & Vận hành Thực tế

Tài liệu này hướng dẫn chi tiết cách đóng gói container hóa ứng dụng Backend Điện Máy Trần Điền bằng Docker và cách triển khai an toàn lên môi trường sản xuất (Production).

## 🐳 1. Đóng gói Container hóa bằng Docker

Sử dụng Docker giúp ứng dụng chạy độc lập, đồng nhất trên bất kỳ môi trường máy chủ Linux VPS (như Ubuntu, Debian) nào mà không lo xung đột thư viện hay lỗi môi trường điều hành.

### File cấu hình `Dockerfile` đa giai đoạn (Multi-stage Build) tối ưu
Tạo một file có tên `Dockerfile` tại thư mục gốc của Backend (`Backend/Dockerfile`):

```dockerfile
# Giai đoạn 1: Biên dịch và cài đặt Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Sao chép tệp cấu hình package
COPY package*.json ./
RUN npm ci

# Sao chép toàn bộ mã nguồn và biên dịch TypeScript sang Javascript
COPY . .
RUN npm run build

# Giai đoạn 2: Khởi chạy môi trường Production tối giản
FROM node:20-alpine AS runner
WORKDIR /app

# Chỉ sao chép các tệp thực thi tối thiểu để giảm dung lượng Image xuống dưới 100MB
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Thiết lập biến môi trường mặc định
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

# Khởi chạy máy chủ API
CMD ["node", "dist/index.js"]
```

### Cách thức build và khởi chạy Docker Image cục bộ:
```bash
# Build Docker Image với thẻ tên 'dien-may-tran-dien-backend'
docker build -t dien-may-tran-dien-backend .

# Khởi chạy Container từ Image vừa build kết hợp truyền file biến môi trường
docker run -d -p 3001:3001 --env-file .env dien-may-tran-dien-backend
```

---

## ☁️ 2. Triển khai lên các Nền tảng Đám mây (Render, Railway)

Nếu không sử dụng máy chủ VPS riêng, bạn có thể dễ dàng triển khai nhanh chóng lên các PaaS đám mây hiện đại hỗ trợ Node.js trực tiếp từ kho lưu trữ GitHub của bạn:

### Các bước triển khai trên Render:
1.  **Đăng nhập**: Truy cập vào trang quản trị [Render Dashboard](https://dashboard.render.com/) và kết nối với tài khoản GitHub của bạn.
2.  **Tạo dịch vụ mới**: Chọn **New +** > **Web Service**.
3.  **Kết nối kho lưu trữ**: Chọn kho lưu trữ chứa dự án Điện Máy Trần Điền của bạn.
4.  **Cấu hình thông số**:
    *   **Root Directory**: `Backend` (Rất quan trọng, để báo cho Render biết thư mục chứa dự án Backend).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install && npm run build`.
    *   **Start Command**: `node dist/index.js`.
5.  **Cấu hình biến môi trường (Environment Variables)**:
    *   Thêm biến `PORT`: `3001`.
    *   Thêm biến `NODE_ENV`: `production`.
    *   Thêm biến `DATABASE_URL`: `postgresql://...` (Chuỗi Pooler kết nối tới Supabase).
6.  **Deploy**: Nhấn **Create Web Service** để Render tự động build và cung cấp địa chỉ API công khai trực tuyến dạng `https://dien-may-tran-dien.onrender.com`!
