<template>
    <div class="cart-container py-4">
        <div class="container">
            <!-- Cart Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="text-primary fw-bold mb-0">Shopping Cart</h2>
                <span class="badge bg-primary rounded-pill">{{ cartItems.length }} items</span>
            </div>

            <!-- Empty Cart Message -->
            <div v-if="cartItems.length === 0" class="text-center py-5">
                <i class="bi bi-cart-x text-primary" style="font-size: 4rem;"></i>
                <h3 class="mt-3 text-muted">Your cart is empty</h3>
                <p class="text-muted">Add some items to your cart to see them here</p>
                <router-link to="/" class="btn btn-primary mt-3">
                    Continue Shopping
                </router-link>
            </div>

            <!-- Cart Items -->
            <div v-else class="row">
                <!-- Cart Items List -->
                <div class="col-lg-8">
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <div v-for="item in cartItems" :key="item.id" class="cart-item mb-3 pb-3 border-bottom">
                                <div class="row align-items-center">
                                    <!-- Product Image -->
                                    <div class="col-3 col-md-2">
                                        <img :src="item.image || 'https://via.placeholder.com/100x100?text=No+Image'"
                                             class="img-fluid rounded"
                                             :alt="item.name">
                                    </div>
                                    <!-- Product Details -->
                                    <div class="col-9 col-md-4">
                                        <h5 class="mb-1">{{ item.name }}</h5>
                                        <p class="text-muted small mb-0">{{ item.description }}</p>
                                    </div>
                                    <!-- Quantity Controls -->
                                    <div class="col-6 col-md-3 mt-3 mt-md-0">
                                        <div class="input-group input-group-sm">
                                            <button class="btn btn-outline-primary" 
                                                    @click="updateQuantity(item.id, item.quantity - 1)"
                                                    :disabled="item.quantity <= 1">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <input type="number" 
                                                   class="form-control text-center" 
                                                   v-model.number="item.quantity"
                                                   min="1"
                                                   @change="updateQuantity(item.id, item.quantity)">
                                            <button class="btn btn-outline-primary"
                                                    @click="updateQuantity(item.id, item.quantity + 1)">
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- Price and Remove -->
                                    <div class="col-6 col-md-3 text-end mt-3 mt-md-0">
                                        <div class="d-flex flex-column align-items-end">
                                            <span class="h5 mb-2">₹{{ item.price * item.quantity }}</span>
                                            <div v-if="item.mintissPoints" class="mintiss-points-info mb-2">
                                                <small class="text-success">
                                                    <i class="bi bi-gift me-1"></i>
                                                    +{{ (parseFloat(item.mintissPoints) * item.quantity).toFixed(8) }} mintiss
                                                </small>
                                            </div>
                                            <button class="btn btn-link text-danger p-0" 
                                                    @click="removeItem(item.id)">
                                                <i class="bi bi-trash"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Address Selection -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Delivery Address</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="addresses.length === 0" class="text-center py-3">
                                <p class="text-muted mb-3">No addresses found</p>
                                <button class="btn btn-primary" @click="showAddressForm = true">
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
                                <button class="btn btn-outline-primary mt-3" @click="showAddressForm = true">
                                    <i class="bi bi-plus-lg"></i> Add New Address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="col-lg-4">
                    <!-- Points Redemption Section -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Points Redemption</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-bold">Available Balance:</span>
                                <div class="d-flex align-items-center">
                                    <span class="text-success fw-bold me-2">₹{{ userBalance || '0.00' }}</span>
                                    <button 
                                        class="btn btn-sm btn-outline-secondary refresh-btn" 
                                        @click="refreshBalance"
                                        :disabled="isRefreshingBalance"
                                        title="Refresh Balance"
                                    >
                                        <i class="bi bi-arrow-clockwise" :class="{ 'spinning': isRefreshingBalance }"></i>
                                    </button>
                                </div>
                            </div>
                            <div v-if="userBalance <= 0" class="alert alert-info alert-sm mb-3">
                                <small>
                                    <i class="bi bi-info-circle me-1"></i>
                                    No balance available. You can earn points by shopping or check your profile for available rewards.
                                </small>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-bold">Cart Total:</span>
                                <span class="text-primary fw-bold">₹{{ subtotal }}</span>
                            </div>
                            <div class="mb-3">
                                <label for="redeemAmount" class="form-label fw-bold">Redeem Amount (₹)</label>
                                <div class="input-group">
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        id="redeemAmount" 
                                        v-model="redeemAmount"
                                        :max="Math.min(userBalance || 0, subtotal)"
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
                                    Redeem amount cannot exceed your available balance or cart total.
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold">Final Total:</span>
                                <span class="final-price">₹{{ finalPrice.toFixed(2) }}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-muted">You Save:</span>
                                <span class="savings-amount">₹{{ (subtotal - finalPrice).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Order Summary</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>₹{{ subtotal }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Total Mintiss Points</span>
                                <span class="text-success">{{ totalMintissPoints }}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total</strong>
                                <strong class="text-primary">₹{{ finalPrice.toFixed(2) }}</strong>
                            </div>
                            <button class="btn btn-primary w-100" 
                                    @click="confirmOrder"
                                    :disabled="!selectedAddressId">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Address Form Modal -->
        <div class="modal fade" 
             id="addressFormModal" 
             tabindex="-1" 
             v-if="showAddressForm">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Address</h5>
                        <button type="button" 
                                class="btn-close" 
                                data-bs-dismiss="modal"
                                @click="showAddressForm = false">
                        </button>
                    </div>
                    <div class="modal-body">
                        <AddressForm @submit="handleAddressSubmit" @cancel="showAddressForm = false" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Confirmation Modal -->
        <div class="modal fade" 
             id="orderConfirmationModal" 
             tabindex="-1" 
             aria-labelledby="orderConfirmationModalLabel"
             aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderConfirmationModalLabel">Confirm Order</h5>
                        <button type="button" 
                                class="btn-close" 
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                @click="showOrderConfirmation = false">
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to place this order?</p>
                        <div class="alert alert-info">
                            <h6>Order Summary:</h6>
                            <p class="mb-1">Total Items: {{ cartItems.length }}</p>
                            <p class="mb-1">Subtotal: ₹{{ subtotal }}</p>
                            <p v-if="redeemAmount > 0" class="mb-1">Redeemed: ₹{{ redeemAmount.toFixed(2) }}</p>
                            <p class="mb-1">Final Amount: ₹{{ finalPrice.toFixed(2) }}</p>
                            <p class="mb-1">Total Mintiss Points: {{ totalMintissPoints }}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" 
                                class="btn btn-secondary" 
                                data-bs-dismiss="modal"
                                @click="showOrderConfirmation = false">
                            Cancel
                        </button>
                        <button type="button" 
                                class="btn btn-primary" 
                                @click="placeOrder">
                            Confirm Order
                        </button>
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
import { Modal } from 'bootstrap';

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
            showOrderConfirmation: false,
            addressFormModal: null,
            orderConfirmationModal: null,
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
                toastService.success('Cart updated successfully!');
            }
        },
        removeItem(itemId) {
            this.cartItems = this.cartItems.filter(item => item.id !== itemId);
            this.saveCart();
            toastService.success('Item removed from cart!');
        },
        async handleAddressSubmit(formData) {
            try {
                const response = await axios.post('/addresses', formData);
                this.addresses.push(response.data);
                this.selectedAddressId = response.data.id;
                this.showAddressForm = false;
                toastService.success('Address added successfully');
            } catch (error) {
                toastService.error('Failed to add address');
                console.error('Error adding address:', error);
            }
        },
        confirmOrder() {
            if (!this.selectedAddressId) {
                toastService.error('Please select a delivery address');
                return;
            }
            this.showOrderConfirmation = true;
            this.$nextTick(() => {
                const modalElement = document.getElementById('orderConfirmationModal');
                if (modalElement) {
                    this.orderConfirmationModal = new Modal(modalElement);
                    this.orderConfirmationModal.show();
                }
            });
        },
        async placeOrder() {
            try {
                const orderData = {
                    address_id: this.selectedAddressId,
                    products: this.cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    })),
                    redeemAmount: this.redeemAmount,
                    finalPrice: this.finalPrice,
                    userBalance: this.userBalance,
                    mintissValue: this.mintissValue
                };

                await axios.post('/orders', orderData);
                
                // Clear cart after successful order
                localStorage.removeItem('cart');
                this.cartItems = [];
                
                if (this.orderConfirmationModal) {
                    this.orderConfirmationModal.hide();
                }
                this.showOrderConfirmation = false;
                toastService.success('Order placed successfully!');
                
                // Redirect to home page
                this.$router.push('/');
            } catch (error) {
                toastService.error('Failed to place order');
                console.error('Error placing order:', error);
            }
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
        showAddressForm(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    const modalElement = document.getElementById('addressFormModal');
                    if (modalElement) {
                        this.addressFormModal = new Modal(modalElement);
                        this.addressFormModal.show();
                    }
                });
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
    },
    beforeUnmount() {
        // Clean up modals when component is destroyed
        if (this.addressFormModal) {
            this.addressFormModal.dispose();
        }
        if (this.orderConfirmationModal) {
            this.orderConfirmationModal.dispose();
        }
    }
};
</script>

<style scoped>
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
</style>