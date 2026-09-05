import { createApp } from "vue";
import App from "./App.vue";

// PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";

// PrimeIcons
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEVUE_LICENSE_KEY,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".dark-mode-toggle",
    },
  },
});

app.use(ToastService);

app.mount("#app");
