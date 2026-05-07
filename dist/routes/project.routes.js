import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { projects } from "../db/schema.js";
import { projectSchema } from "../schemas/index.js";
const router = new Hono();
// GET /api/projects
router.get("/", async (c) => {
    try {
        const results = await db.select().from(projects);
        return c.json({ success: true, data: results });
    }
    catch (error) {
        console.error("❌ Database query failed:", error.message);
        return c.json({ success: false, message: "Failed to retrieve projects" }, 500);
    }
});
// POST /api/projects (Protected with validation schema)
router.post("/", zValidator("json", projectSchema), async (c) => {
    const data = c.req.valid("json");
    try {
        const [inserted] = await db.insert(projects).values(data).returning();
        return c.json({ success: true, data: inserted }, 201);
    }
    catch (error) {
        console.error("❌ Database insertion failed:", error.message);
        return c.json({ success: false, message: "Failed to create project" }, 500);
    }
});
export default router;
