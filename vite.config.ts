import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Check if running in Spark environment using explicit environment variable
const isSparkEnvironment = process.env.SPARK_ENV === 'true';

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
  
  // Build alias configuration - only provide spark shim in non-Spark environment
  const aliases: Record<string, string> = {
    '@': resolve(projectRoot, 'src'),
  };
  
  if (!isSparkEnvironment) {
    aliases['@github/spark/spark'] = resolve(projectRoot, 'src/lib/spark-shim.ts');
  }
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...sparkPlugins,
    ],
    resolve: {
      alias: aliases
    },
  };
});
