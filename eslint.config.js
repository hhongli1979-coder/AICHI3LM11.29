import js from "@eslint/js";

export default [
  // Files to ignore globally
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "materialize_v13.11.0/**",
      "*.d.ts",
      "vite.config.ts",
      "src/**/*.tsx",
      "src/**/*.ts",
    ],
  },
  // Base configuration for all JS files
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  // Configuration for CommonJS files (Firebase functions, etc.)
  {
    files: ["index.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        // Node.js globals for CommonJS modules
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
  },
  // Configuration for ES module config files
  {
    files: ["*.config.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
];
