<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">Orders</h2>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div v-if="orders.length === 0" class="text-center text-muted py-5">
                            <i class="bi bi-cart fs-1"></i>
                            <p>No orders yet.</p>
                        </div>
                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Products</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in orders" :key="order.id">
                                            <td>#{{ order.id }}</td>
                                            <td>{{ order.customer_name }}</td>
                                            <td>{{ order.products_count }} items</td>
                                            <td>${{ order.total }}</td>
                                            <td>{{ formatDate(order.created_at) }}</td>
                                            <td>
                                                <span :class="getStatusBadgeClass(order.status)">
                                                    {{ order.status }}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary me-1" @click="viewOrder(order)">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button v-if="order.status === 'pending'" 
                                                        class="btn btn-sm btn-outline-success" 
                                                        @click="updateOrderStatus(order.id, 'processing')">
                                                    <i class="bi bi-check"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Order Details Modal -->
        <div class="modal fade" :class="{ 'show d-block': showOrderModal }" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order #{{ selectedOrder?.id }}</h5>
                        <button type="button" class="btn-close" @click="closeOrderModal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedOrder">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Customer Information</h6>
                                <p><strong>Name:</strong> {{ selectedOrder.customer_name }}</p>
                                <p><strong>Email:</strong> {{ selectedOrder.customer_email }}</p>
                                <p><strong>Phone:</strong> {{ selectedOrder.customer_phone }}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Order Information</h6>
                                <p><strong>Order Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                                <p><strong>Status:</strong> 
                                    <span :class="getStatusBadgeClass(selectedOrder.status)">
                                        {{ selectedOrder.status }}
                                    </span>
                                </p>
                                <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <h6>Order Items</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in selectedOrder.items" :key="item.id">
                                        <td>{{ item.product_name }}</td>
                                        <td>${{ item.price }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeOrderModal">Close</button>
                        <button v-if="selectedOrder?.status === 'pending'" 
                                type="button" 
                                class="btn btn-success" 
                                @click="updateOrderStatus(selectedOrder.id, 'processing')">
                            Mark as Processing
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Backdrop -->
        <div v-if="showOrderModal" class="modal-backdrop fade show"></div>
    </div>
</template>

<script>
export default {
    name: 'SellerOrders',
    data() {
        return {
            orders: [],
            showOrderModal: false,
            selectedOrder: null
        }
    },
    mounted() {
        this.loadOrders();
    },
    methods: {
        async loadOrders() {
            try {
                // TODO: Replace with actual API call
                this.orders = [
                    {
                        id: 1001,
                        customer_name: 'John Doe',
                        customer_email: 'john@example.com',
                        customer_phone: '+1234567890',
                        products_count: 2,
                        total: 149.98,
                        status: 'pending',
                        created_at: '2024-01-15T10:30:00Z',
                        items: [
                            { id: 1, product_name: 'Sample Product 1', price: 99.99, quantity: 1 },
                            { id: 2, product_name: 'Sample Product 2', price: 49.99, quantity: 1 }
                        ]
                    },
                    {
                        id: 1002,
                        customer_name: 'Jane Smith',
                        customer_email: 'jane@example.com',
                        customer_phone: '+0987654321',
                        products_count: 1,
                        total: 29.99,
                        status: 'processing',
                        created_at: '2024-01-14T15:45:00Z',
                        items: [
                            { id: 3, product_name: 'Sample Product 2', price: 29.99, quantity: 1 }
                        ]
                    }
                ];
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        },
        
        getStatusBadgeClass(status) {
            const classes = {
                'pending': 'badge bg-warning',
                'processing': 'badge bg-info',
                'completed': 'badge bg-success',
                'cancelled': 'badge bg-danger'
            };
            return classes[status] || 'badge bg-secondary';
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        
        viewOrder(order) {
            this.selectedOrder = order;
            this.showOrderModal = true;
        },
        
        closeOrderModal() {
            this.showOrderModal = false;
            this.selectedOrder = null;
        },
        
        async updateOrderStatus(orderId, status) {
            try {
                // TODO: Replace with actual API call
                const order = this.orders.find(o => o.id === orderId);
                if (order) {
                    order.status = status;
                }
                
                if (this.selectedOrder && this.selectedOrder.id === orderId) {
                    this.selectedOrder.status = status;
                }
                
                this.closeOrderModal();
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        }
    }
}
</script> 