import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    open: true,
    watch: {
      ignored: ["**/.runtime/**"],
    },
  },
  preview: {
    host: "127.0.0.1",
  },
  base: "./",
});
