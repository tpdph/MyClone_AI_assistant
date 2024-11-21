import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self' ws: wss: http: https:",
  "worker-src 'self' blob:",
  "child-src 'self' blob:"
].join('; ');

// Development-specific configuration
const devConfig = {
  server: {
    host: true,
    port: 5173,
    open: true,
    headers: {
      'Content-Security-Policy': cspHeader
    },
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
};

// Production-specific configuration
const prodConfig = {
  server: {
    host: true,
    port: 5173,
    open: true,
    headers: {
      'Content-Security-Policy': cspHeader
    },
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
};

export default defineConfig(({ command }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['three']
  },
  resolve: {
    alias: {
      'three/addons': 'three/examples/jsm'
    }
  },
  ...(command === 'serve' ? devConfig : prodConfig)
}));
