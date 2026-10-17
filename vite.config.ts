import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@shared": path.resolve(import.meta.dirname, "shared") } },
  server: {
    // In dev, the Hono server runs on :3000 and Vite proxies /api to it.
    proxy: { "/api": "http://localhost:3000" },
  },
  build: { target: "es2022" },
  // Stamped into asset URLs so a bundle can only ever load the atlas sheets built with it.
  // Without this a cached PNG and a fresh JSON (or vice versa) index the wrong sprites.
  define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Cooking With Fam",
        short_name: "CookFam",
        description: "Photograph your pantry, cook what you have.",
        theme_color: "#1a1a1a",
        background_color: "#1a1a1a",
        // fullscreen hides the Android status bar and nav buttons when installed; iOS has no
        // equivalent and falls back to standalone.
        display: "fullscreen",
        display_override: ["fullscreen", "standalone"],
        orientation: "portrait",
        icons: [
          { src: "icons/icon-64.png", sizes: "64x64", type: "image/png" },
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the game shell. API calls always go to the network.
        globPatterns: ["**/*.{js,css,html,png,json,woff2}"],
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
