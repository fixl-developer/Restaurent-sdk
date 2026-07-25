import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    '@fixl1234/restaurent-types',
    '@fixl1234/restaurent-core',
    'socket.io-client',
  ],
})
