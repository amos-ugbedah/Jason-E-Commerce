import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Remove the babel config since we're using automatic runtime
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(jsx|tsx)?$/,
    exclude: [],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});