import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";
import { contactSchema } from "../schemas/index.js";
const router = new Hono();
// POST /api/contact (Receive customer leads)
router.post("/", zValidator("json", contactSchema), async (c) => {
    const data = c.req.valid("json");
    try {
        const [inserted] = await db.insert(contacts).values(data).returning();
        console.log("📨 Saved contact successfully to database:", inserted);
        return c.json({ success: true, message: "Gửi liên hệ thành công!", data: inserted }, 201);
    }
    catch (error) {
        console.error("❌ Database insertion failed:", error.message);
        return c.json({ success: false, message: "Failed to submit contact request" }, 500);
    }
});
export default router;
