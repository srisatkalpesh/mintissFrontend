<template>
  <div class="order-details-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/seller/dashboard" class="text-white">Dashboard</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/seller/orders" class="text-white">Orders</router-link>
                </li>
                <li class="breadcrumb-item active text-white" aria-current="page">
                  Order #{{ order?.id }}
                </li>
              </ol>
            </nav>
            <h1 class="page-title">Order Details</h1>
            <p class="page-subtitle">Order #{{ order?.id }} - {{ order?.status }}</p>
          </div>
          <div class="col-md-6 text-end">
            <div class="header-actions">
              <button class="btn btn-outline-light me-2" @click="goBack">
                <i class="bi bi-arrow-left me-1"></i>
                Back
              </button>
              <button class="btn btn-light" @click="updateOrderStatus">
                <i class="bi bi-gear me-1"></i>
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Content -->
    <div class="order-content" v-if="order">
      <div class="container-fluid">
        <div class="row g-4">
          <!-- Order Information -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-info-circle me-2"></i>
                  Order Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="info-section">
                      <h6 class="section-title">Order Details</h6>
                      <div class="info-item">
                        <label>Order ID:</label>
                        <span>#{{ order.id }}</span>
                      </div>
                      <div class="info-item">
                        <label>Status:</label>
                        <span class="status-badge" :class="'status-' + order.status">
                          {{ order.status }}
                        </span>
                      </div>
                      <div class="info-item">
                        <label>Order Date:</label>
                        <span>{{ formatDate(order.created_at) }}</span>
                      </div>
                      <div class="info-item">
                        <label>Payment Method:</label>
                        <span>{{ order.payment_method || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-section">
                      <h6 class="section-title">Customer Information</h6>
                      <div class="info-item">
                        <label>Name:</label>
                        <span>{{ order.user?.name || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <label>Email:</label>
                        <span>{{ order.user?.email || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <label>Phone:</label>
                        <span>{{ order.user?.phone || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Information -->
            <div class="card mt-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-box me-2"></i>
                  Product Information
                </h5>
              </div>
              <div class="card-body">
                <div class="product-details">
                  <div class="product-image">
                    <img
                      v-if="order.product?.images && order.product.images.length > 0"
                      :src="order.product.images[0]"
                      :alt="order.product.name"
                      class="img-fluid rounded"
                    />
                    <div v-else class="no-image">
                      <i class="bi bi-image"></i>
                    </div>
                  </div>
                  <div class="product-info">
                    <h5 class="product-name">{{ order.product?.name || 'N/A' }}</h5>
                    <p class="product-description">{{ order.product?.description || 'N/A' }}</p>
                    <div class="product-meta">
                      <span class="product-price">₹{{ order.product?.price || 0 }}</span>
                      <span class="product-category">{{ order.product?.category?.name || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="card mt-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-geo-alt me-2"></i>
                  Shipping Address
                </h5>
              </div>
              <div class="card-body">
                <div class="shipping-address">
                  <!-- Address from relationship (newer orders) -->
                  <div v-if="order.address">
                    <p v-if="order.address.full_name"><strong>{{ order.address.full_name }}</strong></p>
                    <p v-if="order.address.mobile"><strong>Mobile:</strong> {{ order.address.mobile }}</p>
                    <p v-if="order.address.address_line">{{ order.address.address_line }}</p>
                    <p v-if="order.address.landmark">{{ order.address.landmark }}</p>
                    <p v-if="order.address.city || order.address.postal_code">
                      {{ order.address.city }}{{ order.address.city && order.address.postal_code ? ', ' : '' }}{{ order.address.postal_code }}
                    </p>
                    <p v-if="order.address.state">{{ order.address.state }}</p>
                    <p v-if="order.address.country">{{ order.address.country }}</p>
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

          <!-- Order Summary & Actions -->
          <div class="col-lg-4">
            <!-- Order Summary -->
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-receipt me-2"></i>
                  Order Summary
                </h5>
              </div>
              <div class="card-body">
                <div class="order-summary">
                  <div class="summary-item">
                    <span>Quantity:</span>
                    <span>{{ order.quantity }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Unit Price:</span>
                    <span>₹{{ order.price }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>₹{{ (order.price * order.quantity).toFixed(2) }}</span>
                  </div>
                  <div class="summary-item" v-if="order.mintiss_value">
                    <span>Mintiss Value:</span>
                    <span>{{ order.mintiss_value }}</span>
                  </div>
                  <div class="summary-item" v-if="order.redeem_amount">
                    <span>Redeem Amount:</span>
                    <span>₹{{ order.redeem_amount }}</span>
                  </div>
                  <hr>
                  <div class="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{{ order.total_amount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Update -->
            <div class="card mt-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-gear me-2"></i>
                  Update Status
                </h5>
              </div>
              <div class="card-body">
                <div class="status-update">
                  <div class="current-status mb-3">
                    <label class="form-label">Current Status:</label>
                    <span class="status-badge" :class="'status-' + order.status">
                      {{ order.status }}
                    </span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">New Status:</label>
                    <select class="form-select" v-model="newStatus">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <button
                    class="btn btn-primary w-100"
                    @click="updateStatus"
                    :disabled="newStatus === order.status || updating"
                  >
                    <span v-if="updating">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-circle me-1"></i>
                      Update Status
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card mt-4">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-lightning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div class="card-body">
                <div class="quick-actions">
                  <button class="btn btn-outline-primary w-100 mb-2" @click="printOrder">
                    <i class="bi bi-printer me-1"></i>
                    Print Order
                  </button>
                  <button class="btn btn-outline-secondary w-100 mb-2" @click="copyOrderLink">
                    <i class="bi bi-link-45deg me-1"></i>
                    Copy Order Link
                  </button>
                  <button class="btn btn-outline-info w-100" @click="contactCustomer">
                    <i class="bi bi-envelope me-1"></i>
                    Contact Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <div class="container-fluid">
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading order details...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <div class="container-fluid">
        <div class="text-center py-5">
          <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
          <h4 class="mt-3">Order Not Found</h4>
          <p class="text-muted">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <button class="btn btn-primary" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'SellerOrderDetails',
  data() {
    return {
      order: null,
      loading: true,
      newStatus: '',
      updating: false
    };
  },
  computed: {
  },
  async mounted() {
    await this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      try {
        this.loading = true;
        const orderId = this.$route.params.id;
        const response = await axios.get(`/seller/orders/${orderId}`);
        this.order = response.data.data;
        this.newStatus = this.order.status;
      } catch (error) {
        console.error('Error fetching order details:', error);
        this.order = null;
      } finally {
        this.loading = false;
      }
    },

    async updateStatus() {
      try {
        this.updating = true;
        await axios.put(`/seller/orders/${this.order.id}/status`, {
          status: this.newStatus
        });
        
        this.order.status = this.newStatus;
        this.showToast('Order status updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating order status:', error);
        this.showToast('Failed to update order status', 'error');
      } finally {
        this.updating = false;
      }
    },

    updateOrderStatus() {
      // Scroll to status update section
      const statusSection = document.querySelector('.status-update');
      if (statusSection) {
        statusSection.scrollIntoView({ behavior: 'smooth' });
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    printOrder() {
      window.print();
    },

    copyOrderLink() {
      const orderLink = window.location.href;
      navigator.clipboard.writeText(orderLink).then(() => {
        this.showToast('Order link copied to clipboard!', 'success');
      }).catch(() => {
        this.showToast('Failed to copy link', 'error');
      });
    },

    contactCustomer() {
      if (this.order?.user?.email) {
        const subject = `Regarding Order #${this.order.id}`;
        const mailtoLink = `mailto:${this.order.user.email}?subject=${encodeURIComponent(subject)}`;
        window.open(mailtoLink);
      } else {
        this.showToast('Customer email not available', 'error');
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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
.order-details-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  color: white;
  padding: 2rem 0;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
}

.breadcrumb-item a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: white;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0 0 0;
}

.page-subtitle {
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
}

.header-actions .btn {
  border-radius: 8px;
  font-weight: 500;
}

.order-content {
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

.info-section {
  margin-bottom: 2rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #007aff;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #666;
  margin: 0;
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

.product-details {
  display: flex;
  gap: 1.5rem;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
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
  font-size: 2rem;
}

.product-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
}

.product-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.product-price {
  font-weight: 600;
  color: #28a745;
  font-size: 1.1rem;
}

.product-category {
  background: #e9ecef;
  color: #666;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.shipping-address {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.shipping-address p {
  margin: 0.5rem 0;
}

.order-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-item.total {
  font-weight: 600;
  font-size: 1.2rem;
  color: #007aff;
  border-top: 2px solid #ddd;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.status-update {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.current-status {
  text-align: center;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.loading-state,
.error-state {
  padding: 2rem 0;
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
  
  .product-details {
    flex-direction: column;
    text-align: center;
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
