import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vitePluginImp from "vite-plugin-imp";

const resolve = (dir: string) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) as ImportMetaEnv;
  return {
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
      vitePluginImp({
        libList: [
          {
            libName: "@nutui/nutui-react",
            style: (name) => {
              return `@nutui/nutui-react/dist/esm/${name}/style/css`;
            },
            replaceOldImport: false,
            camel2DashComponentName: false,
          },
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_TARGET_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), env.VITE_APP_TARGET_BASE_API),
        },
      },
    },
  };
});
