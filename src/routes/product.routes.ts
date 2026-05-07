import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { productSchema } from "../schemas/index.js";

const router = new Hono();

// 1. GET /api/products (Retrieve products with optional filtering by categoryId, brandId, and type)
router.get("/", async (c) => {
  const categoryIdParam = c.req.query("categoryId");
  const brandIdParam = c.req.query("brandId");
  const typeParam = c.req.query("type");

  try {
    let query = db.select().from(products);
    const conditions = [];

    if (categoryIdParam) {
      const catId = parseInt(categoryIdParam, 10);
      if (!isNaN(catId)) {
        conditions.push(eq(products.categoryId, catId));
      }
    }

    if (brandIdParam) {
      const bId = parseInt(brandIdParam, 10);
      if (!isNaN(bId)) {
        conditions.push(eq(products.brandId, bId));
      }
    }

    if (typeParam) {
      conditions.push(eq(products.type, typeParam));
    }

    let results;
    if (conditions.length > 0) {
      results = await query.where(and(...conditions));
    } else {
      results = await query;
    }

    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve products" }, 500);
  }
});

// 2. GET /api/products/:id (Get product by ID)
router.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  try {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) {
      return c.json({ success: false, message: "Product not found" }, 404);
    }
    return c.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve product" }, 500);
  }
});

// 3. GET /api/products/slug/:slug (Get product by Slug)
router.get("/slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    if (!product) {
      return c.json({ success: false, message: "Product not found" }, 404);
    }
    return c.json({ success: true, data: product });
  } catch (error) {
    console.error("❌ Database query failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to retrieve product by slug" }, 500);
  }
});

// 4. POST /api/products (Create a new product)
router.post("/", zValidator("json", productSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const [inserted] = await db.insert(products).values(data).returning();
    return c.json({ success: true, data: inserted }, 201);
  } catch (error) {
    console.error("❌ Database insertion failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to create product" }, 500);
  }
});

// 5. PUT /api/products/:id (Update product by ID - accepts full or partial updates)
router.put("/:id", zValidator("json", productSchema.partial()), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  const data = c.req.valid("json");
  try {
    const [updated] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!updated) {
      return c.json({ success: false, message: "Product not found to update" }, 404);
    }

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("❌ Database update failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to update product" }, 500);
  }
});

// 6. DELETE /api/products/:id (Delete product by ID)
router.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID parameter" }, 400);
  }

  try {
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
    if (!deleted) {
      return c.json({ success: false, message: "Product not found to delete" }, 404);
    }
    return c.json({ success: true, message: "Product deleted successfully", data: deleted });
  } catch (error) {
    console.error("❌ Database deletion failed:", (error as Error).message);
    return c.json({ success: false, message: "Failed to delete product" }, 500);
  }
});

export default router;
