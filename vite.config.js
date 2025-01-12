import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import Vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Imports from "unplugin-auto-import/vite";
import PurgeCSS from "rollup-plugin-purgecss";
import Unhead from "@unhead/addons/vite";
import { unheadVueComposablesImports } from "@unhead/vue";

export default defineConfig({
    plugins: [
        /**
         * Shows a quick overview of your app, including the Vue version, pages and components.
         *
         * @see https://devtools-next.vuejs.org/
         */
        // DevTools(),

        /**
         * unplugin-vue-router plugin generate routes based on file system
         * allow to use typed routes and usage of defineLoader
         *
         * @see https://uvr.esm.is/rfcs/data-loaders/
         */
        // VueRouter({
        //     routesFolder: "resources/js/pages",
        //     dts: "./types/router.d.ts",
        // }),

        /**
         * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
         *
         * @see https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/README.md
         */
        Vue({
            include: [/\.vue$/],
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ["iconify-icon"].includes(tag),
                },
            },
        }),

        /**
         * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
         *
         * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
         */
        Unhead(),

        /**
         * unplugin-auto-import allow to automaticaly import modules/components
         *
         * @see https://github.com/antfu/unplugin-auto-import
         */
        Imports({
            dts: "./resources/types/imports.d.ts",
            imports: [
                "vue",
                "@vueuse/core",
                // VueRouterAutoImports,
                unheadVueComposablesImports,
            ],
            dirs: [
                "resources/js/composables",
                "resources/js/stores",
                "resources/js/utils",
            ],
        }),

        /**
         * unplugin-vue-components plugin is responsible of autoloading components
         * documentation and md file are loaded for elements and components sections
         *
         * @see https://github.com/antfu/unplugin-vue-components
         */
        Components({
            dirs: ["documentation", "resources/js/components"],
            extensions: ["vue", "md"],
            dts: "./resources/types/components.d.ts",
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        }),

        /**
         * rollup-plugin-purgecss plugin is responsible of purging css rules
         * that are not used in the bundle
         *
         * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
         */
        PurgeCSS({
            output: false,
            content: [`./resources/js/**/*.vue`],
            variables: false,
            safelist: {
                standard: [
                    /(autv|lnil|lnir|fas?)/,
                    /-(leave|enter|appear)(|-(to|from|active))$/,
                    /^(?!(|.*?:)cursor-move).+-move$/,
                    /^router-link(|-exact)-active$/,
                    /data-v-.*/,
                ],
            },
            defaultExtractor(content) {
                const contentWithoutStyleBlocks = content.replace(
                    /<style[^]+?<\/style>/gi,
                    ""
                );
                return (
                    contentWithoutStyleBlocks.match(
                        /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
                    ) || []
                );
            },
        }),
        laravel({
            input: "resources/js/app.ts",
            refresh: true,
        }),
        // vue({
        //     template: {
        //         transformAssetUrls: {
        //             base: null,
        //             includeAbsolute: false,
        //         },
        //     },
        // }),
    ],
    // Project root directory (where index.html is located).
    root: process.cwd(),
    // Base public path when served in development or production.
    // You also need to add this base like `history: createWebHistory('my-subdirectory')`
    // in ./src/router.ts
    // base: '/my-subdirectory/',
    base: "/",
    publicDir: "public",
    logLevel: "info",
    resolve: {
        alias: [
            {
                find: "/@src/",
                replacement: `/resources/js/`,
            },
        ],
    },
    // development server configuration
    server: {
        port: 3000,
    },
    // Predefine dependencies in order to prevent reloading them in the browser during development.
    optimizeDeps: {
        include: ["ufo", "vee-validate", "defu"],
    },
    build: {
        target: "esnext",
        minify: "terser",
        rollupOptions: {
            output: {
                // Using only hash to prevent adblockers from blocking assets that match their patterns.
                // Replace with [name] to use the original name for debug purposes.
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/_/[hash].js",
                assetFileNames: "assets/[hash][extname]",
            },
        },
    },
});
