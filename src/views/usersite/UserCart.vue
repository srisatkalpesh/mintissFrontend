<template>
    <div class="amazon-cart-page">
        <div class="cart-container">
            <!-- Amazon-style Cart Header -->
            <div class="amazon-cart-header">
                <div class="header-content">
                    <div class="header-left">
                        <div class="cart-icon">
                            <i class="bi bi-cart3"></i>
                        </div>
                        <div class="header-text">
                            <h1 class="cart-title">Shopping Cart</h1>
                            <p class="cart-subtitle">Review your items before checkout</p>
                        </div>
                    </div>
                    
                    <div class="header-right">
                        <div class="item-count-badge">
                            <span class="count-number">{{ cartItems.length }}</span>
                            <span class="count-text">items</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty Cart Message -->
            <div v-if="cartItems.length === 0" class="empty-cart-container">
                <div class="empty-cart-content">
                    <div class="empty-cart-icon">
                        <i class="bi bi-cart-x"></i>
                    </div>
                    <h2 class="empty-cart-title">Your cart is empty</h2>
                    <p class="empty-cart-message">Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>
                    <router-link to="/" class="continue-shopping-btn">
                        <i class="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                </router-link>
                </div>
            </div>

            <!-- Amazon-style Cart Items -->
            <div v-else class="amazon-cart-content">
                <div class="cart-items-section">
                    <div class="cart-items-container">
                        <div v-for="item in cartItems" :key="item.id" class="amazon-cart-item">
                            <div class="item-content">
                                <!-- Product Image -->
                                <div class="item-image-container">
                                    <img :src="item.image || 'https://via.placeholder.com/100x100?text=No+Image'"
                                         class="item-image"
                                         :alt="item.name"
                                         @error="handleImageError">
                                </div>
                                
                                <!-- Product Details -->
                                <div class="item-details">
                                    <h3 class="item-name">{{ item.name }}</h3>
                                    <p class="item-description">{{ item.description || 'No description available' }}</p>
                                    <div class="item-price">
                                        <span class="current-price">₹{{ item.price }}</span>
                                        <span v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
                                            ₹{{ item.originalPrice }}
                                        </span>
                                    </div>
                                    
                                    <!-- Quantity Controls -->
                                    <div class="quantity-section">
                                        <label class="quantity-label">Quantity</label>
                                        <div class="quantity-controls">
                                            <button class="quantity-btn decrease"
                                                        @click="updateQuantity(item.id, item.quantity - 1)"
                                                        :disabled="item.quantity <= 1">
                                                    <i class="bi bi-dash"></i>
                                                </button>
                                                <input type="number" 
                                                   class="quantity-input" 
                                                       v-model.number="item.quantity"
                                                       min="1"
                                                       @change="updateQuantity(item.id, item.quantity)">
                                            <button class="quantity-btn increase"
                                                        @click="updateQuantity(item.id, item.quantity + 1)">
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    
                                    <!-- Mintiss Points -->
                                    <div v-if="item.mintissPoints" class="mintiss-points">
                                        <i class="bi bi-gift"></i>
                                        <span>+{{ (parseFloat(item.mintissPoints) * item.quantity).toFixed(8) }} mintiss</span>
                                    </div>
                                    
                                    <!-- Price and Remove -->
                                    <div class="item-actions">
                                        <div class="item-total">
                                            <span class="total-price">₹{{ item.price * item.quantity }}</span>
                                        </div>
                                        <button class="remove-btn" @click="removeItem(item.id)">
                                            <i class="bi bi-trash"></i>
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Address Selection -->
                    <div class="card shadow-sm mb-2 compact-address-card">
                        <div class="card-header text-white compact-card-header" style="background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);">
                            <h6 class="mb-0 compact-header-title">Delivery Address</h6>
                        </div>
                        <div class="card-body">
                            <div v-if="addresses.length === 0" class="text-center py-3">
                                <p class="text-muted mb-3">No addresses found</p>
                                <button class="btn text-white" style="background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);" @click="showAddressModal">
                                    Add New Address
                                </button>
                            </div>
                            <div v-else>
                                <div class="list-group">
                                    <label v-for="address in addresses" 
                                           :key="address.id" 
                                           class="list-group-item list-group-item-action">
                                        <div class="form-check">
                                            <input class="form-check-input" 
                                                   type="radio" 
                                                   :value="address.id"
                                                   v-model="selectedAddressId"
                                                   name="address">
                                            <div class="form-check-label">
                                                <h6 class="mb-1">{{ address.title }}</h6>
                                                <p class="mb-1">{{ address.address_line }}</p>
                                                <p class="mb-1">
                                                    {{ address.city }}, {{ address.state }}, {{ address.country }}
                                                </p>
                                                <p class="mb-0">Postal Code: {{ address.postal_code }}</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <button class="btn btn-outline-primary mt-3" @click="showAddressModal">
                                    <i class="bi bi-plus-lg"></i> Add New Address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="order-summary-section">
                    <!-- Points Redemption Section -->
                    <div class="points-redemption-card">
                        <div class="card-header">
                            <div class="header-icon">
                                <i class="bi bi-gift"></i>
                            </div>
                            <div class="header-content">
                                <h5 class="card-title">Points Redemption</h5>
                                <p class="card-subtitle">Use your earned points to save money</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Available Balance -->
                            <div class="balance-section">
                                <div class="balance-header">
                                    <span class="balance-label">Available Balance</span>
                                    <button 
                                        class="refresh-btn" 
                                        @click="refreshBalance"
                                        :disabled="isRefreshingBalance"
                                        title="Refresh Balance"
                                    >
                                        <i class="bi bi-arrow-clockwise" :class="{ 'spinning': isRefreshingBalance }"></i>
                                    </button>
                                </div>
                                <div class="balance-amount">
                                    <span class="amount">₹{{ userBalance || '0.00' }}</span>
                                    <span class="currency">INR</span>
                            </div>
                            </div>

                            <!-- No Balance Alert -->
                            <div v-if="userBalance <= 0" class="no-balance-alert">
                                <div class="alert-icon">
                                    <i class="bi bi-info-circle"></i>
                            </div>
                                <div class="alert-content">
                                    <p class="alert-title">No Balance Available</p>
                                    <p class="alert-message">You can earn points by shopping or check your profile for available rewards.</p>
                                </div>
                            </div>

                            <!-- Cart Total -->
                            <div class="cart-total-section">
                                <span class="total-label">Cart Total</span>
                                <span class="total-amount">₹{{ subtotal }}</span>
                            </div>

                            <!-- Redeem Input -->
                            <div class="redeem-section">
                                <label for="redeemAmount" class="redeem-label">Redeem Amount (₹)</label>
                                <div class="redeem-input-group">
                                    <input 
                                        type="number" 
                                        id="redeemAmount" 
                                        v-model="redeemAmount"
                                        :max="Math.min(userBalance || 0, subtotal)"
                                        :min="0"
                                        step="0.01"
                                        placeholder="Enter amount to redeem"
                                        @input="calculateFinalPrice"
                                        class="redeem-input"
                                        :class="{ 'error': redeemAmount > maxRedeemable }"
                                    >
                                    <button 
                                        class="max-btn" 
                                        type="button"
                                        @click="setMaxRedeem"
                                        :disabled="maxRedeemable <= 0"
                                    >
                                        Max
                                    </button>
                                </div>
                                <div class="redeem-info">
                                    <span class="max-info">Maximum redeemable: ₹{{ maxRedeemable.toFixed(2) }}</span>
                                </div>
                                <div v-if="redeemAmount > maxRedeemable" class="error-message">
                                    Redeem amount cannot exceed your available balance or cart total.
                                </div>
                            </div>

                            <!-- Final Calculation -->
                            <div class="final-calculation">
                                <div class="final-total">
                                    <span class="final-label">Final Total</span>
                                    <span class="final-amount">₹{{ finalPrice.toFixed(2) }}</span>
                            </div>
                                <div class="savings">
                                    <span class="savings-label">You Save</span>
                                <span class="savings-amount">₹{{ (subtotal - finalPrice).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="order-summary-card">
                        <div class="summary-header">
                            <div class="summary-icon">
                                <i class="bi bi-receipt"></i>
                        </div>
                            <div class="summary-content">
                                <h5 class="summary-title">Order Summary</h5>
                                <p class="summary-subtitle">Review your order details</p>
                            </div>
                            </div>
                        <div class="summary-body">
                            <div class="summary-item">
                                <span class="item-label">Subtotal</span>
                                <span class="item-value">₹{{ subtotal }}</span>
                            </div>
                            <div class="summary-item">
                                <span class="item-label">Shipping</span>
                                <span class="item-value free">Free</span>
                            </div>
                            <div class="summary-item">
                                <span class="item-label">Total Mintiss Points</span>
                                <span class="item-value points">{{ totalMintissPoints }}</span>
                            </div>
                            
                            <div class="summary-divider"></div>
                            
                            <!-- Amount Breakdown -->
                            <div class="amount-breakdown">
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Subtotal</span>
                                    <span class="breakdown-value">₹{{ finalPrice }} </span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">+ Tax (18%)</span>
                                    <span class="breakdown-value">₹{{ (finalPrice * 0.18) }}</span>
                                </div>
                                <div class="breakdown-divider"></div>
                                <div class="breakdown-total">
                                    <span class="total-label">Total Amount</span>
                                    <span class="total-value">₹{{ finalPrice + (finalPrice * 0.18) }}</span>
                                </div>
                            </div>
                            <button 
                                class="checkout-btn" 
                                    @click="confirmOrder"
                                :disabled="!selectedAddressId"
                            >
                                <i class="bi bi-credit-card"></i>
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Address Form Modal -->
        <div v-if="showAddressForm" class="modal-overlay" @click.self="closeAddressModal">
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Address</h5>
                        <button type="button" 
                                class="btn-close" 
                                @click="closeAddressModal">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <AddressForm @submit="handleAddressSubmit" @cancel="closeAddressModal" />
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';
import AddressForm from '@/components/AddressForm.vue';

export default {
    name: "UserCart",
    components: {
        AddressForm
    },
    data() {
        return {
            cartItems: [],
            addresses: [],
            selectedAddressId: null,
            showAddressForm: false,
            placingOrder: false,
            // Redemption properties
            redeemAmount: 0,
            userBalance: 0,
            mintissValue: 0,
            finalPrice: 0,
            isRefreshingBalance: false,
        };
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        total() {
            return this.subtotal;
        },
        totalMintissPoints() {
            return this.cartItems.reduce((total, item) => {
                if (item.mintissPoints) {
                    return total + (parseFloat(item.mintissPoints) * item.quantity);
                }
                return total;
            }, 0).toFixed(8);
        },
        maxRedeemable() {
            return Math.min(this.userBalance || 0, this.subtotal);
        },
        isLoggedIn() {
            return !!localStorage.getItem("token");
        }
    },
    methods: {
        loadCart() {
            const savedCart = localStorage.getItem('cart');
            this.cartItems = savedCart ? JSON.parse(savedCart) : [];
            console.log('Loaded cart items:', this.cartItems);
            
            // Ensure each cart item has required fields
            this.cartItems = this.cartItems.map(item => ({
                id: item.id || 0,
                name: item.name || 'Unknown Product',
                price: item.price || 0,
                quantity: item.quantity || 1,
                images: item.images || [],
                ...item // Keep any other properties
            }));
            
            console.log('Processed cart items:', this.cartItems);
        },
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
        },
        async fetchAddresses() {
            try {
                const response = await axios.get('/addresses');
                this.addresses = response.data.data;
                if (this.addresses.length > 0) {
                    this.selectedAddressId = this.addresses[0].id;
                }
            } catch (error) {
                toastService.error('Failed to fetch addresses');
                console.error('Error fetching addresses:', error);
            }
        },
        updateQuantity(itemId, newQuantity) {
            if (newQuantity < 1) return;
            
            const item = this.cartItems.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
                this.saveCart();
                // Recalculate final price when quantity changes
                this.calculateFinalPrice();
                toastService.success('Cart updated successfully!');
            }
        },
        removeItem(itemId) {
            this.cartItems = this.cartItems.filter(item => item.id !== itemId);
            this.saveCart();
            // Recalculate final price when item is removed
            this.calculateFinalPrice();
            toastService.success('Item removed from cart!');
        },
        async handleAddressSubmit(formData) {
            try {
                const response = await axios.post('/addresses', formData);
                this.addresses.push(response.data);
                this.selectedAddressId = response.data.id;
                this.closeAddressModal();
                toastService.success('Address added successfully');
            } catch (error) {
                toastService.error('Failed to add address');
                console.error('Error adding address:', error);
            }
        },

        showAddressModal() {
            console.log('showAddressModal called');
            this.showAddressForm = true;
        },

        closeAddressModal() {
            this.showAddressForm = false;
        },




        async placeOrder() {
            if (!this.selectedAddressId) {
                toastService.error('Please select a delivery address');
                return;
            }

            if (this.cartItems.length === 0) {
                toastService.error('Your cart is empty');
                return;
            }

            this.placingOrder = true;

            try {
                // Validate required data
                if (!this.selectedAddressId) {
                    throw new Error('No address selected');
                }
                
                if (this.cartItems.length === 0) {
                    throw new Error('Cart is empty');
                }
                
                if (!this.finalPrice || this.finalPrice <= 0) {
                    throw new Error('Invalid final price');
                }

                const orderData = {
                    address_id: this.selectedAddressId,
                    products: this.cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    redeem_amount: this.redeemAmount,
                    finalPrice: this.finalPrice,
                    total_amount: this.finalPrice
                };

                console.log('Order Data:', orderData);
                console.log('Cart Items:', this.cartItems);
                console.log('Final Price:', this.finalPrice);

                const response = await axios.post('/orders', orderData);
                
                console.log('Order response:', response.data);
                
                // Check if order was successful
                if (response.data.success) {
                    // Clear cart
                    localStorage.removeItem('cart');
                    this.cartItems = [];
                    
                    toastService.success('Order placed successfully!');
                    
                    // Redirect to home page
                    this.$router.push('/');
                } else {
                    throw new Error(response.data.message || 'Order failed');
                }
                
            } catch (error) {
                console.error('Error placing order:', error);
                
                // Show specific error message
                let errorMessage = 'Failed to place order. Please try again.';
                
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                toastService.error(errorMessage);
            } finally {
                this.placingOrder = false;
            }
        },

        confirmOrder() {
            if (!this.selectedAddressId) {
                toastService.error('Please select a delivery address');
                return;
            }
            // Directly place order without confirmation modal
            this.placeOrder();
        },
        
        // Redemption methods
        async fetchMintissValue() {
            try {
                const response = await axios.get("/mintiss-value/latest");
                this.mintissValue = parseFloat(response.data.data.value);
                this.calculateUserBalance();
            } catch (error) {
                console.error("Error fetching mintiss value:", error);
                this.mintissValue = 0;
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
                if (user && user.balance) {
                    this.userBalance = parseFloat(user.balance);
                } else if (user && user.mintiss) {
                    this.userBalance = parseFloat(user.mintiss) * 0.001;
                } else {
                    this.userBalance = 0;
                }
                console.log('Fallback balance:', this.userBalance);
            }
            this.calculateFinalPrice();
        },
        
        calculateFinalPrice() {
            this.finalPrice = Math.max(0, this.subtotal - this.redeemAmount);
            console.log('Calculating final price:', {
                subtotal: this.subtotal,
                redeemAmount: this.redeemAmount,
                finalPrice: this.finalPrice
            });
        },
        
        setMaxRedeem() {
            console.log('Setting max redeem. Max redeemable:', this.maxRedeemable);
            // Truncate to 2 decimal places instead of rounding
            this.redeemAmount = Math.floor(this.maxRedeemable * 100) / 100;
            this.calculateFinalPrice();
            console.log('Redeem amount set to:', this.redeemAmount);
            
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
                    this.userBalance = Math.floor(Math.random() * 2000) + 500;
                    toastService.success('Demo balance refreshed! New balance: ₹' + this.userBalance);
                }
            } catch (error) {
                console.error('Error refreshing balance:', error);
                toastService.error('Failed to refresh balance. Please try again.');
            } finally {
                this.isRefreshingBalance = false;
            }
        }
    },
    async mounted() {
        this.loadCart();
        this.fetchAddresses();
        
        // Initialize redemption functionality
        if (this.isLoggedIn) {
            await this.fetchMintissValue();
            await this.fetchUserBalance();
        } else {
            this.userBalance = 1000; // Demo balance
        }
        this.calculateFinalPrice();
    },
    
    
    watch: {
        subtotal() {
            // Recalculate final price when subtotal changes
            this.calculateFinalPrice();
            // Adjust redeem amount if it exceeds new maxRedeemable
            if (this.redeemAmount > this.maxRedeemable) {
                this.redeemAmount = this.maxRedeemable;
            }
        },
        redeemAmount(newVal) {
            if (newVal > this.maxRedeemable) {
                this.redeemAmount = this.maxRedeemable;
            }
            if (newVal < 0) {
                this.redeemAmount = 0;
            }
            this.calculateFinalPrice();
        }
    }
};
</script>

<style scoped>
/* Amazon-style Cart Page */
.amazon-cart-page {
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Amazon Ember', Arial, sans-serif;
}

/* Amazon-style Cart Header */
.amazon-cart-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  border-bottom: 1px solid #0d5a9a;
  padding: 0.2rem 0;
  margin-bottom: 0.2rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-icon {
  background: #1177bf;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.cart-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.6rem;
  margin: 0;
}

.item-count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.count-number {
  font-size: 1.2rem;
  font-weight: 700;
}

.count-text {
  font-size: 0.9rem;
}

/* Amazon-style Cart Content */
.amazon-cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.cart-items-section {
  background: white;
}

.amazon-cart-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.3rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.amazon-cart-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.item-content {
  display: flex;
  padding: 0.3rem;
  gap: 0.3rem;
}

.item-image-container {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background: #f8f9fa;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.1;
}

.item-description {
  font-size: 0.6rem;
  color: #666;
  margin: 0;
  line-height: 1.2;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 0.9rem;
  color: #666;
  text-decoration: line-through;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background: #1177bf;
  color: white;
  border-color: #1177bf;
}

.quantity-btn:disabled {
  background: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.mintiss-points {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #1177bf;
  font-size: 0.8rem;
  font-weight: 500;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-btn:hover {
  background: #cc3333;
}

/* Ultra-Compact Mobile Styles */
@media (max-width: 768px) {
  .amazon-cart-content {
    grid-template-columns: 1fr;
    gap: 0.05rem;
    padding: 0 0.05rem;
    display: flex;
    flex-direction: column;
  }
  
  /* Reorder sections for mobile - Address and Product Details first */
  .order-summary-section {
    order: 1;
  }
  
  .cart-items-section {
    order: 2;
  }
  
  .cart-items-container {
    padding: 0;
  }
  
  .header-content {
    padding: 0 0.25rem;
  }
  
  .amazon-cart-header {
    padding: 0.25rem 0;
    margin-bottom: 0.25rem;
  }
  
  .cart-title {
    font-size: 1rem;
  }
  
  .cart-subtitle {
    font-size: 0.7rem;
  }
  
  .cart-icon {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .amazon-cart-item {
    margin-bottom: 0.05rem;
  }
  
  .item-content {
    flex-direction: row;
    padding: 0.1rem;
    gap: 0.15rem;
    align-items: center;
  }
  
  .item-image-container {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }
  
  .item-details {
    flex: 1;
    gap: 0.05rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .item-name {
    font-size: 0.6rem;
    line-height: 1.0;
    flex: 1;
    margin-right: 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .item-description {
    display: none;
  }
  
  .current-price {
    font-size: 0.65rem;
    margin-right: 0.15rem;
  }
  
  .quantity-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.1rem;
    margin-right: 0.15rem;
  }
  
  .quantity-label {
    display: none;
  }
  
  .quantity-btn {
    width: 16px;
    height: 16px;
    font-size: 0.5rem;
  }
  
  .quantity-input {
    width: 22px;
    height: 16px;
    font-size: 0.5rem;
  }
  
  .mintiss-points {
    font-size: 0.5rem;
    margin-right: 0.25rem;
    display: none;
  }
  
  .item-actions {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 0;
  }
  
  .item-total {
    align-items: flex-end;
    margin-right: 0.25rem;
  }
  
  .total-price {
    font-size: 0.65rem;
  }
  
  .remove-btn {
    padding: 0.08rem 0.15rem;
    font-size: 0.45rem;
  }
}

@media (max-width: 480px) {
  .amazon-cart-header {
    padding: 0.25rem 0;
    margin-bottom: 0.1rem;
  }
  
  .header-content {
    flex-direction: row;
    gap: 0.25rem;
  }
  
  .header-left {
    flex-direction: row;
    gap: 0.25rem;
  }
  
  .cart-title {
    font-size: 0.9rem;
  }
  
  .cart-subtitle {
    font-size: 0.65rem;
  }
  
  .cart-icon {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
  
  .item-count-badge {
    padding: 0.2rem 0.4rem;
  }
  
  .count-number {
    font-size: 0.9rem;
  }
  
  .count-text {
    font-size: 0.7rem;
  }
  
  .amazon-cart-item {
    margin-bottom: 0.05rem;
  }
  
  .item-content {
    padding: 0.1rem;
    gap: 0.15rem;
  }
  
  .item-image-container {
    width: 30px;
    height: 30px;
  }
  
  .item-name {
    font-size: 0.6rem;
    line-height: 1.0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .current-price {
    font-size: 0.65rem;
  }
  
  .quantity-btn {
    width: 16px;
    height: 16px;
    font-size: 0.5rem;
  }
  
  .quantity-input {
    width: 22px;
    height: 16px;
    font-size: 0.5rem;
  }
  
  .mintiss-points {
    display: none;
  }
  
  .total-price {
    font-size: 0.65rem;
  }
  
  .remove-btn {
    padding: 0.08rem 0.15rem;
    font-size: 0.5rem;
  }
  
  /* Ultra-compact Address Section */
  .card {
    margin-bottom: 0.25rem !important;
  }
  
  .card-header {
    padding: 0.25rem 0.5rem !important;
  }
  
  .card-header h5 {
    font-size: 0.8rem !important;
    margin: 0 !important;
  }
  
  .card-body {
    padding: 0.25rem 0.5rem !important;
  }
  
  .list-group-item {
    padding: 0.25rem 0.5rem !important;
    margin-bottom: 0.1rem !important;
  }
  
  .form-check-label h6 {
    font-size: 0.7rem !important;
    margin-bottom: 0.1rem !important;
  }
  
  .form-check-label p {
    font-size: 0.6rem !important;
    margin-bottom: 0.1rem !important;
    line-height: 1.2 !important;
  }
  
  .btn {
    padding: 0.2rem 0.4rem !important;
    font-size: 0.6rem !important;
    margin-top: 0.25rem !important;
  }
}

.bg-primary {
  background: linear-gradient(135deg, #1177bf 0%, #0d6efd 100%) !important;
}
.text-primary {
  color: #1177bf !important;
}
.btn-primary {
  background-color: #1177bf !important;
  border-color: #1177bf !important;
}
.btn-primary:hover {
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
}
.btn-outline-primary {
  color: #1177bf !important;
  border-color: #1177bf !important;
}
.btn-outline-primary:hover {
  background-color: #1177bf !important;
  border-color: #1177bf !important;
}

/* Redemption styles */
.points-redemption-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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


/* Amount Breakdown Section */
.amount-breakdown {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.breakdown-label {
  color: #495057;
  font-weight: 500;
}

.breakdown-value {
  color: #1177bf;
  font-weight: 600;
}

.breakdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #dee2e6 50%, transparent 100%);
  margin: 0.75rem 0;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 2px solid #1177bf;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.breakdown-total .total-label {
  color: #1177bf;
}

.breakdown-total .total-value {
  color: #1177bf;
  font-size: 1.2rem;
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

.alert-sm {
  padding: 0.5rem 0.75rem;
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

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== MODERN CART PAGE STYLES ===== */
.modern-cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 2rem 0;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Cart Header */
.cart-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(17, 119, 191, 0.3);
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.header-text {
  display: flex;
  flex-direction: column;
}

.cart-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.cart-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.item-count-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(10px);
}

.count-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.count-text {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Empty Cart */
.empty-cart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
}

.empty-cart-icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 3rem;
  color: white;
  box-shadow: 0 10px 30px rgba(17, 119, 191, 0.3);
}

.empty-cart-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.empty-cart-message {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.continue-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.4);
  color: white;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.cart-items-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cart-items-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  background: #fafbfc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e8eaed;
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.15);
  border-color: #1177bf;
}

.item-content {
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
}

.item-image-container {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-image:hover {
  transform: scale(1.05);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.item-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.item-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
}

.original-price {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: line-through;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 12px;
  padding: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #1177bf;
  color: white;
  transform: scale(1.1);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 32px;
  border: none;
  text-align: center;
  font-weight: 600;
  background: transparent;
  color: #2c3e50;
}

.quantity-input:focus {
  outline: none;
}

/* Item Actions */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.item-total {
  text-align: right;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
  display: block;
  margin-bottom: 0.5rem;
}

.mintiss-points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
}

.mintiss-points i {
  font-size: 1rem;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.remove-btn i {
  font-size: 0.9rem;
}

/* ===== POINTS REDEMPTION STYLES ===== */
.order-summary-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.points-redemption-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(17, 119, 191, 0.1);
  border: 1px solid rgba(17, 119, 191, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 0.3rem;
}

.points-redemption-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: white;
}

.header-icon {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  backdrop-filter: blur(10px);
}

.header-content {
  flex: 1;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.card-subtitle {
  font-size: 0.6rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.card-body {
  padding: 0.5rem;
}

/* Balance Section */
.balance-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(17, 119, 191, 0.1);
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.balance-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.refresh-btn {
  background: rgba(17, 119, 191, 0.1);
  border: 1px solid rgba(17, 119, 191, 0.3);
  color: #1177bf;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.refresh-btn:hover:not(:disabled) {
  background: #1177bf;
  color: white;
  transform: scale(1.1);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #28a745;
}

.currency {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

/* No Balance Alert */
.no-balance-alert {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.alert-icon {
  color: #856404;
  font-size: 1.2rem;
  margin-top: 0.1rem;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #856404;
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.alert-message {
  color: #856404;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
}

/* Cart Total Section */
.cart-total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(17, 119, 191, 0.2);
}

.total-label {
  font-weight: 600;
  color: #1976d2;
  font-size: 1rem;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1177bf;
}

/* Redeem Section */
.redeem-section {
  margin-bottom: 1.5rem;
}

.redeem-label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.redeem-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.redeem-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.redeem-input:focus {
  outline: none;
  border-color: #1177bf;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.redeem-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.max-btn {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.max-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(17, 119, 191, 0.3);
}

.max-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.redeem-info {
  margin-bottom: 0.5rem;
}

.max-info {
  font-size: 0.8rem;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Final Calculation */
.final-calculation {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(17, 119, 191, 0.1);
}

.final-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(17, 119, 191, 0.1);
}

.final-label {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.final-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1177bf;
}

.savings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.savings-label {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.savings-amount {
  color: #28a745;
  font-weight: 700;
  font-size: 1.1rem;
}

/* ===== ORDER SUMMARY STYLES ===== */
.order-summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.1);
  border: 1px solid rgba(17, 119, 191, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.order-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.15);
}

.summary-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.summary-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.summary-subtitle {
  font-size: 0.9rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.summary-body {
  padding: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(17, 119, 191, 0.1);
}

.summary-item:last-of-type {
  border-bottom: none;
}

.item-label {
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
}

.item-value {
  color: #1177bf;
  font-weight: 600;
  font-size: 1rem;
}

.item-value.free {
  color: #28a745;
  font-weight: 700;
}

.item-value.points {
  color: #ffc107;
  font-weight: 700;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(17, 119, 191, 0.3), transparent);
  margin: 1rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid rgba(17, 119, 191, 0.1);
}

.total-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #495057;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1177bf;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.checkout-btn i {
  font-size: 1.2rem;
}

/* ===== MODAL STYLES ===== */
.modal {
  z-index: 1055;
}

.modal.show {
  display: block !important;
}

.modal-backdrop {
  z-index: 1050;
}

.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 30px rgba(17, 119, 191, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  border-bottom: none;
}

.modal-title {
  font-weight: 700;
  font-size: 1.25rem;
}

.btn-close {
  filter: invert(1);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  border-top: 1px solid rgba(17, 119, 191, 0.1);
  padding: 1rem 2rem;
}

.modal-footer .btn {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}

.alert-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid rgba(17, 119, 191, 0.2);
  color: #1976d2;
  border-radius: 12px;
}

.alert-info h6 {
  color: #1177bf;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

/* Mobile-First Responsive Design */
/* Base styles are mobile-first */

/* Small mobile devices (320px and up) */
@media (min-width: 320px) {
  .modern-cart-page {
    padding: 1rem 0;
  }
  
  .cart-container {
    padding: 0 0.5rem;
  }
  
  .cart-header {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .cart-title {
    font-size: 1.25rem;
  }
  
  .cart-subtitle {
    font-size: 0.85rem;
  }
  
  .cart-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .item-count-badge {
    padding: 0.5rem 1rem;
  }
  
  .count-number {
    font-size: 1.25rem;
  }
  
  .count-text {
    font-size: 0.75rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .cart-header {
    padding: 1.25rem;
  }
  
  .cart-title {
    font-size: 1.5rem;
  }
  
  .cart-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .header-content {
    flex-direction: row;
    text-align: left;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-cart-page {
    padding: 1.5rem 0;
  }
  
  .cart-container {
    padding: 0 1rem;
  }
  
  .cart-header {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .cart-title {
    font-size: 1.75rem;
  }
  
  .cart-subtitle {
    font-size: 0.95rem;
  }
  
  .cart-icon {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }
  
  .cart-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .order-summary-section {
    order: -1;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-cart-page {
    padding: 2rem 0;
  }
  
  .cart-container {
    padding: 0 1rem;
  }
  
  .cart-header {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .cart-title {
    font-size: 2rem;
  }
  
  .cart-subtitle {
    font-size: 1rem;
  }
  
  .cart-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .cart-content {
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }
  
  .order-summary-section {
    order: 0;
  }
}

/* Mobile-specific cart item styles */
@media (max-width: 767px) {
  .cart-items-section {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .cart-item {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .item-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
  
  .item-image-container {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .item-details {
    text-align: center;
  }
  
  .item-name {
    font-size: 1.1rem;
  }
  
  .item-description {
    font-size: 0.85rem;
  }
  
  .quantity-section {
    flex-direction: row;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .quantity-controls {
    gap: 0.25rem;
  }
  
  .quantity-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .quantity-input {
    width: 45px;
    height: 28px;
    font-size: 0.9rem;
  }
  
  .item-actions {
    align-items: center;
    gap: 0.75rem;
  }
  
  .total-price {
    font-size: 1.1rem;
  }
  
  .remove-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Compact Address Card */
.compact-address-card {
  margin-bottom: 0.3rem !important;
}

.compact-card-header {
  padding: 0.3rem 0.6rem !important;
}

.compact-header-title {
  font-size: 0.8rem !important;
  font-weight: 600 !important;
}

/* Mobile-specific order summary styles */
@media (max-width: 767px) {
  .order-summary-section {
    order: -1;
    margin-bottom: 1rem;
  }
  
  .points-redemption-card,
  .order-summary-card {
    margin-bottom: 1rem;
    border-radius: 12px;
  }
  
  .card-header,
  .summary-header {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .header-icon,
  .summary-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .card-title,
  .summary-title {
    font-size: 1.1rem;
  }
  
  .card-subtitle,
  .summary-subtitle {
    font-size: 0.8rem;
  }
  
  .card-body,
  .summary-body {
    padding: 1rem;
  }
  
  .balance-section,
  .final-calculation,
  .summary-total {
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .balance-amount {
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .amount {
    font-size: 1.25rem;
  }
  
  .currency {
    font-size: 0.75rem;
  }
  
  .redeem-input-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .redeem-input {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }
  
  .max-btn {
    width: 100%;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .summary-item {
    padding: 0.5rem 0;
    font-size: 0.9rem;
  }
  
  .item-label {
    font-size: 0.85rem;
  }
  
  .item-value {
    font-size: 0.9rem;
  }
  
  .amount-breakdown {
    padding: 0.75rem;
    margin: 0.75rem 0;
  }
  
  .breakdown-item {
    padding: 0.4rem 0;
    font-size: 0.85rem;
  }
  
  .breakdown-total {
    padding: 0.6rem 0;
    font-size: 1rem;
  }
  
  .checkout-btn {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
  }
}

/* Mobile modal styles */
@media (max-width: 767px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-width: 100%;
    max-height: 95vh;
  }
  
  .modal-content {
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .btn-close {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {
  .quantity-btn,
  .remove-btn,
  .checkout-btn,
  .max-btn,
  .refresh-btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .form-check-input {
    width: 20px;
    height: 20px;
  }
  
  .list-group-item {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-item {
  animation: fadeInUp 0.3s ease-out;
}

.cart-item:nth-child(1) { animation-delay: 0.1s; }
.cart-item:nth-child(2) { animation-delay: 0.2s; }
.cart-item:nth-child(3) { animation-delay: 0.3s; }
.cart-item:nth-child(4) { animation-delay: 0.4s; }

/* Custom Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-weight: 600;
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 2rem;
}

.alert-info {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  border: none;
  border-radius: 12px;
}

.alert-info h6 {
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alert-info p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
}

</style>