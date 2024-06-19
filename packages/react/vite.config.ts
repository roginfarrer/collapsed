/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // @ts-expect-error Why no work :(
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
  },
});
