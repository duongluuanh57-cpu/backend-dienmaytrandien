import { z } from "zod";

// Category Validation Schema
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được trống"),
  nameEn: z.string().min(1, "English category name is required"),
  slug: z.string().min(1, "Slug không được trống"),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
});

// Brand Validation Schema
export const brandSchema = z.object({
  name: z.string().min(1, "Tên hãng không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  description: z.string().optional(),
  logo: z.string().url("Định dạng logo không hợp lệ").optional().or(z.literal("")),
});

// Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  code: z.string().min(1, "Mã sản phẩm không được trống"),
  origin: z.string().min(1, "Xuất xứ không được trống").default("Đang cập nhật"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().int().nonnegative("Giá sản phẩm phải là số dương"),
  brand: z.string().min(1, "Thương hiệu không được trống"),
  type: z.string().min(1, "Phân loại không được trống"),
  categoryId: z.number().int().positive().optional(),
  brandId: z.number().int().positive().optional(),
  image: z.string().url("Định dạng ảnh không hợp lệ").optional().or(z.literal("")),
  images: z.array(z.string().url("Định dạng ảnh con không hợp lệ")).optional().or(z.any()),
  isAvailable: z.boolean().default(true),
  stock: z.number().int().nonnegative("Số lượng tồn kho không được là số âm").default(0),
  views: z.number().int().nonnegative("Lượt xem không được là số âm").default(0),
  specs: z.record(z.string(), z.any()).optional().or(z.any()),
});

// Project Validation Schema
export const projectSchema = z.object({
  title: z.string().min(1, "Tiêu đề dự án không được trống"),
  description: z.string().optional(),
  location: z.string().min(1, "Địa điểm thi công không được trống"),
  year: z.number().int().min(2000, "Năm không hợp lệ").max(2050, "Năm không hợp lệ"),
  image: z.string().url("Định dạng ảnh không hợp lệ").optional().or(z.literal("")),
});

// Contact Submission Schema
export const contactSchema = z.object({
  name: z.string().min(1, "Tên người liên hệ không được trống"),
  email: z.string().email("Định dạng Email không hợp lệ"),
  phone: z.string().regex(/^\d{10,11}$/, "Số điện thoại phải từ 10 đến 11 số"),
  message: z.string().min(5, "Nội dung liên hệ phải có ít nhất 5 ký tự"),
});

// User Validation Schema
export const userSchema = z.object({
  name: z.string().min(1, "Tên người dùng không được trống"),
  email: z.string().email("Định dạng Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.enum(["admin", "user"]).default("user"),
});
