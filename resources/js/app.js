import "../css/app.css";
import "./bootstrap";
import 'v-calendar/dist/style.css'

import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/src/js";
import sideblock from "./layouts/sideblock.vue";
import { createPinia } from "pinia";
import "/@src/styles";
import AuthLayout from "./components/layouts/auth/AuthLayout.vue";
import Layout from "/@src/layouts/sideblock.vue";
import { createRouter } from '/@src/router'
import { InferSeoMetaPlugin } from '@unhead/addons'
import { createHead } from '@unhead/vue'
import { createDarkmode } from '/@src/composables/darkmode'
import { definePlugin } from '/@src/utils/plugins'
import { vPreloadLink } from '/@src/directives/preload-link'
import { vTooltip } from '/@src/directives/tooltip'
import { vBackground } from '/@src/directives/background'
import { createNotyf } from '/@src/composables/notyf'
import { plugin as VueTippy } from 'vue-tippy'
import { defineAsyncComponent } from 'vue'
import { createVueroContext } from '/@src/composables/vuero-context'
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// Initialize Pinia store
const pinia = createPinia();
const router = createRouter()
const head = createHead({
    plugins: [InferSeoMetaPlugin()],
  })
// Get app name from environment or fallback
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const darkmode = createDarkmode()


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
         const page = resolvePageComponent(
             `./pages/${name}.vue`,
             import.meta.glob("./pages/**/*.vue"),
             { eager: true }
         );

         page.then((module) => {
             if (name.startsWith("auth/")) {
                 module.default.layout = AuthLayout;
             } else {
                 module.default.layout = module.default.layout || Layout;
             }
         }).catch((error) => {
             console.log(error);
         });

         return page;
    },
    async setup({ el, App, props, plugin }) {
        const context = {}

        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(pinia)
            .use(router)
            .use(useRoute())
            .use(useRouter())
            .use(darkmode)
            .directive('preload-link', vPreloadLink)
            .directive('tooltip', vTooltip)
            .directive('background', vBackground)
            .use(createNotyf())
            .use(createVueroContext(context))
            .component(
                'VCalendar',
                defineAsyncComponent({
                  loader: () => import('v-calendar').then(mod => mod.Calendar),
                  delay: 0,
                  suspensible: false,
                }),
            )
            .component(
                'VDatePicker',
                defineAsyncComponent({
                    loader: () => import('v-calendar').then(mod => mod.DatePicker),
                    delay: 0,
                    suspensible: false,
                }),
            )
            .use(VueTippy, {
                component: 'Tippy',
                defaultProps: {
                  theme: 'light',
                },
            })
            .component(
                // eslint-disable-next-line vue/multi-word-component-names
                'Multiselect',
                defineAsyncComponent({
                  loader: () => import('@vueform/multiselect').then(mod => mod.default),
                  delay: 0,
                  suspensible: false,
                }),
              )
              .component(
                // eslint-disable-next-line vue/multi-word-component-names
                'Slider',
                defineAsyncComponent({
                  loader: () => import('@vueform/slider').then(mod => mod.default),
                  delay: 0,
                  suspensible: false,
                }),
              )



        // const plugins = import.meta.glob('./plugins/*.ts', {
        //     eager: true,
        //     })
        
        // for (const path in plugins) {
        //    app.use(plugins[path].default)
        // }

        app.mount(el);
    },
    progress: {
        color: "#4B5563",
    },
});
