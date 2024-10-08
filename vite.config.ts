import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssPxtorem from "postcss-pxtorem";
// import svgr from "vite-plugin-svgr";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "node:path";

const resolve = (dir: string) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  plugins: [
    react(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve("src/assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  css: {
    postcss: {
      // plugins: [
      //   postcssPxtorem({
      //     rootValue: 37.5, // 设计稿宽度的1/10
      //     propList: ["*"],
      //   }),
      // ],
    },
  },
});
