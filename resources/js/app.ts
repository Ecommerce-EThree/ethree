import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/src/js";
import sideblock from "./layouts/sideblock.vue";
import { VueroPlugin } from "/@src/utils/plugins";
import { createPinia } from "pinia";
import "/@src/styles";
import { VueroAppContext } from "./utils/plugins";

// Initialize Pinia store
const pinia = createPinia();

// Get app name from environment or fallback
const appName: string = import.meta.env.VITE_APP_NAME || "Laravel";

// Load plugins with typing support for the glob import
const plugins = import.meta.glob<{ default?: VueroPlugin }>('./plugins/*.ts', {
  eager: true,
})

const vuero: VueroAppContext = {
    pinia,
  }


// Load plugins asynchronously in an `async` function
const loadPlugins = async () => {
    for (const path in plugins) {
        try {
            const plugin = plugins[path]?.default;
            if (!plugin)
                throw new Error(`Plugin does not have a default export.`);
            await plugin(vuero);
        } catch (error) {
            console.log(`Error while loading plugin "${path}"`);
            console.error(error);
        }
    }
};

// Call the function to load plugins
loadPlugins();

createInertiaApp({
    title: (title: string) => `${title} - ${appName}`,
    resolve: (name: string) => {
        const page = resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob("./pages/**/*.vue"),
            { eager: true }
        );

        page.then((module) => {
            if (name.startsWith("Auth/")) {
                module.default.layout = sideblock;
            } else {
                module.default.layout = module.default.layout || sideblock;
            }
        }).catch((error) => {
            console.log(error);
        });

        return page;
    },
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(pinia)
            .mount(el);
    },
    progress: {
        color: "#4B5563",
    },
});
