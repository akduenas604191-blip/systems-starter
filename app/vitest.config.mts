import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets tests use the "@/..." import shortcut from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
  },
});
