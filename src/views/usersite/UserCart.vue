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
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total</strong>
                                <strong class="text-primary">₹{{ total }}</strong>
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
                            <p class="mb-1">Total Amount: ₹{{ total }}</p>
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
            orderConfirmationModal: null
        };
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        total() {
            return this.subtotal;
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
                    }))
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
        }
    },
    mounted() {
        this.loadCart();
        this.fetchAddresses();
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
</style>