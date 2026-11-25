import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-manifest-and-sw',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (
              req.url === '/manifest.json' ||
              req.url === '/manifest.webmanifest' ||
              req.url?.startsWith('/manifest.json?') ||
              req.url?.startsWith('/manifest.webmanifest?')
            ) {
              res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
              const content = fs.readFileSync(path.resolve(__dirname, 'public/manifest.json'), 'utf-8');
              res.end(content);
              return;
            }
            if (req.url === '/sw.js' || req.url?.startsWith('/sw.js?')) {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
              const content = fs.readFileSync(path.resolve(__dirname, 'public/sw.js'), 'utf-8');
              res.end(content);
              return;
            }
            if (
              req.url === '/Go-delivery-A1.zip' ||
              req.url?.startsWith('/Go-delivery-A1.zip?') ||
              req.url === '/go-delivery-vercel.zip' ||
              req.url?.startsWith('/go-delivery-vercel.zip?') ||
              req.url === '/go-delivery-project.zip' ||
              req.url?.startsWith('/go-delivery-project.zip?')
            ) {
              const preferredZip = path.resolve(__dirname, 'public/Go-delivery-A1.zip');
              const fallbackZip = path.resolve(__dirname, 'public/go-delivery-vercel.zip');
              const zipPath = fs.existsSync(preferredZip) ? preferredZip : fallbackZip;
              if (fs.existsSync(zipPath)) {
                const stat = fs.statSync(zipPath);
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename="Go-delivery-A1.zip"');
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
                res.setHeader('Access-Control-Allow-Origin', '*');
                fs.createReadStream(zipPath).pipe(res);
                return;
              }
            }

            // Webhook / REST API para recibir pedidos desde otra app
            if (req.url === '/api/orders/receive' || req.url === '/api/orders/incoming') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

              if (req.method === 'OPTIONS') {
                res.statusCode = 204;
                res.end();
                return;
              }

              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });
                req.on('end', () => {
                  try {
                    const parsed = JSON.parse(body || '{}');
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      message: 'Pedido recibido con éxito por Go Delivery Repartidor',
                      receivedAt: new Date().toISOString(),
                      orderId: parsed.id || `GD-${Math.floor(1000 + Math.random() * 9000)}`
                    }));
                  } catch (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 400;
                    res.end(JSON.stringify({ success: false, error: 'Formato JSON inválido' }));
                  }
                });
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                status: 'online',
                endpoint: '/api/orders/receive',
                method: 'POST',
                description: 'Webhook para conectar app de pedidos con Go Delivery Repartidor'
              }));
              return;
            }

            next();
          });
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
          globIgnores: ['**/*.zip', 'assets/aistudio/**'],
          navigateFallbackDenylist: [/\.zip$/i],
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
        },
        includeAssets: [
          'favicon.ico',
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-maskable-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'ceo-avatar.jpg',
          'IMG_20260917_170446865_MFNR.jpg'
        ],
        manifest: {
          id: '/',
          name: 'Go delivery',
          short_name: 'Go delivery',
          description: 'Go delivery app de entregas VE',
          dir: 'ltr',
          lang: 'es',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          categories: ['travel', 'food', 'shopping', 'business'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
