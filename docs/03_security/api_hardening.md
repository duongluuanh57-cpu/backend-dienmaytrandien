# 🧱 API Hardening - Gia cố Bảo mật Hệ thống API

Tài liệu này đặc tả các cấu hình bảo mật nâng cao nhằm bảo vệ máy chủ Hono API của Điện Máy Trần Điền khỏi các nguy cơ lạm dụng tài nguyên, tấn công mạng phổ biến (OWASP Top 10) và spam tin nhắn.

## 🔒 1. Chia sẻ Tài nguyên Nguồn gốc Chéo (CORS Hardening)

Cấu hình CORS nghiêm ngặt giúp ngăn chặn các trang web lạ bên ngoài thực hiện gọi API trái phép tới máy chủ Backend của bạn.

### Cấu hình triển khai trong [src/index.ts](file:///c:/Users/dandi/OneDrive/Desktop/Untitled Export/50226/Backend/src/index.ts)
```typescript
import { cors } from "hono/cors";

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://dienmaytrandien.com"], // Chỉ cho phép domain chính thức của Frontend kết nối
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
```

---

## 🛡️ 2. Tiêu đề Bảo mật (Secure Headers Middleware)

Kích hoạt các tiêu đề bảo mật HTTP chuẩn hóa để hướng dẫn trình duyệt kích hoạt các lớp bảo vệ chống lại các hình thức tấn công XSS, nhúng Clickjacking...

### Cấu hình triển khai trong [src/index.ts](file:///c:/Users/dandi/OneDrive/Desktop/Untitled Export/50226/Backend/src/index.ts)
```typescript
import { secureHeaders } from "hono/secure-headers";

// Áp dụng bộ tiêu đề bảo mật nâng cao cho toàn bộ ứng dụng
app.use("*", secureHeaders());
```

---

## ⏳ 3. Giới hạn tần suất gọi API (Rate Limiting)

Rate Limiting đặc biệt quan trọng để bảo vệ endpoint `/api/contact` khỏi các cuộc tấn công spam bằng bot tự động, gửi hàng loạt yêu cầu rác làm ngập lụt database của bạn.

### Đề xuất cấu hình Rate Limiter cho Hono
Sử dụng các thư viện rate limiter nhẹ cho Hono để chặn bot spam:
```typescript
import { rateLimiter } from "hono-rate-limiter";

const contactLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // Chu kỳ 15 phút
  limit: 5, // Mỗi IP chỉ được phép gửi tối đa 5 yêu cầu liên hệ tư vấn trong 15 phút
  message: { success: false, message: "Bạn đã gửi quá nhiều yêu cầu tư vấn. Vui lòng thử lại sau 15 phút!" },
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") || "anonymous", // Nhận diện IP đằng sau proxy/Cloudflare
});

// Chỉ áp dụng riêng cho endpoint nhận liên hệ tư vấn
app.use("/api/contact", contactLimiter);
```

---

## 🚫 4. Định dạng phản hồi Lỗi chuẩn hóa JSON (JSON-only Errors)

Để tránh việc kẻ xấu khai thác thông tin từ các trang lỗi HTML mặc định của hệ thống khi server gặp lỗi, hoặc tiết lộ cấu trúc mã nguồn thông qua Stack Trace:

### Cấu hình xử lý lỗi toàn cục trong [src/index.ts](file:///c:/Users/dandi/OneDrive/Desktop/Untitled Export/50226/Backend/src/index.ts)
```typescript
app.onError((err, c) => {
  console.error("🔥 Server Error:", err);
  
  return c.json(
    {
      success: false,
      message: "Đã xảy ra lỗi nghiêm trọng từ máy chủ. Vui lòng liên hệ quản trị viên!",
      // Chỉ tiết lộ lỗi chi tiết trong môi trường phát triển cục bộ (Development)
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "API Endpoint không tồn tại hoặc đã bị thay đổi!",
    },
    404
  );
});
```
