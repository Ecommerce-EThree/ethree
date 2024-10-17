import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/src/js";
import sideblock from "./layouts/sideblock.vue";
import { createPinia } from "pinia";
import "/@src/styles";
import { createRouter } from '/@src/router'

// Initialize Pinia store
const pinia = createPinia();
const router = createRouter()
// Get app name from environment or fallback
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log(name);
        let page = null;
        try {
            page = resolvePageComponent(
                `./pages/${name}.vue`,
                import.meta.glob("./pages/**/*.vue"),
                { eager: true }
            );
        } catch (error) {
            console.error(error);
        }
        

        return page;
    },
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(pinia)
            .use(router)
            .mount(el);
    },
    progress: {
        color: "#4B5563",
    },
});
