import { z } from "zod";
// Product Validation Schema
export const productSchema = z.object({
    name: z.string().min(1, "Tên sản phẩm không được trống"),
    description: z.string().optional(),
    price: z.number().int().nonnegative("Giá sản phẩm phải là số dương"),
    brand: z.string().min(1, "Thương hiệu không được trống"),
    type: z.string().min(1, "Phân loại không được trống"),
    image: z.string().url("Định dạng ảnh không hợp lệ").optional().or(z.literal("")),
    isAvailable: z.boolean().default(true),
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
