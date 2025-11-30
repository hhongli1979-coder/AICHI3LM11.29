import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Get repository name from GitHub context or environment variable
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

// https://vite.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  // Uses repo name from GITHUB_REPOSITORY env var (set by GitHub Actions) or defaults to '/' for local development
  base: process.env.GITHUB_PAGES === 'true' && repoName ? `/${repoName}/` : '/',
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
