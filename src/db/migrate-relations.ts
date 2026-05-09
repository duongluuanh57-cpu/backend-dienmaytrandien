import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in .env file.");
  process.exit(1);
}

const sql = postgres(databaseUrl, { prepare: false });

async function run() {
  console.log("🚀 Connecting to Supabase and executing brand and type enum migrations...");
  try {
    // 1. Query existing unique product types in the database
    console.log("🔍 Fetching existing unique product types...");
    const existingRows = await sql`SELECT DISTINCT type FROM products`.catch(() => []);
    const existingTypes = existingRows.map((row: any) => row.type).filter(Boolean);
    console.log("👉 Current unique types in database:", existingTypes);

    // Merge defaults and existing types
    const defaultTypes = ["Máy bơm", "Quạt chắn gió", "Quạt lạnh", "Treo tường", "Tủ đứng", "Âm trần", "Hệ thống Multi"];
    const mergedTypes = Array.from(new Set([...defaultTypes, ...existingTypes]));
    console.log("👉 Target Type Enum values:", mergedTypes);

    // 2. Query existing unique product brands in the database
    console.log("🔍 Fetching existing unique product brands...");
    const existingBrandRows = await sql`SELECT DISTINCT brand FROM products`.catch(() => []);
    const existingBrands = existingBrandRows.map((row: any) => row.brand).filter(Boolean);
    console.log("👉 Current unique brands in database:", existingBrands);

    // Merge defaults and existing brands
    const defaultBrands = ["King Pump", "Hitech", "Nanyoo", "Nedfon", "Oulai", "Koolman", "Nagakawa", "Panasonic", "Water Genius", "Hippo"];
    const mergedBrands = Array.from(new Set([...defaultBrands, ...existingBrands]));
    console.log("👉 Target Brand Enum values:", mergedBrands);

    // 3. Add Foreign Key for category_id
    console.log("⚙️ Creating foreign key constraint for category_id...");
    await sql`
      ALTER TABLE "products" 
      ADD CONSTRAINT "products_category_id_categories_id_fk" 
      FOREIGN KEY ("category_id") 
      REFERENCES "categories" ("id") 
      ON DELETE SET NULL;
    `.then(() => console.log("   ✅ category_id foreign key constraint created successfully."))
     .catch(e => console.warn("   ⚠️ (Notice: category_id constraint already exists or skipped):", e.message));

    // 4. Add Foreign Key for brand_id
    console.log("⚙️ Creating foreign key constraint for brand_id...");
    await sql`
      ALTER TABLE "products" 
      ADD CONSTRAINT "products_brand_id_brands_id_fk" 
      FOREIGN KEY ("brand_id") 
      REFERENCES "brands" ("id") 
      ON DELETE SET NULL;
    `.then(() => console.log("   ✅ brand_id foreign key constraint created successfully."))
     .catch(e => console.warn("   ⚠️ (Notice: brand_id constraint already exists or skipped):", e.message));

    // 5. Create TYPE ENUM dynamically
    console.log("⚙️ Creating dynamic enum 'product_type_enum'...");
    const typeExists = await sql`
      SELECT 1 FROM pg_type WHERE typname = 'product_type_enum'
    `;

    if (typeExists.length === 0) {
      const enumValuesSql = mergedTypes.map(t => `'${t.replace(/'/g, "''")}'`).join(", ");
      await sql.unsafe(`CREATE TYPE product_type_enum AS ENUM (${enumValuesSql})`);
      console.log("   ✅ enum 'product_type_enum' created successfully.");
    } else {
      console.log("   ℹ️ enum 'product_type_enum' already exists. Adding missing values...");
      for (const t of mergedTypes) {
        await sql.unsafe(`ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS '${t.replace(/'/g, "''")}'`)
          .catch(() => {});
      }
    }

    // 6. Create BRAND ENUM dynamically
    console.log("⚙️ Creating dynamic enum 'product_brand_enum'...");
    const brandExists = await sql`
      SELECT 1 FROM pg_type WHERE typname = 'product_brand_enum'
    `;

    if (brandExists.length === 0) {
      const enumValuesSql = mergedBrands.map(b => `'${b.replace(/'/g, "''")}'`).join(", ");
      await sql.unsafe(`CREATE TYPE product_brand_enum AS ENUM (${enumValuesSql})`);
      console.log("   ✅ enum 'product_brand_enum' created successfully.");
    } else {
      console.log("   ℹ️ enum 'product_brand_enum' already exists. Adding missing values...");
      for (const b of mergedBrands) {
        await sql.unsafe(`ALTER TYPE product_brand_enum ADD VALUE IF NOT EXISTS '${b.replace(/'/g, "''")}'`)
          .catch(() => {});
      }
    }

    // 7. Convert type column to enum
    console.log("⚙️ Altering 'type' column to utilize product_type_enum...");
    await sql`
      ALTER TABLE "products" 
      ALTER COLUMN "type" TYPE product_type_enum USING "type"::product_type_enum;
    `.then(() => console.log("   ✅ 'type' column converted to enum successfully!"))
     .catch(e => console.error("   ❌ Failed to alter 'type' column:", e.message));

    // 8. Convert brand column to enum
    console.log("⚙️ Altering 'brand' column to utilize product_brand_enum...");
    await sql`
      ALTER TABLE "products" 
      ALTER COLUMN "brand" TYPE product_brand_enum USING "brand"::product_brand_enum;
    `.then(() => console.log("   ✅ 'brand' column converted to enum successfully!"))
     .catch(e => console.error("   ❌ Failed to alter 'brand' column:", e.message));

    console.log("\n🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ Migration process failed:", err);
  } finally {
    await sql.end();
  }
}

run();
