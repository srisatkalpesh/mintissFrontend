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
            <div class="nav-link text-white mx-2 d-flex align-items-center">
              <i class="bi bi-wallet2 me-1"></i>
              <span>₹{{ userBalance || '0.00000000' }}</span>
            </div>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link to="/profile" class="nav-link text-white mx-2">
              <i class="bi bi-person-circle me-1"></i>
              {{ userName }}
            </router-link>
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
            <div class="text-white fw-semibold d-flex align-items-center">
              <i class="bi bi-wallet2 me-2"></i>
              <span>₹{{ userBalance || '0.00000000' }}</span>
            </div>
          </li>
          <li class="mb-3" v-if="isLoggedIn">
            <router-link to="/profile" class="text-white fw-semibold" @click="toggleMenu">
              <i class="bi bi-person-circle me-2"></i>
              {{ userName }}
            </router-link>
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
      userBalance: null,
      mintissValue: 0
    };
  },
  computed: {
    navLinks() {
      return getRoutes();
    },
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    userName() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.name : '';
    }
  },
  watch: {
    isLoggedIn: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchMintissValue();
          this.calculateUserBalance();
        } else {
          this.userBalance = null;
          this.mintissValue = 0;
        }
      }
    }
  },
  async mounted() {
    if (this.isLoggedIn) {
      await this.fetchMintissValue();
      this.calculateUserBalance();
    }
  },
  methods: {
    async fetchMintissValue() {
      try {
        const response = await axios.get('/mintiss-value/latest');
        this.mintissValue = parseFloat(response.data.data.value);
        this.calculateUserBalance();
      } catch (error) {
        console.error('Error fetching mintiss value:', error);
      }
    },
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.mintiss) {
        this.userBalance = (parseFloat(user.mintiss) * this.mintissValue).toFixed(8);
      }
    },
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

.mobile-menu a,
.mobile-menu div {
  display: block;
  padding: 12px 0;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.mobile-menu a:hover,
.mobile-menu div:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 10px;
}

.mobile-menu .active {
  color: #ffd700;
  font-weight: bold;
}

.mobile-menu i {
  font-size: 1.1rem;
}

.mobile-menu span {
  font-weight: 600;
  font-size: 0.95rem;
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

.nav-link span {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
