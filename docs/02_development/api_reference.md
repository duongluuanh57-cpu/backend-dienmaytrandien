# 🔌 API Reference - Chi tiết các API Endpoints & Quy trình Mở rộng

Tài liệu này đặc tả chi tiết các phân hệ API hiện có, cấu trúc định dạng dữ liệu gửi lên/trả về và quy trình chuẩn hóa gồm 4 bước để thêm mới một API Endpoint vào hệ thống.

## 📡 Danh sách API Endpoints Hiện có

Tất cả các API được bảo mật bằng tiêu đề bảo mật và hỗ trợ chia sẻ tài nguyên nguồn gốc chéo (CORS) tới tên miền Frontend chính thức.

---

### 1. Phân hệ Sản phẩm (`/api/products`)

#### 📥 Lấy danh sách sản phẩm thiết bị
*   **Phương thức**: `GET`
*   **Endpoint**: `/api/products`
*   **Mô tả**: Trả về toàn bộ danh sách thiết bị máy lạnh (Nagakawa, Panasonic), máy bơm nước ngưng Kingpump, quạt chắn gió có trong cơ sở dữ liệu.
*   **Phản hồi thành công (`200 OK`)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "name": "Máy Bơm Nước Ngưng Kingpump Hippo 9M",
          "description": "Máy bơm nước ngưng công suất lớn chuyên dùng cho điều hòa tủ đứng...",
          "price": 1350000,
          "brand": "Kingpump",
          "type": "Máy bơm",
          "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
          "isAvailable": true,
          "createdAt": "2026-05-07T06:21:03Z"
        }
      ]
    }
    ```

#### 📤 Thêm mới một sản phẩm thiết bị
*   **Phương thức**: `POST`
*   **Endpoint**: `/api/products`
*   **Xác thực đầu vào**: Được kiểm duyệt bởi Zod Schema (`productSchema`).
*   **Định dạng yêu cầu (Request Body)**:
    ```json
    {
      "name": "Máy Lạnh Âm Trần Panasonic Inverter 2.0 HP",
      "description": "Điều hòa âm trần cassette luồng gió 360 độ thế mới...",
      "price": 18500000,
      "brand": "Panasonic",
      "type": "Âm trần",
      "image": "https://images.unsplash.com/photo-1563720223185-11003d516935",
      "isAvailable": true
    }
    ```
*   **Phản hồi thành công (`201 Created`)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "name": "Máy Lạnh Âm Trần Panasonic Inverter 2.0 HP",
        "price": 18500000,
        "brand": "Panasonic",
        "type": "Âm trần",
        "image": "https://images.unsplash.com/photo-1563720223185-11003d516935",
        "isAvailable": true,
        "createdAt": "2026-05-07T13:21:00Z"
      }
    }
    ```

---

### 2. Phân hệ Dự án - Công trình (`/api/projects`)

#### 📥 Lấy danh sách công trình thực tế
*   **Phương thức**: `GET`
*   **Endpoint**: `/api/projects`
*   **Mô tả**: Trả về danh sách các dự án thực tế lắp đặt hệ thống làm mát đã hoàn thiện để hiển thị tại trang danh mục dự án.
*   **Phản hồi thành công (`200 OK`)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "Thi Công Hệ Thống Máy Lạnh Trung Tâm VRV Daikin",
          "description": "Cung cấp và lắp đặt hệ thống máy lạnh trung tâm VRV Daikin công suất lớn...",
          "location": "Quận Tân Bình, TP.HCM",
          "year": 2025,
          "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
          "createdAt": "2026-05-07T06:21:03Z"
        }
      ]
    }
    ```

---

### 3. Phân hệ Nhận Liên hệ Tư vấn (`/api/contact`)

#### 📤 Khách hàng gửi yêu cầu liên hệ tư vấn
*   **Phương thức**: `POST`
*   **Endpoint**: `/api/contact`
*   **Mô tả**: Tiếp nhận biểu mẫu tư vấn (Họ tên, Email, Số điện thoại, Lời nhắn) từ trang chủ, tự động lưu trữ vào cơ sở dữ liệu.
*   **Xác thực đầu vào**: Được kiểm duyệt nghiêm ngặt bởi Zod Schema (`contactSchema`).
*   **Định dạng yêu cầu (Request Body)**:
    ```json
    {
      "name": "Nguyễn Văn A",
      "email": "vana@example.com",
      "phone": "0901234567",
      "message": "Tôi cần tư vấn lắp đặt 3 bộ máy lạnh âm trần Panasonic cho văn phòng mới."
    }
    ```
*   **Phản hồi thành công (`201 Created`)**:
    ```json
    {
      "success": true,
      "message": "Gửi liên hệ thành công!",
      "data": {
        "id": 12,
        "name": "Nguyễn Văn A",
        "email": "vana@example.com",
        "phone": "0901234567",
        "message": "Tôi cần tư vấn lắp đặt...",
        "createdAt": "2026-05-07T13:23:04Z"
      }
    }
    ```

---

## 🛠️ Quy Trình Thêm Mới Một API Endpoint Chuẩn Hóa

Khi bạn cần tạo thêm một API mới (ví dụ: API Quản lý Tin tức), hãy tuân thủ quy trình 4 bước đồng bộ sau:

### Bước 1: Khai báo Zod Schema xác thực dữ liệu đầu vào
Tạo file định nghĩa Schema mới tại thư mục `src/schemas/` (hoặc sửa file tập trung `src/schemas/index.ts`):
```typescript
import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(5, "Tiêu đề tối thiểu phải có 5 ký tự"),
  content: z.string().min(50, "Nội dung bài viết tối thiểu có 50 ký tự"),
  author: z.string().min(2, "Tên tác giả tối thiểu có 2 ký tự"),
  imageUrl: z.string().url("Đường dẫn ảnh phải là một URL hợp lệ").optional()
});
```

### Bước 2: Tạo Router con độc lập
Tạo file route con mới tại thư mục `src/routes/` (Ví dụ: `src/routes/article.routes.ts`):
```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { articles } from "../db/schema.js"; // Bảng được định nghĩa trong schema.ts
import { articleSchema } from "../schemas/index.js";

const router = new Hono();

// GET /api/articles
router.get("/", async (c) => {
  try {
    const results = await db.select().from(articles);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Query articles failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve articles" }, 500);
  }
});

// POST /api/articles
router.post("/", zValidator("json", articleSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const [inserted] = await db.insert(articles).values(data).returning();
    return c.json({ success: true, data: inserted }, 201);
  } catch (error) {
    console.error("❌ Insert article failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to create article" }, 500);
  }
});

export default router;
```

### Bước 3: Mount Router con vào Router chính
Mở file khởi chạy máy chủ chính [src/index.ts](file:///c:/Users/dandi/OneDrive/Desktop/Untitled Export/50226/Backend/src/index.ts) và đăng ký router con vừa tạo:
```typescript
import articleRouter from "./routes/article.routes.js";

// Đăng ký mount route
app.route("/api/articles", articleRouter);
```

### Bước 4: Tài liệu hóa kiểm thử
Cập nhật danh sách tài liệu chi tiết cấu trúc JSON đầu vào/đầu ra để bộ phận Frontend Next.js có thể tích hợp tức thì mà không cần hỏi lại.
