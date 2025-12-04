import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Conditionally load Spark plugins if available
async function loadSparkPlugins() {
  try {
    const [sparkModule, iconProxyModule] = await Promise.all([
      import("@github/spark/spark-vite-plugin"),
      import("@github/spark/vitePhosphorIconProxyPlugin")
    ]);
    return [
      iconProxyModule.default() as PluginOption,
      sparkModule.default() as PluginOption,
    ];
  } catch {
    console.log('Spark plugins not available, running in standalone mode');
    return [];
  }
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const sparkPlugins = await loadSparkPlugins();
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      // DO NOT REMOVE - Spark plugins loaded dynamically if available
      ...sparkPlugins,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    server: {
      port: 5000,
      host: true
    }
  };
});
