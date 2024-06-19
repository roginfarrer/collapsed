/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-expect-error Why no work :(
  test: {
    globals: true,
    setupFiles: ["./vitest-setup.ts"],
    environment: "happy-dom",
  },
});
