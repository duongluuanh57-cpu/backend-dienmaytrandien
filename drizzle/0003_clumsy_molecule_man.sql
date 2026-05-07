ALTER TABLE "products" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_code_unique" UNIQUE("code");