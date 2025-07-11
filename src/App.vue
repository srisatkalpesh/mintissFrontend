<template>
  <div id="app">
    <HeaderNavbar v-if="!isAdminRoute && !isSellerRoute" @global-search="onGlobalSearch" />
    <keep-alive>
      <router-view :search-query="searchQuery" />
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
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    },
    isSellerRoute() {
      return this.$route.path.startsWith('/seller');
    }
  },
  methods: {
    onGlobalSearch(query) {
      this.searchQuery = query;
    },
  },
};
</script>
