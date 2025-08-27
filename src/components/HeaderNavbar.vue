<template>
  <nav class="navbar shadow-sm sticky-top w-100 curved-navbar" style="background-color: #1177bf !important;">
    <div class="container-fluid px-2 px-sm-4">
      <div class="d-none d-md-flex align-items-center justify-content-between w-100" style="min-height: 64px;">
        <span
          class="fw-bold text-white fs-4"
          style="cursor: pointer;"
          @click="$router.push('/')"
        >Mintiss</span>
        <form class="d-flex flex-grow-1 justify-content-center mx-4" style="max-width: 400px;" @submit.prevent="onSearch">
          <input class="form-control w-100" type="search" placeholder="Global Search" aria-label="Search" v-model="searchQuery" @keyup.enter="onSearch" />
        </form>
        <div class="d-flex align-items-center gap-4">
          <template v-if="isLoggedIn">
            <router-link to="/redeem" class="d-flex align-items-center text-decoration-none wallet-link">
              <i class="bi bi-wallet2 text-white me-2 fs-4"></i>
              <span class="text-white fw-bold">₹{{ userBalance || '0.00000000' }}</span>
            </router-link>
            <router-link to="/profile" class="d-flex align-items-center text-decoration-none">
              <i class="bi bi-person-circle text-white fs-3 me-2"></i>
              <span class="text-white fw-semibold">{{ userName }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-warning fw-bold px-4 py-2 rounded-pill shadow-sm">Login / Sign Up</router-link>
          </template>
        </div>
      </div>
      <div class="d-flex d-md-none flex-column align-items-center w-100">
        <span
          class="fw-bold text-white fs-3"
          style="cursor: pointer;"
          @click="$router.push('/')"
        >Mintiss</span>
        <form class="d-flex w-100 justify-content-center mb-1" style="max-width: 350px;" @submit.prevent="onSearch">
          <input class="form-control w-100" type="search" placeholder="Global Search" aria-label="Search" v-model="searchQuery" @keyup.enter="onSearch" />
        </form>
        <div class="d-flex w-100 align-items-center justify-content-center gap-3 pb-1">
          <template v-if="isLoggedIn">
            <router-link to="/redeem" class="d-flex align-items-center text-decoration-none wallet-link">
              <i class="bi bi-wallet2 text-white me-1 fs-5"></i>
              <span class="text-white fw-bold small">₹{{ userBalance || '0.00000000' }}</span>
            </router-link>
            <router-link to="/profile" class="d-flex align-items-center text-decoration-none">
              <i class="bi bi-person-circle text-white fs-4 me-1"></i>
              <span class="text-white fw-semibold small">{{ userName }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-warning fw-bold w-100 rounded-pill shadow-sm py-2">Login / Sign Up</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "@/axios";
import toastService from "@/services/toastService";
import eventBus from "@/eventBus";

export default {
  name: "HeaderNavbar",
  data() {
    return {
      userBalance: null,
      mintissValue: 0,
      searchQuery: '',
      updateInterval: null, // New data property to hold the interval timer
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    userName() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user ? user.name : "";
    },
  },
  watch: {
    isLoggedIn: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchMintissValue();
          // Start the recurring profile update when the user logs in
          this.startProfileUpdateInterval();
        } else {
          this.userBalance = null;
          this.mintissValue = 0;
          // Stop the recurring profile update when the user logs out
          this.stopProfileUpdateInterval();
        }
      },
    },
  },
  async mounted() {
    if (this.isLoggedIn) {
      // Initial fetch for mintiss value and user profile
      await this.fetchMintissValue();
      this.fetchUserProfileAndUpdateBalance();
      // Start the recurring update on component mount
      this.startProfileUpdateInterval();
    }
    // Listen for balance updates from other components
    this._balanceUpdatedHandler = () => {
      this.fetchUserProfileAndUpdateBalance();
    };
    eventBus.on('balance-updated', this._balanceUpdatedHandler);
  },
  beforeUnmount() {
    // Clear the interval to prevent memory leaks when the component is destroyed
    this.stopProfileUpdateInterval();
    if (this._balanceUpdatedHandler) {
      eventBus.off('balance-updated', this._balanceUpdatedHandler);
    }
  },
  methods: {
    async fetchMintissValue() {
      try {
        const response = await axios.get("/mintiss-value/latest");
        this.mintissValue = parseFloat(response.data.data.value);
        // Recalculate the balance after the mintiss value is fetched
        this.fetchUserProfileAndUpdateBalance();
      } catch (error) {
        console.error("Error fetching mintiss value:", error);
      }
    },
    // This is the new function to fetch profile and update balance
    async fetchUserProfileAndUpdateBalance() {
      if (!this.isLoggedIn) {
        return;
      }
      try {
        const response = await axios.get('/Profile');
        const userProfile = response.data.data;
        if (userProfile && userProfile.mintiss) {
          // Update the user's balance based on the new mintiss value from the API
          this.userBalance = (parseFloat(userProfile.mintiss) * this.mintissValue).toFixed(8);
          // Optional: Update localStorage to keep it in sync with the server data
          const localStorageUser = JSON.parse(localStorage.getItem('user'));
          if (localStorageUser) {
            localStorageUser.mintiss = userProfile.mintiss;
            localStorage.setItem('user', JSON.stringify(localStorageUser));
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // You could also handle unauthorized errors here and log the user out
        if (error.response && error.response.status === 401) {
          this.handleLogout();
        }
      }
    },
    // The original calculateUserBalance is now redundant since the API call handles it
    // But it's kept for any initial calculations if needed. The main logic is in the new function.
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.mintiss) {
        this.userBalance = (
          parseFloat(user.mintiss) * this.mintissValue
        ).toFixed(8);
      }
    },
    // Start the interval timer for profile updates
    startProfileUpdateInterval() {
      // Clear any existing interval to prevent duplicates
      this.stopProfileUpdateInterval();
      // Set a new interval to fetch the profile every 2 minutes (120,000 ms)
      this.updateInterval = setInterval(() => {
        this.fetchUserProfileAndUpdateBalance();
      }, 120000);
    },
    // Stop the interval timer
    stopProfileUpdateInterval() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
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
    onSearch() {
      this.$emit('global-search', this.searchQuery.trim());
    },
  },
};
</script>

<style scoped>
.curved-navbar {
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  box-shadow: 0 4px 24px rgba(17, 119, 191, 0.1);
}   

.wallet-link {
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.wallet-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
</style>