import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [],
  // types-only package — ensure mjs is not empty
  esbuildOptions(options) {
    options.footer = { js: '' }
  },
})
