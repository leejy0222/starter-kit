import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/__tests__/',
        'prisma/',
      ],
    },
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
