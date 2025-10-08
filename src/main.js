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

// Make Bootstrap Modal globally available
window.Modal = window.bootstrap?.Modal || window.Modal;

// Global error handler for Bootstrap Toast errors
window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('classList')) {
        console.warn('Bootstrap Toast error caught and handled:', event.error.message);
        event.preventDefault();
        return false;
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('classList')) {
        console.warn('Bootstrap Toast promise rejection caught and handled:', event.reason.message);
        event.preventDefault();
        return false;
    }
});

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
