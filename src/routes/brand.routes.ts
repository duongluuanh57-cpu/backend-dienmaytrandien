import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { brands } from "../db/schema.js";
import { brandSchema } from "../schemas/index.js";

const router = new Hono();

// GET /api/brands
router.get("/", async (c) => {
  try {
    const results = await db.select().from(brands);
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve brands" }, 500);
  }
});

// GET /api/brands/:id
router.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  try {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    if (!brand) {
      return c.json({ success: false, message: "Brand not found" }, 404);
    }
    return c.json({ success: true, data: brand });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve brand" }, 500);
  }
});

// GET /api/brands/slug/:slug
router.get("/slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
    if (!brand) {
      return c.json({ success: false, message: "Brand not found" }, 404);
    }
    return c.json({ success: true, data: brand });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve brand" }, 500);
  }
});

// POST /api/brands (Protected with validation schema)
router.post("/", zValidator("json", brandSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const [inserted] = await db.insert(brands).values(data).returning();
    return c.json({ success: true, data: inserted }, 201);
  } catch (error) {
    console.error("❌ Database insertion failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to create brand" }, 500);
  }
});

export default router;
