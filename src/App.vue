<template>
  <div id="app" class="modern-app">
    <HeaderNavbar v-if="!isAdminRoute && !isSellerRoute && !isComingSoonRoute" @global-search="onGlobalSearch" />
    <main class="app-main" :class="{ 'with-navbar': !isAdminRoute && !isSellerRoute && !isComingSoonRoute }">
      <transition name="page" mode="out-in">
        <keep-alive>
          <router-view :search-query="searchQuery" />
        </keep-alive>
      </transition>
    </main>
    <AppFooter v-if="!isAdminRoute && !isSellerRoute && !isComingSoonRoute" />
    <GlobalLoader />
    
    <!-- Back to Top Button -->
    <transition name="fade">
      <button 
        v-if="showBackToTop" 
        @click="scrollToTop" 
        class="back-to-top"
        aria-label="Back to top"
      >
        <i class="bi bi-arrow-up"></i>
      </button>
    </transition>
  </div>
</template>

<script>
import HeaderNavbar from "@/components/HeaderNavbar.vue";
import AppFooter from './components/Footer.vue'
import GlobalLoader from '@/components/GlobalLoader.vue'

export default {
  name: "App",
  components: {
    HeaderNavbar,
    AppFooter,
    GlobalLoader,
  },
  data() {
    return {
      searchQuery: '',
      showBackToTop: false,
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
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
    handleScroll() {
      this.showBackToTop = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
  },
};
</script>

<style>
/* ===== GLOBAL STYLES ===== */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #fafbfc;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* ===== APP STYLES ===== */
.modern-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-main {
  flex: 1;
  position: relative;
  z-index: 1;
}

.app-main.with-navbar {
  padding-top: 0;
}

/* ===== PAGE TRANSITIONS ===== */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ===== BACK TO TOP BUTTON ===== */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(17, 119, 191, 0.6);
}

.back-to-top:active {
  transform: translateY(-1px);
}

/* ===== FADE TRANSITIONS ===== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* ===== SCROLLBAR STYLES ===== */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0d5a9a, #0a4a7a);
}

/* ===== SELECTION STYLES ===== */
::selection {
  background: rgba(17, 119, 191, 0.2);
  color: #333;
}

::-moz-selection {
  background: rgba(17, 119, 191, 0.2);
  color: #333;
}

/* ===== FOCUS STYLES ===== */
*:focus {
  outline: 2px solid rgba(17, 119, 191, 0.5);
  outline-offset: 2px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .back-to-top {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #ecf0f1;
  }
  
  .app-main {
    background: #1a1a1a;
  }
  
  ::-webkit-scrollbar-track {
    background: #2c3e50;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #1177bf, #0d5a9a);
  }
  
  ::selection {
    background: rgba(17, 119, 191, 0.3);
    color: #ecf0f1;
  }
  
  ::-moz-selection {
    background: rgba(17, 119, 191, 0.3);
    color: #ecf0f1;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .back-to-top,
  .modern-navbar,
  .modern-footer {
    display: none !important;
  }
  
  .app-main {
    padding: 0 !important;
  }
}

/* ===== HIGH CONTRAST MODE ===== */
@media (prefers-contrast: high) {
  .back-to-top {
    border: 2px solid #000;
  }
  
  *:focus {
    outline: 3px solid #000;
  }
}
</style>
