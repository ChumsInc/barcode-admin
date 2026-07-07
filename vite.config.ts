/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import path from "node:path";
import process from "node:process";
import {visualizer} from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@/": path.resolve(process.cwd(), 'src'),
            "@/api": path.resolve(process.cwd(), 'src/api'),
            "@/app": path.resolve(process.cwd(), 'src/app'),
            "@/components": path.resolve(process.cwd(), 'src/components'),
            "@/ducks": path.resolve(process.cwd(), 'src/ducks'),
            "@/hooks": path.resolve(process.cwd(), 'src/hooks'),
            "@/slices": path.resolve(process.cwd(), 'src/slices'),
            "@/types": path.resolve(process.cwd(), 'src/types'),
            "@/utils": path.resolve(process.cwd(), 'src/utils'),
        }
    },
    base: "/apps/barcode-admin/",
    build: {
        manifest: true,
        sourcemap: true,
        rolldownOptions: {
            plugins: [visualizer({filename: 'stats.html', gzipSize: true})],
            output: {
                codeSplitting: {
                    groups: [
                        {test: /node_modules\/(react|react-dom)\//, name: 'react'},
                        {test: /node_modules\/(react-bootstrap|@restart|@popperjs|@base-ui|@emotion)/, name: 'ui'},
                        {test: /node_modules/, name: 'vendor'}
                    ]
                },
            }
        }
    },
    server: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/node-sage': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            }
        }
    }
})
