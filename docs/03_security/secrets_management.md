# 🛡️ Secrets Management - Quản trị Bảo mật & Biến Môi trường

Tài liệu này đặc tả quy trình quản trị, bảo mật và xác thực các khóa nhạy cảm (secrets, API keys) của hệ thống Điện Máy Trần Điền nhằm chống rò rỉ thông tin ra bên ngoài.

## 🔐 Nguyên tắc bảo mật cốt lõi
*   **Tuyệt đối không hardcode**: Không viết trực tiếp chuỗi kết nối, mật khẩu database hay API keys vào mã nguồn. Tất cả phải được tải động thông qua biến môi trường (`process.env`).
*   **Không đẩy file cấu hình cục bộ lên Git**: File `.env` chứa dữ liệu nhạy cảm cục bộ bắt buộc phải được định nghĩa trong `.gitignore`. Chỉ đẩy file mẫu `.env.example` lên Git để lập trình viên khác biết cấu trúc cần điền.

---

## ⚡ Xác thực Biến Môi trường tự động bằng Zod

Để ngăn ngừa lỗi hệ thống chạy bị lỗi âm thầm do lập trình viên cấu hình thiếu hoặc sai kiểu dữ liệu của biến môi trường trong file `.env`, dự án khuyến nghị thiết lập hệ thống tự động kiểm tra biến môi trường (Environment Validation) bằng Zod khi khởi chạy máy chủ.

### File cấu hình xác thực mẫu (`src/db/env.ts`)
```typescript
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("DATABASE_URL phải là một URL hợp lệ chứa thông tin kết nối Postgres"),
  RESEND_API_KEY: z.string().startsWith("re_", "API Key của Resend phải bắt đầu bằng re_").optional()
});

// Chạy xác thực
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Lỗi cấu hình biến môi trường trong file .env:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1); // Buộc dừng server ngay lập tức để lập trình viên sửa đổi
}

export const env = parsed.data;
```

---

## 🔍 Quét và Phòng ngừa rò rỉ Khóa Bảo mật (Gitleaks)

Để bảo vệ mã nguồn tối đa trước các nguy cơ sơ suất đẩy nhầm tệp tin bảo mật lên các kho lưu trữ công cộng (GitHub, GitLab), đội ngũ phát triển nên áp dụng công cụ quét tự động **Gitleaks**.

### 1. Quét cục bộ trước khi Commit
Bạn có thể cài đặt gitleaks trên máy cá nhân và chạy quét thử:
```bash
# Cài đặt qua Homebrew (macOS) hoặc Chocolatey (Windows)
gitleaks detect --source . --verbose
```

### 2. Tự động hóa quét trong GitHub Actions
Tích hợp trực tiếp Gitleaks vào quy trình CI/CD để tự động từ chối Pull Request nếu phát hiện có chứa mật khẩu database hoặc API key lộ lọt:
```yaml
name: Security Secrets Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Run Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
