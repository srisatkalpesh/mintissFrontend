<template>
  <div class="seller-orders-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="page-title">Order Management</h1>
            <p class="page-subtitle">Manage your store orders and track their status</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="header-actions">
              <button class="btn btn-outline-primary me-2" @click="refreshOrders">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
              <button class="btn btn-primary" @click="exportOrders" :disabled="isExporting">
                <span v-if="isExporting">
                  <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  Exporting...
                </span>
                <span v-else>
                  <i class="bi bi-download me-1"></i>
                  Export
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="container-fluid">
        <div class="row g-4">
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-icon pending">
                <i class="bi bi-clock"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.pending_orders || 0 }}</h3>
                <p class="stat-label">Pending Orders</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-icon processing">
                <i class="bi bi-gear"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.processing_orders || 0 }}</h3>
                <p class="stat-label">Processing</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-icon shipped">
                <i class="bi bi-truck"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.shipped_orders || 0 }}</h3>
                <p class="stat-label">Shipped</p>
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-icon delivered">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.delivered_orders || 0 }}</h3>
                <p class="stat-label">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="container-fluid">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input
                type="text"
                class="form-control"
                placeholder="Search orders, customers, or products..."
                v-model="searchQuery"
                @input="debouncedSearch"
              />
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="statusFilter" @change="filterOrders">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="dateFilter" @change="filterOrders">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="orders-section">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-list-ul me-2"></i>
              Orders ({{ orders.length }})
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading orders...</p>
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-5">
              <i class="bi bi-inbox display-1 text-muted"></i>
              <h4 class="mt-3">No Orders Found</h4>
              <p class="text-muted">You don't have any orders yet.</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>
                      <span class="order-id">#{{ order.id }}</span>
                    </td>
                    <td>
                      <div class="customer-info">
                        <div class="customer-name">{{ order.user?.name || 'N/A' }}</div>
                        <div class="customer-email">{{ order.user?.email || 'N/A' }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="product-info">
                        <div class="product-name">{{ order.product?.name || 'N/A' }}</div>
                        <div class="product-price">₹{{ order.product?.price || 0 }}</div>
                      </div>
                    </td>
                    <td>
                      <span class="quantity-badge">{{ order.quantity }}</span>
                    </td>
                    <td>
                      <span class="total-amount">₹{{ order.total_amount }}</span>
                    </td>
                    <td>
                      <span class="status-badge" :class="'status-' + order.status">
                        {{ order.status }}
                      </span>
                    </td>
                    <td>
                      <div class="order-date">
                        {{ formatDate(order.created_at) }}
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button
                          class="btn btn-sm btn-outline-primary me-1"
                          @click="viewOrderDetails(order.id)"
                          title="View Details"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                        <div class="dropdown" :class="{ 'show': openDropdownId === order.id }">
                          <button
                            class="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            @click="toggleDropdown(order.id)"
                            title="Update Status"
                          >
                            <i class="bi bi-gear"></i>
                          </button>
                          <ul class="dropdown-menu" :class="{ 'show': openDropdownId === order.id }">
                            <li>
                              <a class="dropdown-item" @click="updateOrderStatus(order.id, 'pending')">
                                <i class="bi bi-clock me-2"></i>Pending
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item" @click="updateOrderStatus(order.id, 'processing')">
                                <i class="bi bi-gear me-2"></i>Processing
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item" @click="updateOrderStatus(order.id, 'shipped')">
                                <i class="bi bi-truck me-2"></i>Shipped
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item" @click="updateOrderStatus(order.id, 'delivered')">
                                <i class="bi bi-check-circle me-2"></i>Delivered
                              </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                              <a class="dropdown-item text-danger" @click="updateOrderStatus(order.id, 'cancelled')">
                                <i class="bi bi-x-circle me-2"></i>Cancelled
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
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orderDetailsModalLabel">
              <i class="bi bi-receipt me-2"></i>
              Order Details #{{ selectedOrder?.id }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Customer Information</h6>
                <div class="info-item">
                  <label>Name:</label>
                  <span>{{ selectedOrder.user?.name || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Email:</label>
                  <span>{{ selectedOrder.user?.email || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <label>Phone:</label>
                  <span>{{ selectedOrder.user?.phone || 'N/A' }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Order Information</h6>
                <div class="info-item">
                  <label>Order ID:</label>
                  <span>#{{ selectedOrder.id }}</span>
                </div>
                <div class="info-item">
                  <label>Status:</label>
                  <span class="status-badge" :class="'status-' + selectedOrder.status">
                    {{ selectedOrder.status }}
                  </span>
                </div>
                <div class="info-item">
                  <label>Date:</label>
                  <span>{{ formatDate(selectedOrder.created_at) }}</span>
                </div>
              </div>
            </div>

            <hr>

            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Product Details</h6>
                <div class="product-details">
                  <div class="product-image">
                    <img
                      v-if="selectedOrder.product?.images && selectedOrder.product.images.length > 0"
                      :src="selectedOrder.product.images[0]"
                      :alt="selectedOrder.product.name"
                      class="img-fluid rounded"
                    />
                    <div v-else class="no-image">
                      <i class="bi bi-image"></i>
                    </div>
                  </div>
                  <div class="product-info">
                    <h6>{{ selectedOrder.product?.name || 'N/A' }}</h6>
                    <p class="text-muted">{{ selectedOrder.product?.description || 'N/A' }}</p>
                    <p class="fw-bold">₹{{ selectedOrder.product?.price || 0 }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold mb-3">Order Summary</h6>
                <div class="order-summary">
                  <div class="summary-item">
                    <span>Quantity:</span>
                    <span>{{ selectedOrder.quantity }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Unit Price:</span>
                    <span v-if="selectedOrder.price">₹{{ selectedOrder.price }}</span>
                    <span v-else class="text-muted">Not specified</span>
                  </div>
                  <div class="summary-item">
                    <span>Mintiss Value:</span>
                    <span>{{ selectedOrder.mintiss_value }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Redeem Amount:</span>
                    <span>₹{{ selectedOrder.redeem_amount }}</span>
                  </div>
                  <hr>
                  <div class="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{{ selectedOrder.total_amount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr>

            <div class="row">
              <div class="col-12">
                <h6 class="fw-bold mb-3">Shipping Address</h6>
                <div class="shipping-address">
                  <div v-if="selectedOrder.address_full_name || selectedOrder.address_line1 || selectedOrder.address_city">
                    <p v-if="selectedOrder.address_full_name"><strong>{{ selectedOrder.address_full_name }}</strong></p>
                    <p v-if="selectedOrder.address_line1">{{ selectedOrder.address_line1 }}</p>
                    <p v-if="selectedOrder.address_line2">{{ selectedOrder.address_line2 }}</p>
                    <p v-if="selectedOrder.address_city || selectedOrder.address_postal_code">
                      {{ selectedOrder.address_city }}{{ selectedOrder.address_city && selectedOrder.address_postal_code ? ', ' : '' }}{{ selectedOrder.address_postal_code }}
                    </p>
                  </div>
                  <div v-else class="text-muted">
                    <div class="alert alert-warning mb-0">
                      <i class="bi bi-exclamation-triangle me-2"></i>
                      <strong>No shipping address provided</strong><br>
                      <small>This order was created without shipping address information. Please contact the customer for delivery details.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="updateOrderStatusFromModal">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'SellerOrders',
  data() {
    return {
      orders: [],
      stats: {},
      loading: true,
      searchQuery: '',
      statusFilter: 'all',
      dateFilter: 'all',
      selectedOrder: null,
      searchTimeout: null,
      openDropdownId: null,
      isExporting: false
    };
  },
  async mounted() {
    await this.fetchOrders();
    await this.fetchStats();
    
    // Add click outside handler to close dropdown
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    async fetchOrders() {
      try {
        this.loading = true;
        const params = {
          status: this.statusFilter !== 'all' ? this.statusFilter : undefined,
          search: this.searchQuery || undefined
        };
        
        console.log('Fetching orders with params:', params);
        const response = await axios.get('/seller/orders', { params });
        console.log('Orders response:', response.data);
        this.orders = response.data.data.data || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error response:', error.response?.data);
        this.orders = [];
        this.showToast('Failed to load orders: ' + (error.response?.data?.error || error.message), 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        console.log('Fetching stats...');
        const response = await axios.get('/seller/orders/stats');
        console.log('Stats response:', response.data);
        this.stats = response.data.data || {};
      } catch (error) {
        console.error('Error fetching stats:', error);
        console.error('Stats error response:', error.response?.data);
        this.showToast('Failed to load statistics: ' + (error.response?.data?.error || error.message), 'error');
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchOrders();
      }, 500);
    },

    filterOrders() {
      this.fetchOrders();
    },

    clearFilters() {
      this.searchQuery = '';
      this.statusFilter = 'all';
      this.dateFilter = 'all';
      this.fetchOrders();
    },

    toggleDropdown(orderId) {
      // Close dropdown if clicking on the same order, otherwise open new one
      this.openDropdownId = this.openDropdownId === orderId ? null : orderId;
    },

    handleClickOutside(event) {
      // Close dropdown if clicking outside of it
      if (!event.target.closest('.dropdown')) {
        this.openDropdownId = null;
      }
    },

    async viewOrderDetails(orderId) {
      try {
        console.log('Fetching order details for ID:', orderId);
        const response = await axios.get(`/seller/orders/${orderId}`);
        console.log('Order details response:', response.data);
        
        if (response.data.success && response.data.data) {
          this.selectedOrder = response.data.data;
          
        // Show modal
        const modalElement = document.getElementById('orderDetailsModal');
        if (modalElement && window.bootstrap) {
          const modal = new window.bootstrap.Modal(modalElement);
          modal.show();
        } else {
          // Fallback: show modal using jQuery if Bootstrap is not available
          const modalElement = document.getElementById('orderDetailsModal');
          if (modalElement) {
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            document.body.classList.add('modal-open');
          }
        }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        console.error('Error response:', error.response?.data);
        
        let errorMessage = 'Failed to load order details';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 404) {
          errorMessage = 'Order not found';
        } else if (error.response?.status === 401) {
          errorMessage = 'Unauthorized access';
        }
        
        this.showToast(errorMessage, 'error');
      }
    },

    async updateOrderStatus(orderId, status) {
      try {
        await axios.put(`/seller/orders/${orderId}/status`, { status });
        await this.fetchOrders();
        await this.fetchStats();
        
        // Close dropdown
        this.openDropdownId = null;
        
        // Show success message
        this.showToast('Order status updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating order status:', error);
        this.showToast('Failed to update order status', 'error');
      }
    },

    closeModal() {
      const modalElement = document.getElementById('orderDetailsModal');
      if (modalElement && window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      } else {
        // Fallback: hide modal manually
        if (modalElement) {
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
          document.body.classList.remove('modal-open');
          // Remove backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }
    },

    updateOrderStatusFromModal() {
      // This would open a status update modal or form
      // For now, just close the modal
      this.closeModal();
    },

    refreshOrders() {
      this.fetchOrders();
      this.fetchStats();
    },

    async exportOrders() {
      try {
        if (this.orders.length === 0) {
          this.showToast('No orders to export', 'warning');
          return;
        }

        this.isExporting = true;

        // Prepare CSV data
        const csvData = this.prepareCSVData();
        
        // Create and download CSV file with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `orders-export-${timestamp}.csv`;
        this.downloadCSV(csvData, filename);
        
        this.showToast('Orders exported successfully!', 'success');
      } catch (error) {
        console.error('Error exporting orders:', error);
        this.showToast('Failed to export orders', 'error');
      } finally {
        this.isExporting = false;
      }
    },

    prepareCSVData() {
      const headers = [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Product Name',
        'Quantity',
        'Unit Price',
        'Total Amount',
        'Status',
        'Order Date',
        'Payment Method',
        'Mintiss Value',
        'Redeem Amount'
      ];

      const rows = this.orders.map(order => [
        order.id,
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        order.product?.name || 'N/A',
        order.quantity,
        order.price || '0.00',
        order.total_amount || '0.00',
        order.status,
        this.formatDateForCSV(order.created_at),
        order.payment_method || 'N/A',
        order.mintiss_value || '0.00',
        order.redeem_amount || '0.00'
      ]);

      return [headers, ...rows];
    },

    formatDateForCSV(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    downloadCSV(data, filename) {
      // Convert data to CSV string
      const csvContent = data.map(row => 
        row.map(field => {
          // Escape fields that contain commas, quotes, or newlines
          if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        }).join(',')
      ).join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    showToast(message, type = 'info') {
      // Simple toast implementation without Bootstrap dependency
      const toast = document.createElement('div');
      toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
      `;
      
      toast.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="toast-body flex-grow-1">${message}</div>
          <button type="button" class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentElement) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 5000);
    }
  }
};
</script>

<style scoped>
.seller-orders-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  color: white;
  padding: 2rem 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
}

.header-actions .btn {
  border-radius: 8px;
  font-weight: 500;
}

.stats-section {
  padding: 2rem 0;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-right: 1rem;
}

.stat-icon.pending { background: #ffc107; }
.stat-icon.processing { background: #17a2b8; }
.stat-icon.shipped { background: #6f42c1; }
.stat-icon.delivered { background: #28a745; }

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.stat-label {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.filters-section {
  padding: 1rem 0;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box .form-control {
  padding-left: 40px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-select {
  border-radius: 8px;
  border: 1px solid #ddd;
}

.orders-section {
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 12px 12px 0 0 !important;
  padding: 1.5rem;
}

.table {
  margin: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #333;
  padding: 1rem;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

.order-id {
  font-weight: 600;
  color: #007aff;
}

.customer-name {
  font-weight: 600;
  color: #333;
}

.customer-email {
  font-size: 0.85rem;
  color: #666;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.product-price {
  font-size: 0.85rem;
  color: #666;
}

.quantity-badge {
  background: #e9ecef;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.total-amount {
  font-weight: 600;
  color: #28a745;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #d1ecf1; color: #0c5460; }
.status-shipped { background: #e2e3f1; color: #383d41; }
.status-delivered { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.order-date {
  font-size: 0.85rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item label {
  font-weight: 600;
  color: #666;
  margin: 0;
}

.product-details {
  display: flex;
  gap: 1rem;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.5rem;
}

.order-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-item.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #007aff;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.shipping-address {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.shipping-address p {
  margin: 0.25rem 0;
}

/* Custom Dropdown Styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  min-width: 160px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover {
  color: #1e2125;
  background-color: #e9ecef;
}

.dropdown-item.text-danger:hover {
  color: #fff;
  background-color: #dc3545;
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    margin-top: 1rem;
  }
  
  .stats-section {
    padding: 1rem 0;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
