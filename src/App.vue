<template>
  <div id="app">
    <HeaderNavbar v-if="!isAdminRoute && !isSellerRoute && !isComingSoonRoute" @global-search="onGlobalSearch" />
    <keep-alive>
      <router-view :search-query="searchQuery" />
    </keep-alive>
    <AppFooter v-if="!isAdminRoute && !isSellerRoute && !isComingSoonRoute" />
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
    },
    isComingSoonRoute() {
      return this.$route.path === '/coming-soon';
    }
  },
  methods: {
    onGlobalSearch(query) {
      const newQuery = { ...this.$route.query, search: query };
      if (this.$route.path !== '/stores') {
        this.$router.push({ path: '/stores', query: newQuery });
      } else {
        this.$router.replace({ path: '/stores', query: newQuery });
      }
    },
  },
};
</script>
