import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.spec.ts'],
  clean: true,
  format: 'esm',
  outDir: 'dist',
})
