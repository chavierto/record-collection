import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// `npm run start:https` serves over HTTPS (self-signed) so phones on the LAN
// can use the camera. API calls go through the /api proxy so an HTTPS page
// never talks to the plain-HTTP Django server directly (mixed content).
export default defineConfig(({ mode }) => ({
	plugins: [react(), mode === 'https' && basicSsl()].filter(Boolean),
	server: {
		host: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.js'],
		globals: true,
	},
}));
