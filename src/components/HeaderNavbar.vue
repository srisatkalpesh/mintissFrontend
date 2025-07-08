<template>
  <nav
    v-if="!isSeller"
    class="navbar navbar-expand-lg bgprimary shadow-sm sticky-top curved-navbar"
  >
    <div class="container-fluid">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold text-white fs-4" to="/">
        Mintiss
      </router-link>

      <!-- Key Info Row (desktop only) -->
      <div
        class="key-info-row d-none d-lg-flex align-items-center justify-content-center"
      >
        <router-link
          class="nav-link text-white mx-2"
          :class="{ active: $route.path === '/' }"
          to="/"
        >
          Home
        </router-link>
        <router-link
          class="nav-link text-white mx-2"
          :class="{ active: $route.path === '/stores' }"
          to="/stores"
        >
          Stores
        </router-link>

        <div class="nav-link text-white mx-2 d-flex align-items-center">
          <i class="bi bi-wallet2 me-1"></i>
          <span>₹{{ userBalance || '0.00000000' }}</span>
        </div>
        <router-link to="/profile" class="nav-link text-white mx-2">
          <i class="bi bi-person-circle me-1"></i>
          {{ userName || 'User' }}
        </router-link>
      </div>

      <!-- Mobile Wallet/Profile (mobile only) -->
      <div
        class="mobile-profile-wallet-row d-flex align-items-center justify-content-end d-lg-none"
      >
        <div class="nav-link text-white d-flex align-items-center">
          <i class="bi bi-wallet2 me-1"></i>
          <span>₹{{ userBalance || '0.00000000' }}</span>
        </div>
        <router-link
          to="/profile"
          class="nav-link text-white d-flex align-items-center ms-2"
        >
          <i class="bi bi-person-circle me-1"></i>
          {{ userName || 'User' }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { getRoutes } from "@/data/navLinks";
import axios from "@/axios";
import toastService from "@/services/toastService";

export default {
  name: "HeaderNavbar",
  data() {
    return {
      userBalance: null,
      mintissValue: 0,
    };
  },
  computed: {
    navLinks() {
      return getRoutes();
    },
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    userName() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user ? user.name : "";
    },
    isSeller() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user ? user.role?.toLowerCase() === "seller" : false;
    },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user ? user.role?.toLowerCase() === "admin" : false;
    },
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
      },
    },
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
        const response = await axios.get("/mintiss-value/latest");
        this.mintissValue = parseFloat(response.data.data.value);
        this.calculateUserBalance();
      } catch (error) {
        console.error("Error fetching mintiss value:", error);
      }
    },
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.mintiss) {
        this.userBalance = (
          parseFloat(user.mintiss) * this.mintissValue
        ).toFixed(8);
      }
    },
    async handleLogout() {
      try {
        await axios.get("/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toastService.success("Logged out successfully");
        window.location.reload();
      } catch (error) {
        console.error("Logout error:", error);
        toastService.error("Failed to logout");
      }
    },
  },
};
</script>

<style scoped>
/* General Styles */
.navbar {
  transition: all 0.3s ease-in-out;
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  box-shadow: 0 4px 24px rgba(17, 119, 191, 0.1);
}
.curved-navbar {
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  box-shadow: 0 4px 24px rgba(17, 119, 191, 0.1);
}
.key-info-row {
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-left: 2rem;
}
.key-info-row .nav-link {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff !important;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1.2rem;
  padding: 0.5rem 1.2rem;
  margin: 0 0.3rem;
  transition: background 0.2s, color 0.2s;
}
.key-info-row .nav-link.active,
.key-info-row .nav-link:hover {
  background: #ffd700;
  color: #1177bf !important;
}
.key-info-row .nav-link i {
  margin-right: 0.5rem;
}
.mobile-profile-wallet-row {
  display: none;
}
@media (max-width: 991px) {
  .key-info-row {
    display: none !important;
  }
  .mobile-profile-wallet-row {
    display: flex !important;
    flex-direction: row;
    flex-wrap: nowrap; /* Prevent wrapping */
    align-items: center;
    gap: 0.5rem;
    background: #1177bf;
    border-radius: 0 0 1.5rem 1.5rem;
    margin-bottom: 0;
    box-shadow: 0 2px 8px rgba(17, 119, 191, 0.1);
    width: 100%; /* Ensure it uses full width */
  }
  .mobile-profile-wallet-row .nav-link {
    font-size: 1rem;
    font-weight: 600;
    color: #fff !important;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1.2rem;
    margin: 0 0.1rem;
    transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    white-space: nowrap; /* Prevent text from wrapping */
    min-width: 0; /* Allow shrinking if needed */
    flex-shrink: 1; /* Allow to shrink to fit */
  }
  .mobile-profile-wallet-row .nav-link.active,
  .mobile-profile-wallet-row .nav-link:hover {
    background: #ffd700;
    color: #1177bf !important;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
  }
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

.bgprimary {
  background-color: #1177bf;
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

.nav-link span {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
