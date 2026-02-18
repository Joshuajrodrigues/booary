import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "scripts/add-book.ts",
    index: "src/lib/LibraryCard.tsx",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  injectStyle: true,
  external: ["react", "react-dom"],
  tsconfig: "tsconfig.build.json",
  banner: {
    js: "#!/usr/bin/env node",
  },
});
