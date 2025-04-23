import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
    proxy: {
      "/tts": {
        target: "https://openspeech.bytedance.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tts/, ""),
      },
    },
    host: "0.0.0.0", // 添加这行以支持 0.0.0.0
  },
  plugins: [vue()],
});
