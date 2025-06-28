<template>
  <div id="app">
    <HeaderNavbar v-if="!isAdminRoute && !isSellerRoute" />
    <keep-alive>
      <router-view />
    </keep-alive>
    <AppFooter v-if="!isAdminRoute && !isSellerRoute" />
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
    },
    isSellerRoute() {
      return this.$route.path.startsWith('/seller');
    }
  }
};
</script>
