import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { userSchema } from "../schemas/index.js";
import { z } from "zod";

const router = new Hono();

// Helper to securely hash passwords using built-in crypto
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// 1. GET /api/users (Retrieve all users - excluding password hashes for security)
router.get("/", async (c) => {
  try {
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve users" }, 500);
  }
});

// 2. GET /api/users/:id (Get single user by ID - excluding password)
router.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    return c.json({ success: true, data: user });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve user" }, 500);
  }
});

// 3. POST /api/users (Register/Create a new user - hashes password)
router.post("/", zValidator("json", userSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    // Check if email already exists
    const [existing] = await db.select().from(users).where(eq(users.email, data.email));
    if (existing) {
      return c.json({ success: false, message: "Email này đã được sử dụng" }, 400);
    }

    // Hash password
    const hashedPassword = hashPassword(data.password);

    const [inserted] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return c.json({ success: true, data: inserted }, 201);
  } catch (error) {
    console.error("❌ Database insertion failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to create user" }, 500);
  }
});

// 4. POST /api/users/login (Authenticate user for Dashboard login)
const loginSchema = z.object({
  email: z.string().email("Định dạng email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được trống"),
});

router.post("/login", zValidator("json", loginSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const [user] = await db.select().from(users).where(eq(users.email, data.email));
    if (!user) {
      return c.json({ success: false, message: "Email hoặc mật khẩu không chính xác" }, 401);
    }

    // Verify hashed password
    const hashedInput = hashPassword(data.password);
    if (user.password !== hashedInput) {
      return c.json({ success: false, message: "Email hoặc mật khẩu không chính xác" }, 401);
    }

    // Return authenticated user details (excluding password)
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
    console.error("❌ Authentication failed:", (error as Error).message);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

export default router;
