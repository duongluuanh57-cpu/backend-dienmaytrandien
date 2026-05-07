import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import * as dotenv from "dotenv";
// Import Routes
import productRouter from "./routes/product.routes.js";
import projectRouter from "./routes/project.routes.js";
import contactRouter from "./routes/contact.routes.js";
dotenv.config();
const app = new Hono();
// Middlewares
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", cors({
    origin: ["http://localhost:3000", "https://dienmaytrandien.com"], // Match frontend origins
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
}));
// Health Check
app.get("/", (c) => {
    return c.json({
        status: "ok",
        message: "Điện Máy Trần Điền API Server is running beautifully 🚀",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
// Mount Routes
app.route("/api/products", productRouter);
app.route("/api/projects", projectRouter);
app.route("/api/contact", contactRouter);
// Global Error Handler
app.onError((err, c) => {
    console.error("🔥 Server Error:", err);
    return c.json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    }, 500);
});
// Page Not Found Handler
app.notFound((c) => {
    return c.json({
        success: false,
        message: "API Endpoint Not Found",
    }, 404);
});
// Start Server
const port = parseInt(process.env.PORT || "3001", 10);
console.log(`🚀 Starting Hono API server on port ${port}...`);
serve({
    fetch: app.fetch,
    port: port,
});
