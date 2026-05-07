import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";

// Import Routes
import productRouter from "./routes/product.routes.js";
import projectRouter from "./routes/project.routes.js";
import contactRouter from "./routes/contact.routes.js";
import categoryRouter from "./routes/category.routes.js";
import brandRouter from "./routes/brand.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = new Hono();

// Middlewares
app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: ["http://localhost:1000", "http://localhost:3000", "http://localhost:5173", "https://dienmaytrandien.com"], // Match frontend & dashboard origins
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Health Check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Điện Máy Trần Điền API Server is running beautifully 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Dashboard Config Features fallback route
app.get("/api/config/features", (c) => {
  return c.json({
    success: true,
    data: {
      enableProducts: true,
      enableUsers: true,
      enableProjects: true,
    },
  });
});

// Direct POST /api/login route for the Dashboard login
app.post("/api/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ success: false, message: "Email và mật khẩu không được trống" }, 400);
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return c.json({ success: false, message: "Email hoặc mật khẩu không chính xác" }, 401);
    }

    // Hash and verify password
    const hashedInput = crypto.createHash("sha256").update(password).digest("hex");
    if (user.password !== hashedInput) {
      return c.json({ success: false, message: "Email hoặc mật khẩu không chính xác" }, 401);
    }

    return c.json({
      success: true,
      message: "Đăng nhập thành công!",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Login failed:", (error as Error).message);
    return c.json({ success: false, message: "Đăng nhập thất bại" }, 500);
  }
});

// Mount Routes
app.route("/api/products", productRouter);
app.route("/api/projects", projectRouter);
app.route("/api/contact", contactRouter);
app.route("/api/categories", categoryRouter);
app.route("/api/brands", brandRouter);
app.route("/api/users", userRouter);

// Global Error Handler
app.onError((err, c) => {
  console.error("🔥 Server Error:", err);
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

// Page Not Found Handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "API Endpoint Not Found",
    },
    404
  );
});

// Start Server
const port = parseInt(process.env.PORT || "4000", 10);
console.log(`🚀 Starting Hono API server on port ${port}...`);

serve({
  fetch: app.fetch,
  port: port,
});
