import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    '@fixl1234/restaurent-core',
    '@fixl1234/restaurent-types',
    '@fixl1234/restaurent-menu',
    '@fixl1234/restaurent-orders',
    '@fixl1234/restaurent-otp',
    '@fixl1234/restaurent-kds',
    '@fixl1234/restaurent-auth',
    '@fixl1234/restaurent-payments',
    '@fixl1234/restaurent-analytics',
    '@fixl1234/restaurent-notifications',
    'socket.io-client',
  ],
})
