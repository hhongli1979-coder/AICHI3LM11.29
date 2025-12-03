import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/scss/admin.scss",
                "resources/js/script.js",
                "resources/scss/front-style.scss"
            ],
        }),
        {
            name: 'blade.php',
            handleHotUpdate({ file, server }) {
                if (file.endsWith('.blade.php')) {
                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    });
                }
            },
        }
    ],
    build: {
        assetsInlineLimit: 0,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/images")
        }
    }
});
