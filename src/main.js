import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

const app = createApp(App);

app.component("VueTelInput", VueTelInput);

app.use(store).use(router).mount("#app");

if (typeof window !== 'undefined') {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      if (data && data.country_code !== 'IN' && data.country_code !== 'ZA') {
        if (window.location.pathname !== '/coming-soon') {
          router.replace('/coming-soon');
        }
      }
    })
    .catch(() => {});
}
