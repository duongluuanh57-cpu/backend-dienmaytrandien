import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// Categories table (Máy bơm nước ngưng, Quạt chắn gió, Máy lạnh treo tường, Máy lạnh âm trần...)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionEn: text("description_en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Brands table (Panasonic, Oulai, King Pump, Hitech, KoolMan, Nagakawa, Nanyoo...)
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products table (Máy lạnh Nagakawa, Panasonic, Máy bơm nước ngưng Kingpump...)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // Product SEO Slug
  code: text("code").notNull().unique(), // Product Model/SKU Code (e.g. KHP-9M, FM-1209L-2)
  origin: text("origin").notNull().default("Đang cập nhật"), // Place of manufacture / origin (e.g. Đài Loan, Thái Lan)
  shortDescription: text("short_description"), // Brief summary
  description: text("description"), // Detailed long description
  price: integer("price").notNull().default(0),
  brand: text("brand").notNull(), // Legacy brand field
  type: text("type").notNull(),  // Treo tường, Âm trần, Máy bơm, etc.
  categoryId: integer("category_id").references(() => categories.id), // Related category
  brandId: integer("brand_id").references(() => brands.id), // Related brand
  image: text("image"), // Main featured image
  images: jsonb("images"), // Gallery sub-images array e.g. ["url1", "url2"]
  isAvailable: boolean("is_available").notNull().default(true),
  stock: integer("stock").notNull().default(0), // Quantity in stock (e.g. 15)
  views: integer("views").notNull().default(0), // View counter
  specs: jsonb("specs"), // Technical specifications e.g. {"Công suất": "100W", "Dung tích": "35L"}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// Users table (Tài khoản quản trị Dashboard và khách hàng)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  role: text("role").notNull().default("user"), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


