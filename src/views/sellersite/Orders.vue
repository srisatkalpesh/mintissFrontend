<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Order Management</h2>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary" @click="refreshOrders">
                            <i class="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Statistics -->
        <div class="row mb-4" v-if="stats">
            <div class="col-md-3 mb-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Orders</h5>
                        <h3 class="mb-0">{{ stats.total_orders }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <h5 class="card-title">Pending Orders</h5>
                        <h3 class="mb-0">{{ stats.pending_orders }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h5 class="card-title">Delivered</h5>
                        <h3 class="mb-0">{{ stats.delivered_orders }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Revenue</h5>
                        <h3 class="mb-0">${{ (stats.total_revenue || 0).toFixed(2) }}</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" v-model="filters.status" @change="applyFilters">
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Date From</label>
                                <input type="date" class="form-control" v-model="filters.date_from" @change="applyFilters">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Date To</label>
                                <input type="date" class="form-control" v-model="filters.date_to" @change="applyFilters">
                            </div>
                            <div class="col-md-3 d-flex align-items-end">
                                <button class="btn btn-secondary" @click="clearFilters">Clear Filters</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div v-if="loading" class="text-center py-4">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div v-else-if="orders.length === 0" class="text-center py-4">
                            <div class="mb-3">
                                <i class="bi bi-inbox display-1 text-muted"></i>
                            </div>
                            <h5 class="text-muted">No orders found</h5>
                            <p class="text-muted">You don't have any orders yet. Orders will appear here once customers purchase your products.</p>
                        </div>

                        <div v-else class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td>#{{ order.id }}</td>
                                        <td>
                                            <div>
                                                <strong>{{ order.user.name }}</strong><br>
                                                <small class="text-muted">{{ order.user.email }}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{{ order.product.name }}</strong><br>
                                                <small class="text-muted">${{ order.product.price }}</small>
                                            </div>
                                        </td>
                                        <td>{{ order.quantity }}</td>
                                        <td>${{ order.total_amount }}</td>
                                        <td>
                                            <span :class="getStatusBadgeClass(order.status)" class="badge">
                                                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(order.created_at) }}</td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <button class="btn btn-sm btn-outline-primary" @click="viewOrder(order)">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                        <i class="bi bi-gear"></i>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li v-for="status in availableStatuses" :key="status">
                                                            <a class="dropdown-item" href="#" @click.prevent="updateOrderStatus(order, status)">
                                                                Mark as {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <nav v-if="pagination && pagination.last_page > 1" class="mt-4">
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">Previous</a>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                                    <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Details Modal -->
        <div class="modal fade" id="orderDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order Details #{{ selectedOrder?.id }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedOrder">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Customer Information</h6>
                                <p><strong>Name:</strong> {{ selectedOrder.user.name }}</p>
                                <p><strong>Email:</strong> {{ selectedOrder.user.email }}</p>
                                
                                <h6 class="mt-3">Shipping Address</h6>
                                <p v-if="selectedOrder.address_full_name">
                                    <strong>{{ selectedOrder.address_full_name }}</strong><br>
                                    {{ selectedOrder.address_line1 }}<br>
                                    <span v-if="selectedOrder.address_line2">{{ selectedOrder.address_line2 }}<br></span>
                                    {{ selectedOrder.address_city }}, {{ selectedOrder.address_postal_code }}
                                </p>
                                <p v-else class="text-muted">No address provided</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Order Information</h6>
                                <p><strong>Product:</strong> {{ selectedOrder.product.name }}</p>
                                <p><strong>Quantity:</strong> {{ selectedOrder.quantity }}</p>
                                <p><strong>Unit Price:</strong> ${{ selectedOrder.product.price }}</p>
                                <p><strong>Total Amount:</strong> ${{ selectedOrder.total_amount }}</p>
                                <p><strong>Payment Method:</strong> {{ selectedOrder.payment_method || 'N/A' }}</p>
                                <p><strong>Status:</strong> 
                                    <span :class="getStatusBadgeClass(selectedOrder.status)" class="badge">
                                        {{ selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) }}
                                    </span>
                                </p>
                                <p><strong>Order Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SellerOrders',
    data() {
        return {
            orders: [],
            stats: null,
            loading: false,
            pagination: null,
            selectedOrder: null,
            filters: {
                status: '',
                date_from: '',
                date_to: ''
            },
            availableStatuses: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        };
    },
    computed: {
        visiblePages() {
            if (!this.pagination) return [];
            const current = this.pagination.current_page;
            const last = this.pagination.last_page;
            const delta = 2;
            const range = [];
            const rangeWithDots = [];

            for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
                range.push(i);
            }

            if (current - delta > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }

            rangeWithDots.push(...range);

            if (current + delta < last - 1) {
                rangeWithDots.push('...', last);
            } else {
                rangeWithDots.push(last);
            }

            return rangeWithDots;
        }
    },
    mounted() {
        this.fetchOrders();
        this.fetchStats();
    },
    methods: {
        async fetchOrders() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.status) params.append('status', this.filters.status);
                if (this.filters.date_from) params.append('date_from', this.filters.date_from);
                if (this.filters.date_to) params.append('date_to', this.filters.date_to);

                const response = await axios.get(`/api/seller/orders?${params.toString()}`);
                
                if (response.data && response.data.success) {
                    this.orders = response.data.orders?.data || [];
                    this.pagination = {
                        current_page: response.data.orders?.current_page || 1,
                        last_page: response.data.orders?.last_page || 1,
                        per_page: response.data.orders?.per_page || 15,
                        total: response.data.orders?.total || 0
                    };
                } else {
                    this.orders = [];
                    this.pagination = null;
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                this.orders = [];
                this.pagination = null;
                
                let errorMessage = 'Failed to fetch orders';
                if (error.response) {
                    if (error.response.status === 401) {
                        errorMessage = 'Please log in to view orders';
                        // Redirect to login if not authenticated
                        this.$router.push('/login');
                    } else if (error.response.status === 404) {
                        errorMessage = 'Store not found. Please contact support.';
                    } else if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }
                
                if (this.$toast) {
                    this.$toast.error(errorMessage);
                } else {
                    alert(errorMessage);
                }
            } finally {
                this.loading = false;
            }
        },
        async fetchStats() {
            try {
                const response = await axios.get('/api/seller/orders-stats');
                if (response.data && response.data.success) {
                    this.stats = response.data.stats;
                } else {
                    this.stats = null;
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                this.stats = null;
            }
        },
        async refreshOrders() {
            await this.fetchOrders();
            await this.fetchStats();
        },
        applyFilters() {
            this.fetchOrders();
        },
        clearFilters() {
            this.filters = {
                status: '',
                date_from: '',
                date_to: ''
            };
            this.fetchOrders();
        },
        changePage(page) {
            if (page >= 1 && page <= this.pagination.last_page) {
                // You can implement pagination here if needed
                this.fetchOrders();
            }
        },
        viewOrder(order) {
            this.selectedOrder = order;
            const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
            modal.show();
        },
        async updateOrderStatus(order, newStatus) {
            if (order.status === newStatus) return;

            try {
                const response = await axios.put(`/api/seller/orders/${order.id}/status`, {
                    status: newStatus
                });

                if (response.data.success) {
                    order.status = newStatus;
                    if (this.$toast) {
                        this.$toast.success(`Order status updated to ${newStatus}`);
                    } else {
                        alert(`Order status updated to ${newStatus}`);
                    }
                    this.fetchStats(); // Refresh stats
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                if (this.$toast) {
                    this.$toast.error('Failed to update order status');
                } else {
                    alert('Failed to update order status');
                }
            }
        },
        getStatusBadgeClass(status) {
            const classes = {
                'pending': 'bg-warning',
                'confirmed': 'bg-info',
                'processing': 'bg-primary',
                'shipped': 'bg-secondary',
                'delivered': 'bg-success',
                'cancelled': 'bg-danger'
            };
            return classes[status] || 'bg-secondary';
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
    border-top: none;
    font-weight: 600;
}

.badge {
    font-size: 0.75em;
}

.btn-group .btn {
    margin-right: 2px;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style>
