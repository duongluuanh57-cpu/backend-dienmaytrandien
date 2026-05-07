import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { productSchema } from "../schemas/index.js";
const router = new Hono();
// GET /api/products
router.get("/", async (c) => {
    try {
        const results = await db.select().from(products);
        return c.json({ success: true, data: results });
    }
    catch (error) {
        console.error("❌ Database query failed:", error.message);
        return c.json({ success: false, message: "Failed to retrieve products" }, 500);
    }
});
// POST /api/products (Protected with validation schema)
router.post("/", zValidator("json", productSchema), async (c) => {
    const data = c.req.valid("json");
    try {
        const [inserted] = await db.insert(products).values(data).returning();
        return c.json({ success: true, data: inserted }, 201);
    }
    catch (error) {
        console.error("❌ Database insertion failed:", error.message);
        return c.json({ success: false, message: "Failed to create product" }, 500);
    }
});
export default router;
