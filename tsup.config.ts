import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      cli: "scripts/add-book.ts",
    },
    format: ["esm"],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: false,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
  {
    entry: {
      index: "src/lib/libraryCard.tsx",
    },
    format: ["iife"],
    minify: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: false,
    treeshake: true,
    esbuildOptions(options) {
      options.jsx = "automatic";
      options.jsxImportSource = "preact"; // Tells it to get h and Fragment from preact
    },
  },
]);
