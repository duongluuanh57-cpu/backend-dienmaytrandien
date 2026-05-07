import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { categorySchema } from "../schemas/index.js";

const router = new Hono();

// GET /api/categories
router.get("/", async (c) => {
  try {
    const results = await db.select().from(categories);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve categories" }, 500);
  }
});

// GET /api/categories/:id
router.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  try {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    if (!category) {
      return c.json({ success: false, message: "Category not found" }, 404);
    }
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve category" }, 500);
  }
});

// GET /api/categories/slug/:slug
router.get("/slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    if (!category) {
      return c.json({ success: false, message: "Category not found" }, 404);
    }
    return c.json({ success: true, data: category });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve category" }, 500);
  }
});

// POST /api/categories (Protected with validation schema)
router.post("/", zValidator("json", categorySchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const [inserted] = await db.insert(categories).values(data).returning();
    return c.json({ success: true, data: inserted }, 201);
  } catch (error) {
    console.error("❌ Database insertion failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to create category" }, 500);
  }
});

export default router;
