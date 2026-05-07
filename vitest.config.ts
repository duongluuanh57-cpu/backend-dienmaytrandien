import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["../Testing_Backend/**/*.test.ts"],
  },
});
