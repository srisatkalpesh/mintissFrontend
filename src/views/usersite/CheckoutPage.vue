<template>
  <div class="container my-5">


    <!-- Referral Success Message -->
    <div v-if="referralApplied" class="alert alert-success alert-dismissible fade show mb-4" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle-fill fs-4 me-3"></i>
        <div>
          <strong>Referral Applied Successfully!</strong>
          <p class="mb-0 mt-1">You and your friend both get ₹100 bonus. Your final price has been updated!</p>
        </div>
      </div>
      <button type="button" class="btn-close" @click="referralApplied = false"></button>
    </div>

    <h2 class="text-center mb-4" style="color: #1177bf;">Checkout</h2>
    <div v-if="product" class="card shadow-lg p-4">
      <div class="row">
        <div class="col-md-6 mb-4">
          <h4 class="fw-bold mb-3" style="color: #1177bf;">Order Details</h4>
          <div class="d-flex mb-3">
            <div class="product-image-wrapper me-3">
              <img :src="product.images[0]" class="img-fluid rounded" alt="Product Image">
            </div>
            <div>
              <h5 class="fw-bold">{{ product.name }}</h5>
              <p class="text-muted">{{ product.description }}</p>
              <h5 v-if="product.price" class="text-success fw-bold">₹{{ product.price }}</h5>
              <h5 v-else class="text-success fw-bold">Price: N/A</h5>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <h4 class="fw-bold mb-3" style="color: #1177bf;">Points Redemption</h4>
          <div class="card mb-4 points-redemption-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold">Available Balance:</span>
                <div class="d-flex align-items-center">
                  <span class="text-success fw-bold me-2">₹{{ userBalance || '0.00' }}</span>
                </div>
              </div>
              <div v-if="userBalance <= 0" class="alert alert-info alert-sm mb-3">
                <small>
                  <i class="fas fa-info-circle me-1"></i>
                  No balance available. You can earn points by shopping or check your profile for available rewards.
                </small>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold">Product Price:</span>
                <span class="text-primary fw-bold">₹{{ product.price || 0 }}</span>
              </div>
              <div class="mb-3">
                <label for="redeemAmount" class="form-label fw-bold">Redeem Amount (₹)</label>
                <div class="input-group">
                  <input 
                    type="number" 
                    class="form-control" 
                    id="redeemAmount" 
                    v-model="redeemAmount"
                    :max="Math.min(userBalance || 0, product.price || 0)"
                    :min="0"
                    step="0.01"
                    placeholder="Enter amount to redeem"
                    @input="calculateFinalPrice"
                    :class="{ 'is-invalid': redeemAmount > maxRedeemable }"
                  >
                  <button 
                    class="btn btn-outline-secondary max-btn" 
                    type="button"
                    @click="setMaxRedeem"
                    :disabled="maxRedeemable <= 0"
                  >
                    Max
                  </button>
                </div>
                <small class="text-muted">
                  Maximum redeemable: ₹{{ maxRedeemable.toFixed(2) }}
                </small>
                <div v-if="redeemAmount > maxRedeemable" class="invalid-feedback d-block">
                  Redeem amount cannot exceed your available balance or product price.
                </div>
              </div>
              <div v-if="referralBonus > 0" class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold text-success">
                  <i class="bi bi-gift-fill me-1"></i>Referral Bonus:
                </span>
                <span class="text-success fw-bold">-₹{{ referralBonus.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold">Final Price:</span>
                <span class="final-price">₹{{ finalPrice.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">You Save:</span>
                <span class="savings-amount">₹{{ (product.price - finalPrice).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <h4 class="fw-bold mb-3" style="color: #1177bf;">Shipping Address</h4>
          <form @submit.prevent="submitOrder">
            <div class="mb-3">
              <label for="fullName" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="fullName" v-model="address.fullName" required>
            </div>
            <div class="mb-3">
              <label for="addressLine1" class="form-label">Address Line 1</label>
              <input type="text" class="form-control" id="addressLine1" v-model="address.addressLine1" required>
            </div>
            <div class="mb-3">
              <label for="addressLine2" class="form-label">Address Line 2 (Optional)</label>
              <input type="text" class="form-control" id="addressLine2" v-model="address.addressLine2">
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city" v-model="address.city" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="postalCode" class="form-label">Postal Code</label>
                <input type="text" class="form-control" id="postalCode" v-model="address.postalCode" required>
              </div>
            </div>
            <div class="mb-4 form-check">
              <input type="checkbox" class="form-check-input" id="cod" v-model="isCodSelected">
              <label class="form-check-label fw-bold" for="cod">Cash on Delivery</label>
            </div>
            <button 
              type="submit" 
              class="btn w-100 fw-bold" 
              style="background-color: #1177bf; color: #fff;"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isSubmitting ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger text-center">
      Product information not found.
    </div>
  </div>
</template>

<script>
import axios from '../../axios.js';
import eventBus from '../../eventBus.js';
import toastService from '../../services/toastService.js';
import referralService from '../../services/referralService.js';

export default {
  name: 'CheckoutPage',
  data() {
    return {
      product: null,
      address: {
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
      },
      isCodSelected: false,
      redeemAmount: 0,
      userBalance: 0,
      mintissValue: 0,
      finalPrice: 0,
      isSubmitting: false, // Added for loading state
      isRefreshingBalance: false, // Added for refreshing balance
      referralApplied: false, // Whether referral has been applied
      hasUsedReferral: false, // Whether user has already used a referral
      referralBonus: 0, // Referral bonus amount
    };
  },
  async mounted() {
    this.parseProductData();
    if (this.isLoggedIn) {
      // Try to fetch user balance from API first
      await this.fetchUserBalance();
      // Also fetch mintiss value for calculation fallback
      await this.fetchMintissValue();
      // Check referral status
      await this.checkReferralStatus();
    } else {
      // Demo balance for testing when not logged in
      this.userBalance = 1000; // Demo balance of ₹1000
      console.log('Using demo balance:', this.userBalance);
    }
    this.calculateFinalPrice();
    
    // Listen for balance updates
    this._balanceUpdatedHandler = () => {
      this.calculateUserBalance();
      this.calculateFinalPrice();
    };
    eventBus.on('balance-updated', this._balanceUpdatedHandler);
  },
  beforeUnmount() {
    if (this._balanceUpdatedHandler) {
      eventBus.off('balance-updated', this._balanceUpdatedHandler);
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    maxRedeemable() {
      return Math.min(this.userBalance || 0, this.product?.price || 0);
    }
  },
  watch: {
    redeemAmount(newVal) {
      // Ensure redeem amount doesn't exceed maximum
      if (newVal > this.maxRedeemable) {
        this.redeemAmount = this.maxRedeemable;
      }
      if (newVal < 0) {
        this.redeemAmount = 0;
      }
      this.calculateFinalPrice();
    }
  },
  methods: {
    parseProductData() {
      try {
        if (this.$route.query.product) {
          const decodedProduct = decodeURIComponent(this.$route.query.product);
          this.product = JSON.parse(decodedProduct);
          this.calculateFinalPrice();
        }
      } catch (error) {
        console.error('Failed to parse product data from URL:', error);
        this.product = null;
      }
    },
    async fetchMintissValue() {
      try {
        const response = await axios.get("/mintiss-value/latest");
        this.mintissValue = parseFloat(response.data.data.value);
        this.calculateUserBalance();
      } catch (error) {
        console.error("Error fetching mintiss value:", error);
        this.mintissValue = 0;
        // Still try to calculate balance with fallback
        this.calculateUserBalance();
      }
    },
    
    async fetchUserBalance() {
      try {
        const response = await axios.get("/user/balance");
        if (response.data.success) {
          this.userBalance = parseFloat(response.data.balance || 0);
          console.log('Fetched balance from API:', this.userBalance);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
        // Fallback to calculation method
        this.calculateUserBalance();
      }
    },
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log('User data:', user);
      console.log('Mintiss value:', this.mintissValue);
      
      if (user && user.mintiss && this.mintissValue) {
        this.userBalance = parseFloat((parseFloat(user.mintiss) * this.mintissValue).toFixed(2));
        console.log('Calculated balance:', this.userBalance);
      } else {
        // Fallback: try to get balance from user data if available
        if (user && user.balance) {
          this.userBalance = parseFloat(user.balance);
        } else if (user && user.mintiss) {
          // If mintiss value is not available, use a default value for demo
          this.userBalance = parseFloat(user.mintiss) * 0.001; // Default mintiss value
        } else {
          this.userBalance = 0;
        }
        console.log('Fallback balance:', this.userBalance);
      }
      this.calculateFinalPrice();
    },
    calculateFinalPrice() {
      if (this.product && this.product.price) {
        // Apply referral bonus to final price calculation
        const priceAfterRedeem = Math.max(0, this.product.price - this.redeemAmount);
        this.finalPrice = Math.max(0, priceAfterRedeem - this.referralBonus);
      } else {
        this.finalPrice = 0;
      }
    },

    async checkReferralStatus() {
      try {
        const response = await referralService.getReferralStatus();
        this.hasUsedReferral = response.hasUsedReferral || false;
        if (this.hasUsedReferral) {
          this.referralBonus = response.bonusAmount || 0;
          this.calculateFinalPrice();
        }
      } catch (error) {
        console.error('Error checking referral status:', error);
        // Continue without referral functionality if API fails
      }
    },
    onReferralApplied(data) {
      this.referralBonus = data.bonusAmount;
      this.hasUsedReferral = true;
      this.referralApplied = true;
      this.calculateFinalPrice();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.referralApplied = false;
      }, 5000);
    },
    setMaxRedeem() {
      console.log('Setting max redeem. Max redeemable:', this.maxRedeemable);
      // Truncate to 2 decimal places instead of rounding
      this.redeemAmount = Math.floor(this.maxRedeemable * 100) / 100;
      this.calculateFinalPrice();
      console.log('Redeem amount set to:', this.redeemAmount);
      
      // Show feedback to user
      if (this.maxRedeemable > 0) {
        toastService.success(`Maximum amount (₹${this.redeemAmount.toFixed(2)}) applied!`);
      }
    },
    async refreshBalance() {
      this.isRefreshingBalance = true;
      try {
        if (this.isLoggedIn) {
          await this.fetchUserBalance();
          toastService.success('Balance refreshed successfully!');
        } else {
          // For demo purposes, simulate a balance refresh
          this.userBalance = Math.floor(Math.random() * 2000) + 500; // Random balance between 500-2500
          toastService.success('Demo balance refreshed! New balance: ₹' + this.userBalance);
        }
      } catch (error) {
        console.error('Error refreshing balance:', error);
        toastService.error('Failed to refresh balance. Please try again.');
      } finally {
        this.isRefreshingBalance = false;
      }
    },
    submitOrder() {
      // Check if user is logged in
      if (!this.isLoggedIn) {
        toastService.error('Please login to continue with your order.');
        this.$router.push('/login');
        return;
      }
      
      // Validate form
      if (!this.validateForm()) {
        return;
      }
      
      // Show loading state
      this.isSubmitting = true;
      
      // Prepare order data
      const orderData = {
        product: this.product,
        address: this.address,
        paymentMethod: this.isCodSelected ? 'Cash on Delivery' : 'Online',
        redeemAmount: this.redeemAmount,
        finalPrice: this.finalPrice,
        userBalance: this.userBalance,
        mintissValue: this.mintissValue
      };
      
      // Call checkout API
      this.processCheckout(orderData);
    },
    
    validateForm() {
      // Check if all required address fields are filled
      const requiredFields = ['fullName', 'addressLine1', 'city', 'postalCode'];
      const missingFields = requiredFields.filter(field => !this.address[field] || this.address[field].trim() === '');
      
      if (missingFields.length > 0) {
        toastService.error('Please fill in all required fields: ' + missingFields.join(', '));
        return false;
      }
      
      // Check if redeem amount is valid
      if (this.redeemAmount > this.maxRedeemable) {
        toastService.error('Redeem amount cannot exceed your available balance or product price.');
        return false;
      }
      
      return true;
    },
    
    async processCheckout(orderData) {
      try {
        // Make API call to checkout endpoint with timeout
        const response = await axios.post('/checkout', orderData, {
          timeout: 30000 // 30 seconds timeout
        });
        
        if (response.data.success) {
          // Store order details for the completion page
          localStorage.setItem('lastOrder', JSON.stringify({
            orderId: response.data.orderId || 'ORD' + Date.now().toString().slice(-8),
            totalAmount: this.finalPrice,
            product: this.product,
            address: this.address
          }));
          
          // Show success message
          toastService.success('Order placed successfully! Redirecting to confirmation page...');
          
          // Redirect to order completion page
          this.$router.push({
            name: 'OrderComplete',
            params: {
              orderId: response.data.orderId || 'ORD' + Date.now().toString().slice(-8),
              totalAmount: this.finalPrice
            }
          });
        } else {
          throw new Error(response.data.message || 'Checkout failed');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        
        // Show specific error message based on error type
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 400:
              errorMessage = data.message || 'Invalid order data. Please check your information.';
              break;
            case 401:
              errorMessage = 'Please login to continue with your order.';
              break;
            case 402:
              errorMessage = 'Payment failed. Please try a different payment method.';
              break;
            case 403:
              errorMessage = 'Insufficient balance or invalid redemption amount.';
              break;
            case 404:
              errorMessage = 'Product not found or no longer available.';
              break;
            case 422:
              errorMessage = data.message || 'Order validation failed. Please check your details.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = data.message || `Order failed (${status}). Please try again.`;
          }
        } else if (error.request) {
          // Network error - no response received
          if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. Please try again.';
          } else {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          }
        } else if (error.message) {
          // Other error
          errorMessage = error.message;
        }
        
        // Show error toast and stay on checkout page
        toastService.error(errorMessage);
        
        // Reset loading state but stay on checkout page
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.product-image-wrapper {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
}
.product-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card {
  border: none;
  border-radius: 1rem;
}

.points-redemption-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.points-redemption-card .card-body {
  padding: 1.5rem;
}

.final-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #198754;
}

.savings-amount {
  color: #198754;
  font-weight: 600;
}

.input-group .btn {
  border-left: 0;
}

.input-group .form-control:focus {
  border-right: 0;
  box-shadow: none;
}

.input-group .form-control:focus + .btn {
  border-color: #86b7fe;
}

@media (max-width: 768px) {
  .points-redemption-card .card-body {
    padding: 1rem;
  }
}

.alert-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
}

.refresh-btn {
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  transform: scale(1.1);
}

.max-btn {
  font-weight: 600;
  min-width: 60px;
}

.max-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert-success {
  border: none;
  border-radius: 1rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 4px solid #28a745;
}
</style>