<template>
  <div id="app">
    <HeaderNavbar v-if="!isAdminRoute" />
    <router-view />
    <AppFooter v-if="!isAdminRoute" />
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
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    }
  }
};
</script>
