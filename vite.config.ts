import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { lingui } from "@lingui/vite-plugin";
import svgr from "vite-plugin-svgr";
import prismjs from "vite-plugin-prismjs";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    svgr(),
    react({
      babel: {
        plugins: ["macros"]
      }
    }),
    lingui(),
    prismjs({
      languages: ["json"],
      plugins: ["line-numbers"],
      theme: "tomorrow",
      css: true
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    // Use 1421 since the default 1420 is already being used by the tauri oauth client server
    port: 1421,
    strictPort: true,
    fs: {
      allow: [".."]
    }
  },
  // to make use of `TAURI_ENV_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target:
      process.env.TAURI_ENV_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: (!process.env.TAURI_ENV_DEBUG ? "esbuild" : false) as
      | "esbuild"
      | boolean,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_ENV_DEBUG
  }
}));
