<template>
  <nav class="modern-navbar sticky-top w-100">
    <div class="container-fluid px-3 px-lg-4">
      <!-- Desktop Navigation -->
      <div class="d-none d-lg-flex align-items-center w-100 navbar-desktop">
        <!-- Left Side - Logo -->
        <div class="logo-section d-flex align-items-center">
          <div class="logo-container" @click="$router.push('/')">
            <span class="logo-text">Mintiss</span>
          </div>
        </div>

        <!-- Center - Login/Signup -->
        <div class="auth-section d-flex align-items-center justify-content-center flex-grow-1">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="btn btn-primary login-btn">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Login
            </router-link>
            <router-link to="/signup" class="btn btn-outline-primary signup-btn">
              <i class="bi bi-person-plus me-2"></i>
              Sign Up
            </router-link>
          </template>
          <template v-else>
            <!-- Wallet Balance -->
            <router-link to="/redeem" class="nav-link wallet-link">
              <i class="bi bi-wallet2"></i>
              <span class="wallet-balance">₹{{ userBalance || '0.00000000' }}</span>
            </router-link>

            <!-- User Profile -->
            <div class="user-profile">
              <router-link to="/profile" class="nav-link profile-link">
                <div class="user-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <span class="user-name">{{ userName }}</span>
              </router-link>
            </div>
          </template>
        </div>

        <!-- Right Side - Cart -->
        <div class="cart-section d-flex align-items-center">
          <router-link to="/cart" class="nav-link cart-link position-relative">
            <i class="bi bi-cart3"></i>
            <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
          </router-link>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="d-flex d-lg-none flex-column w-100 navbar-mobile">
        <!-- Single Row - Logo, Cart, Login/Signup -->
        <div class="mobile-single-row d-flex align-items-center justify-content-between py-2">
          <!-- Logo -->
          <div class="mobile-logo" @click="$router.push('/')">
            <span class="logo-text">Mintiss</span>
          </div>

          <!-- Center Actions -->
          <div class="mobile-center-actions d-flex align-items-center gap-2">


            <template v-if="isLoggedIn">
              <div class="mobile-wallet">
                <i class="bi bi-wallet2"></i>
                <span>₹{{ userBalance || '0.00000000' }}</span>
              </div>
            </template>
          </div>

          <!-- Right Actions - Login/Signup or Profile -->
          <div class="mobile-right-actions">
            <template v-if="isLoggedIn">
              <router-link to="/profile" class="mobile-profile">
                <i class="bi bi-person-circle"></i>
                <span class="d-none d-sm-inline">{{ userName }}</span>
              </router-link>
            </template>
            <template v-else>
              <div class="mobile-auth-buttons d-flex gap-1">
                <router-link to="/login" class="btn btn-sm btn-primary mobile-auth-btn">Login</router-link>
                <router-link to="/signup" class="btn btn-sm btn-outline-primary mobile-auth-btn">Sign Up</router-link>
              </div>
            </template>
            <router-link to="/cart" class="mobile-cart position-relative">
              <i class="bi bi-cart3"></i>
              <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
            </router-link>
          </div>
        </div>

        <!-- Search Row -->
        <div class="mobile-search-row py-2">
          <form class="mobile-search-form" @submit.prevent="onSearch">
            <div class="mobile-search-container">
              <i class="bi bi-search"></i>
              <input class="mobile-search-input" type="search" placeholder="Search products..." v-model="searchQuery"
                @keyup.enter="onSearch" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "@/axios";
import toastService from "@/services/toastService";
import eventBus from "@/eventBus";
import cartService from "@/services/cartService";

export default {
  name: "HeaderNavbar",
  data() {
    return {
      userBalance: null,
      mintissValue: 0,
      searchQuery: '',
      updateInterval: null, // New data property to hold the interval timer
      cartItemCount: 0,
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

    // Load cart count
    this.updateCartCount();

    // Listen for balance updates from other components
    this._balanceUpdatedHandler = () => {
      this.fetchUserProfileAndUpdateBalance();
    };
    eventBus.on('balance-updated', this._balanceUpdatedHandler);

    // Listen for cart updates from cart service
    this._cartUpdatedHandler = () => {
      this.updateCartCount();
    };
    cartService.onCartUpdated(this._cartUpdatedHandler);
  },
  beforeUnmount() {
    // Clear the interval to prevent memory leaks when the component is destroyed
    this.stopProfileUpdateInterval();
    if (this._balanceUpdatedHandler) {
      eventBus.off('balance-updated', this._balanceUpdatedHandler);
    }
    if (this._cartUpdatedHandler) {
      cartService.offCartUpdated(this._cartUpdatedHandler);
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

    onSearchFocus() {
      // Add focus styles or functionality if needed
    },

    onSearchBlur() {
      // Add blur styles or functionality if needed
    },

    updateCartCount() {
      try {
        this.cartItemCount = cartService.getCartCount();
      } catch (error) {
        console.error('Error updating cart count:', error);
        this.cartItemCount = 0;
      }
    },
  },
};
</script>

<style scoped>
/* ===== MODERN NAVBAR STYLES ===== */
.modern-navbar {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

/* ===== DESKTOP NAVBAR ===== */
.navbar-desktop {
  min-height: 70px;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo Section - Left Side */
.logo-section {
  flex: 0 0 auto;
}

/* Auth Section - Center */
.auth-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* Cart Section - Right Side */
.cart-section {
  flex: 0 0 auto;
}

/* Logo Section */
.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 12px;
}

.logo-container:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

/* Search Section */
.search-section {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-form {
  width: 100%;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.search-input-container:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-icon {
  color: #6c757d;
  font-size: 1rem;
  margin-right: 0.75rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: #333;
  padding: 0.5rem 0;
}

.search-input::placeholder {
  color: #6c757d;
}

.search-btn {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
}

.search-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(17, 119, 191, 0.4);
}

/* Mobile-First Responsive Design */
/* Base styles are mobile-first */

/* Small mobile devices (320px and up) */
@media (min-width: 320px) {
  .modern-header {
    padding: 0.75rem 0;
  }

  .header-container {
    padding: 0 0.5rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .logo-section {
    justify-content: center;
    width: 100%;
  }

  .logo {
    font-size: 1.5rem;
  }

  .logo-icon {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }

  .search-section {
    width: 100%;
    order: 2;
  }

  .search-container {
    padding: 0.75rem;
    border-radius: 8px;
  }

  .search-input {
    font-size: 0.9rem;
  }

  .search-btn {
    width: 30px;
    height: 30px;
  }

  .actions-section {
    flex-direction: row;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    order: 3;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    font-size: 1rem;
  }

  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }

  .user-menu {
    position: static;
    transform: none;
    box-shadow: none;
    border: 1px solid #e8eaed;
    border-radius: 8px;
    margin-top: 0.5rem;
  }

  .user-menu-item {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .user-menu-icon {
    width: 18px;
    height: 18px;
    font-size: 0.9rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .header-content {
    flex-direction: row;
    align-items: center;
  }

  .logo-section {
    justify-content: flex-start;
    width: auto;
  }

  .logo {
    font-size: 1.75rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }

  .search-section {
    flex: 1;
    order: 0;
    margin: 0 1rem;
  }

  .search-container {
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }

  .search-input {
    font-size: 0.95rem;
  }

  .search-btn {
    width: 35px;
    height: 35px;
  }

  .actions-section {
    width: auto;
    order: 0;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
    font-size: 1.1rem;
  }

  .cart-badge {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }

  .user-menu {
    position: absolute;
    transform: translateX(-50%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    margin-top: 0;
  }

  .user-menu-item {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }

  .user-menu-icon {
    width: 20px;
    height: 20px;
    font-size: 1rem;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-header {
    padding: 1rem 0;
  }

  .header-container {
    padding: 0 1rem;
  }

  .header-content {
    gap: 1.5rem;
  }

  .logo {
    font-size: 2rem;
  }

  .logo-icon {
    width: 45px;
    height: 45px;
    font-size: 1.6rem;
  }

  .search-section {
    margin: 0 1.5rem;
  }

  .search-container {
    padding: 1rem 1.25rem;
    border-radius: 16px;
  }

  .search-input {
    font-size: 1rem;
  }

  .search-btn {
    width: 40px;
    height: 40px;
  }

  .actions-section {
    gap: 1rem;
  }

  .nav-link {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
  }

  .cart-badge {
    width: 22px;
    height: 22px;
    font-size: 0.8rem;
  }

  .user-menu-item {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .user-menu-icon {
    width: 22px;
    height: 22px;
    font-size: 1.1rem;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-header {
    padding: 1.25rem 0;
  }

  .header-container {
    padding: 0 1rem;
  }

  .header-content {
    gap: 2rem;
  }

  .logo {
    font-size: 2.25rem;
  }

  .logo-icon {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }

  .search-section {
    margin: 0 2rem;
  }

  .search-container {
    padding: 1.25rem 1.5rem;
    border-radius: 20px;
  }

  .search-input {
    font-size: 1.1rem;
  }

  .search-btn {
    width: 45px;
    height: 45px;
  }

  .actions-section {
    gap: 1.25rem;
  }

  .nav-link {
    padding: 1.25rem 1.5rem;
    font-size: 1.1rem;
  }

  .nav-icon {
    width: 26px;
    height: 26px;
    font-size: 1.3rem;
  }

  .cart-badge {
    width: 24px;
    height: 24px;
    font-size: 0.85rem;
  }

  .user-menu-item {
    padding: 1.5rem 2rem;
    font-size: 1.1rem;
  }

  .user-menu-icon {
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
  }
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .logo-section {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .search-section {
    order: 2;
    width: 100%;
    margin: 0;
  }

  .actions-section {
    order: 3;
    width: 100%;
    justify-content: space-around;
  }

  .nav-link {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    text-align: center;
  }

  .nav-text {
    font-size: 0.75rem;
  }

  .user-menu {
    position: static;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8eaed;
    border-radius: 8px;
    margin-top: 0.5rem;
    width: 100%;
  }

  .user-menu-item {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-menu-item:last-child {
    border-bottom: none;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {

  .nav-link,
  .search-btn,
  .user-menu-item {
    min-height: 44px;
    min-width: 44px;
  }

  .nav-link:active,
  .search-btn:active,
  .user-menu-item:active {
    transform: scale(0.98);
  }

  .logo-section:active {
    transform: scale(0.98);
  }
}

/* Actions Section */
.actions-section {
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.categories-link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cart-link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.wallet-link {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.2));
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.wallet-balance {
  font-weight: 600;
  color: #ffc107;
}

.profile-link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-name {
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Auth Buttons */
.login-btn,
.signup-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  color: white;
}

.signup-btn {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.signup-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-2px);
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #dc3545, #ff6b6b);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* ===== MOBILE NAVBAR ===== */
.navbar-mobile {
  padding: 0.5rem 0;
}

.mobile-single-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.25rem;
  border-radius: 8px;
}

.mobile-logo:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-logo .logo-icon {
  width: 32px;
  height: 32px;
  font-size: 1rem;
}

.mobile-logo .logo-text {
  font-size: 1.25rem;
}

.mobile-center-actions {
  gap: 0.75rem;
}

.mobile-right-actions {
  display: flex;
  align-items: center;
}

.mobile-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.mobile-profile:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.mobile-auth-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border-radius: 15px;
  font-weight: 600;
}

.mobile-cart {
  color: white;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-cart:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.mobile-wallet {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc107;
  font-weight: 600;
  font-size: 0.9rem;
}

.mobile-search-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-search-container i {
  color: #6c757d;
  margin-right: 0.5rem;
}

.mobile-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  color: #333;
  padding: 0.25rem 0;
}


/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .search-section {
    max-width: 400px;
    margin: 0 1rem;
  }
}

@media (max-width: 992px) {
  .navbar-desktop {
    display: none !important;
  }
}

@media (max-width: 576px) {
  .mobile-logo .logo-text {
    font-size: 1.1rem;
  }

  .mobile-wallet {
    font-size: 0.8rem;
  }

  .mobile-auth-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .mobile-center-actions {
    gap: 0.5rem;
  }

  .mobile-profile span {
    display: none;
  }
}

@media (max-width: 480px) {
  .mobile-logo .logo-text {
    font-size: 1rem;
  }

  .mobile-auth-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
  }

  .mobile-cart {
    font-size: 1.1rem;
    padding: 0.375rem;
  }

  .mobile-wallet {
    font-size: 0.75rem;
  }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-navbar {
  animation: fadeInDown 0.6s ease-out;
}

/* ===== ACCESSIBILITY ===== */
.nav-link:focus,
.mobile-nav-link:focus,
.search-input:focus,
.mobile-search-input:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .search-input-container {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .search-input {
    color: white;
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>