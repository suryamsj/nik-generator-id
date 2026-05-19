import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', '!src/tests/**'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false,
  shims: true,
});
