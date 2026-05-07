import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
// Products table (Máy lạnh Nagakawa, Panasonic, Máy bơm nước ngưng Kingpump...)
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull().default(0),
    brand: text("brand").notNull(), // Panasonic, Nagakawa, Kingpump, etc.
    type: text("type").notNull(), // Treo tường, Âm trần, Máy bơm, etc.
    image: text("image"),
    isAvailable: boolean("is_available").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Projects table (Các công trình thi công thực tế)
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location").notNull(), // Ví dụ: TP.HCM, Bình Dương...
    year: integer("year").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Customer Contacts table (Biểu mẫu tư vấn gửi từ trang chủ)
export const contacts = pgTable("contacts", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
