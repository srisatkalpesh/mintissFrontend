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
