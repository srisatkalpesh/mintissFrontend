<template>
  <nav class="navbar navbar-expand-lg bg-primary shadow-sm sticky-top" style="border-radius: 10px;">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold text-white fs-4" to="/">
        Mintiss
      </router-link>

      <!-- Toggle Button (Only visible on small screens) -->
      <button class="navbar-toggler border-white" type="button" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Desktop Nav -->
      <div class="d-none d-lg-flex ms-auto">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item" v-for="link in navLinks" :key="link.path">
            <router-link class="nav-link text-white mx-2" :class="{ active: $route.path === link.path }"
              :to="link.path">
              {{ link.name }}
            </router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link text-white mx-2">
              <i class="bi bi-person-circle me-1"></i>
              Profile
            </router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <a href="#" class="nav-link text-white mx-2" @click.prevent="handleLogout">
              <i class="bi bi-box-arrow-right me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>

      <!-- Mobile Sidebar -->
      <div class="mobile-menu" :class="{ open: isCollapsed }">
        <ul class="list-unstyled p-3">
          <li class="mb-3" v-for="link in navLinks" :key="link.path">
            <router-link class="text-white fw-semibold" :class="{ active: $route.path === link.path }" :to="link.path"
              @click="toggleMenu">
              {{ link.name }}
            </router-link>
          </li>
          <li class="mb-3" v-if="isLoggedIn">
            <a href="#" class="text-white fw-semibold" @click.prevent="handleLogout">
              <i class="bi bi-box-arrow-right me-1"></i>
              Logout
            </a>
          </li>
        </ul>
      </div>

      <!-- Overlay -->
      <div class="overlay" v-if="isCollapsed" @click="toggleMenu"></div>
    </div>
  </nav>
</template>

<script>
import { getRoutes } from '@/data/navLinks';
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
  name: "HeaderNavbar",
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    navLinks() {
      return getRoutes();
    },
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    toggleMenu() {
      this.isCollapsed = !this.isCollapsed;
    },
    async handleLogout() {
      try {
        await axios.get('/logout');
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Show success message
        toastService.success('Logged out successfully');
        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
        toastService.error('Failed to logout');
      }
    }
  },
};

</script>

<style scoped>
/* General Styles */
.navbar {
  transition: all 0.3s ease-in-out;
}

.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  font-weight: bold;
  color: #ffd700 !important;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  left: 0;
  bottom: 0;
  background-color: #ffd700;
  transition: width 0.3s;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Mobile Menu Styles */
.mobile-menu {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  background-color: #0d6efd;
  overflow-y: auto;
  transition: left 0.3s ease-in-out;
  z-index: 1050;
}

.mobile-menu.open {
  left: 0;
}

.mobile-menu a {
  display: block;
  padding: 10px 0;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1040;
}
</style>
