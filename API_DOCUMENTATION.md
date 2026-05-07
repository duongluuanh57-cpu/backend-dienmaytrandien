# 📘 TÀI LIỆU HƯỚNG DẪN TÍCH HỢP API - ĐIỆN MÁY TRẦN ĐIỀN (2026)

Tài liệu này cung cấp chi tiết toàn bộ hệ thống API phục vụ kết nối cho cả dự án **Frontend Website** và dự án **Admin Dashboard**.

- **Base URL**: `http://localhost:4000`
- **Định dạng dữ liệu**: `JSON`
- **CORS Whitelist**: `http://localhost:1000` (Dashboard), `http://localhost:3000` (Frontend), `http://localhost:5173` (Vite)

---

## 🔑 1. PHÂN HỆ XÁC THỰC (AUTHENTICATION API)

### 🔓 Đăng nhập hệ thống (Login)
Sử dụng để xác thực tài khoản quản trị viên trước khi vào Dashboard.

- **Phương thức**: `POST`
- **Endpoint**: `/api/login`
- **Yêu cầu (Request Body)**:
  ```json
  {
    "email": "admin@dienmaytrandien.com",
    "password": "admin123"
  }
  ```
- **Phản hồi thành công (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công!",
    "data": {
      "id": 1,
      "name": "Admin Điện Máy",
      "email": "admin@dienmaytrandien.com",
      "role": "admin",
      "createdAt": "2026-05-07T07:14:02.000Z"
    }
  }
  ```

---

## 📦 2. PHÂN HỆ SẢN PHẨM (PRODUCTS API)

### 📋 Lấy danh sách sản phẩm (Hỗ trợ Bộ lọc nâng cao)
- **Phương thức**: `GET`
- **Endpoint**: `/api/products`
- **Query Parameters (Tùy chọn)**:
  - `categoryId` (number): Lọc theo ID danh mục (ví dụ: `/api/products?categoryId=1`)
  - `brandId` (number): Lọc theo ID hãng sản xuất (ví dụ: `/api/products?brandId=3`)
  - `type` (string): Lọc theo phân loại sản phẩm (ví dụ: `/api/products?type=Máy bơm`)
- **Phản hồi thành công (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Máy Bơm Nước Ngưng Kingpump Hippo 9M",
        "slug": "may-bom-nuoc-ngung-kingpump-hippo-9m",
        "code": "KHP-9M",
        "origin": "Đài Loan",
        "shortDescription": "Bơm nước xả máy lạnh tủ đứng, áp trần...",
        "description": "Dòng máy bơm nước ngưng Kingpump Hippo...",
        "price": 1350000,
        "brand": "King Pump",
        "type": "Máy bơm",
        "categoryId": 1,
        "brandId": 3,
        "image": "https://images.unsplash.com/...",
        "images": ["url1", "url2"],
        "isAvailable": true,
        "stock": 45,
        "views": 248,
        "specs": {
          "Công suất": "70W",
          "Độ cao đẩy tối đa": "9m"
        },
        "createdAt": "2026-05-07T07:14:02.000Z",
        "updatedAt": "2026-05-07T07:14:02.000Z"
      }
    ]
  }
  ```

### 🔍 Lấy chi tiết sản phẩm theo ID (Form Edit)
- **Phương thức**: `GET`
- **Endpoint**: `/api/products/:id` (ví dụ: `/api/products/1`)

### 🎯 Lấy chi tiết sản phẩm theo Slug (Chuẩn SEO cho Frontend)
- **Phương thức**: `GET`
- **Endpoint**: `/api/products/slug/:slug` (ví dụ: `/api/products/slug/may-bom-nuoc-ngung-kingpump-hippo-9m`)

### ➕ Thêm mới sản phẩm (Create)
- **Phương thức**: `POST`
- **Endpoint**: `/api/products`
- **Dữ liệu gửi lên (JSON)**:
  ```json
  {
    "name": "Sản phẩm mới",
    "slug": "san-pham-moi",
    "code": "NEW-MODEL",
    "origin": "Việt Nam",
    "shortDescription": "Mô tả ngắn gọn",
    "description": "Bài viết mô tả chi tiết dài dòng",
    "price": 1500000,
    "brand": "Panasonic",
    "type": "Treo tường",
    "categoryId": 5,
    "brandId": 1,
    "image": "https://url-anh.jpg",
    "images": ["https://url-anh-1.jpg"],
    "stock": 10,
    "specs": {
      "Công suất": "1.5 HP"
    }
  }
  ```

### 📝 Chỉnh sửa sản phẩm (Update - Hỗ trợ cập nhật một phần)
- **Phương thức**: `PUT`
- **Endpoint**: `/api/products/:id`
- **Dữ liệu gửi lên (Chỉ gửi các trường muốn cập nhật)**:
  ```json
  {
    "price": 1450000,
    "stock": 15
  }
  ```

### ❌ Xóa sản phẩm (Delete)
- **Phương thức**: `DELETE`
- **Endpoint**: `/api/products/:id`

---

## 🗂️ 3. PHÂN HỆ DANH MỤC & THƯƠNG HIỆU (CATEGORIES & BRANDS)

### 📁 Danh mục sản phẩm (Categories)
- **Lấy toàn bộ danh mục**: `GET /api/categories`
- **Chi tiết danh mục theo ID**: `GET /api/categories/:id`
- **Chi tiết danh mục theo Slug**: `GET /api/categories/slug/:slug`

### 🏷️ Thương hiệu / Hãng (Brands)
- **Lấy toàn bộ thương hiệu**: `GET /api/brands`
- **Chi tiết thương hiệu theo ID**: `GET /api/brands/:id`
- **Chi tiết thương hiệu theo Slug**: `GET /api/brands/slug/:slug`

---

## 🏢 4. PHÂN HỆ DỰ ÁN & LIÊN HỆ (PROJECTS & CONTACT)

### 🏗️ Công trình / Dự án thực tế (Projects)
- **Lấy danh sách dự án**: `GET /api/projects`
- **Lấy chi tiết dự án**: `GET /api/projects/:id`

### 📞 Nhận thông tin liên hệ (Contact Submission)
Sử dụng khi khách hàng gửi biểu mẫu tư vấn từ Website.
- **Phương thức**: `POST`
- **Endpoint**: `/api/contact`
- **Dữ liệu gửi lên (JSON)**:
  ```json
  {
    "name": "Nguyễn Văn A",
    "email": "vana@gmail.com",
    "phone": "0987654321",
    "message": "Tôi muốn tư vấn lắp đặt máy lạnh âm trần cho văn phòng."
  }
  ```

---

## ⚙️ 5. PHÂN HỆ CẤU HÌNH HỆ THỐNG (CONFIG API)

### 📊 Lấy tính năng cấu hình (Features Config - Dành riêng cho Dashboard)
- **Phương thức**: `GET`
- **Endpoint**: `/api/config/features`
- **Phản hồi mẫu**:
  ```json
  {
    "success": true,
    "data": {
      "enableProducts": true,
      "enableUsers": true,
      "enableProjects": true
    }
  }
  ```

---

## 💻 6. SNIPPETS MẪU GỌI API (JAVASCRIPT / TYPESCRIPT)

### Gọi API Đăng nhập từ Dashboard:
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json();
    if (result.success) {
      console.log("Đăng nhập thành công!", result.data);
      // Lưu thông tin đăng nhập...
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối Server:", error);
  }
};
```
