import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Check if running in Spark environment
const isSparkEnvironment = process.env.SPARK_ENV === 'true' || process.env.npm_package_name?.includes('spark');

// Conditionally load Spark plugins
async function getSparkPlugins(): Promise<PluginOption[]> {
  if (isSparkEnvironment) {
    try {
      const { default: sparkPlugin } = await import("@github/spark/spark-vite-plugin");
      const { default: createIconImportProxy } = await import("@github/spark/vitePhosphorIconProxyPlugin");
      return [
        createIconImportProxy() as PluginOption,
        sparkPlugin() as PluginOption,
      ];
    } catch {
      console.log('Spark plugins not available, running in standalone mode');
      return [];
    }
  }
  return [];
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const sparkPlugins = await getSparkPlugins();
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...sparkPlugins,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src'),
        // Provide empty module for spark in non-Spark environment
        '@github/spark/spark': isSparkEnvironment ? '@github/spark/spark' : resolve(projectRoot, 'src/lib/spark-shim.ts'),
      }
    },
  };
});
