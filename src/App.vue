<template>
  <div id="app">
    <HeaderNavbar />
    <router-view />
    <AppFooter />

  </div>
</template>

<script>
import HeaderNavbar from "@/components/HeaderNavbar.vue";
import AppFooter from './components/Footer.vue'

export default {
  name: "App",
  components: {
    HeaderNavbar,
    AppFooter,
  },
};
</script>
