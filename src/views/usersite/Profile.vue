<template>
  <div class="modern-profile-page">
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <i class="bi bi-person-fill"></i>
          </div>
          <div class="avatar-badge">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user.name || 'User' }}</h1>
          <p class="profile-email">{{ user.email }}</p>
          <div class="profile-role">
            <span class="role-badge">{{ user.role || 'Customer' }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <button v-if="!editMode" class="edit-btn" @click="editMode = true">
            <i class="bi bi-pencil"></i>
            <span>Edit Profile</span>
          </button>
        </div>
          </div>

      <!-- Profile Content -->
      <div class="profile-content">
            <!-- Edit Mode -->
        <form v-if="editMode" @submit.prevent="saveProfile" class="profile-form">
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input 
                  v-model="editUser.name" 
                  type="text" 
                  class="form-input" 
                  placeholder="Enter your full name"
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input 
                  v-model="editUser.email" 
                  type="email" 
                  class="form-input" 
                  placeholder="Enter your email"
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input 
                  v-model="editUser.phone" 
                  type="text" 
                  class="form-input" 
                  placeholder="Enter your phone number"
                  required 
                />
              </div>
                </div>
                </div>

          <div class="form-section">
            <h3 class="section-title">Account Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Account Role</label>
                <div class="form-display">
                  <span class="display-value">{{ user.role || 'Customer' }}</span>
                </div>
                </div>
              <div class="form-group">
                <label class="form-label">Mintiss Balance</label>
                <div class="form-display mintiss-balance">
                  <span class="display-value">{{ user.mintiss || '0.00000000' }}</span>
                  <i class="bi bi-gift"></i>
                </div>
              </div>
                </div>
              </div>

          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="loading">
              <i class="bi bi-save"></i>
              <span v-if="loading">Saving...</span>
              <span v-else>Save Changes</span>
                </button>
            <button type="button" class="cancel-btn" @click="cancelEdit">
              <i class="bi bi-x-lg"></i>
              <span>Cancel</span>
                </button>
              </div>
            </form>

            <!-- View Mode -->
        <div v-else class="profile-details">
          <div class="details-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="bi bi-person"></i>
                </div>
                <div class="detail-content">
                  <label class="detail-label">Full Name</label>
                  <span class="detail-value">{{ user.name || 'Not provided' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="bi bi-envelope"></i>
                </div>
                <div class="detail-content">
                  <label class="detail-label">Email Address</label>
                  <span class="detail-value">{{ user.email || 'Not provided' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="bi bi-telephone"></i>
                </div>
                <div class="detail-content">
                  <label class="detail-label">Phone Number</label>
                  <span class="detail-value">{{ user.phone || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3 class="section-title">Account Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon">
                </div>
                <div class="detail-content">
                  <label class="detail-label">Account Role</label>
                  <span class="detail-value role-value">{{ user.role || 'Customer' }}</span>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-icon">
                  <i class="bi bi-gift"></i>
                </div>
                <div class="detail-content">
                  <label class="detail-label">Mintiss Balance</label>
                  <span class="detail-value mintiss-value">{{ user.mintiss || '0.00000000' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="account-actions">
            <button class="logout-btn" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </button>
          </div>
                </div>
              </div>

      <!-- Orders Section -->
      <div class="orders-section">
        <div class="orders-header">
          <h3 class="section-title">My Orders</h3>
          <div class="order-filters">
            <button 
              v-for="filter in orderFilters" 
              :key="filter.value"
              :class="['filter-btn', { active: selectedOrderFilter === filter.value }]"
              @click="changeOrderFilter(filter.value)"
            >
              {{ filter.label }}
                </button>
          </div>
        </div>

        <!-- Order Stats -->
        <div v-if="orderStats" class="order-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-bag"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ orderStats.total_orders }}</span>
              <span class="stat-label">Total Orders</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ orderStats.delivered_orders }}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-clock"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ orderStats.pending_orders + orderStats.processing_orders + orderStats.shipped_orders }}</span>
              <span class="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        <!-- Orders List -->
        <div class="orders-list">
          <div v-if="loadingOrders" class="loading-orders">
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Loading orders...</p>
            </div>
          </div>

          <div v-else-if="orders && orders.length > 0" class="orders-grid">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <div class="order-image">
                <img 
                  v-if="order.product_image" 
                  :src="order.product_image" 
                  :alt="order.product_name"
                  @error="handleImageError"
                />
                <div v-else class="no-image">
                  <i class="bi bi-image"></i>
                </div>
              </div>
              <div class="order-content">
                <div class="order-header">
                  <h4 class="order-product-name">{{ order.product_name }}</h4>
                  <span :class="['order-status', `status-${order.status}`]">
                    {{ formatOrderStatus(order.status) }}
                  </span>
                </div>
                <div class="order-details">
                  <div class="order-detail-item">
                    <span class="detail-label">Store:</span>
                    <span class="detail-value">{{ order.store_name }}</span>
                  </div>
                  <div class="order-detail-item">
                    <span class="detail-label">Quantity:</span>
                    <span class="detail-value">{{ order.quantity }}</span>
                  </div>
                  <div class="order-detail-item">
                    <span class="detail-label">Order Date:</span>
                    <span class="detail-value">{{ formatDate(order.created_at) }}</span>
                  </div>
                  <div v-if="order.custom_text" class="order-detail-item text-customization">
                    <span class="detail-label">
                      <i class="bi bi-type me-1"></i>Custom Text:
                    </span>
                    <span class="detail-value">{{ order.custom_text }}</span>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="order-price">
                    <span class="price-label">Total:</span>
                    <span class="price-value">₹{{ order.total_amount }}</span>
                  </div>
                  <div v-if="order.mintiss_value" class="order-mintiss">
                    <i class="bi bi-gift"></i>
                    <span>+{{ order.mintiss_value }} mintiss</span>
                  </div>
                </div>
                <div class="order-actions">
                  <button @click="viewInvoice(order.id)" class="invoice-btn">
                    <i class="bi bi-receipt"></i>
                    <span>{{ order.invoice_url ? 'View Invoice' : 'Generate Invoice' }}</span>
                  </button>
                  <a v-if="order.invoice_url" :href="order.invoice_url" target="_blank" class="download-btn">
                    <i class="bi bi-download"></i>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-orders">
            <div class="no-orders-content">
              <i class="bi bi-bag"></i>
              <h4>No orders found</h4>
              <p>You haven't placed any orders yet.</p>
              <router-link to="/" class="shop-btn">
                <i class="bi bi-shop"></i>
                <span>Start Shopping</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="orderPagination && orderPagination.last_page > 1" class="orders-pagination">
          <button 
            class="pagination-btn"
            :disabled="orderPagination.current_page === 1"
            @click="loadOrders(orderPagination.current_page - 1)"
          >
            <i class="bi bi-chevron-left"></i>
            Previous
          </button>
          <span class="pagination-info">
            Page {{ orderPagination.current_page }} of {{ orderPagination.last_page }}
          </span>
          <button 
            class="pagination-btn"
            :disabled="orderPagination.current_page === orderPagination.last_page"
            @click="loadOrders(orderPagination.current_page + 1)"
          >
            Next
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
  name: 'Profile',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
      editMode: false,
      editUser: {},
      loading: false,
      // Orders data
      orders: [],
      orderStats: null,
      orderPagination: null,
      loadingOrders: false,
      selectedOrderFilter: 'all',
      orderFilters: [
        { label: 'All Orders', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    };
  },
  async mounted() {
    this.editUser = { ...this.user };
    await this.loadOrderStats();
    await this.loadOrders();
  },
  methods: {
    async handleLogout() {
      try {
        await axios.get('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toastService.success('Logged out successfully');
        window.location.href = '/';
      } catch (error) {
        toastService.error('Failed to logout');
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.editUser = { ...this.user };
    },
    async saveProfile() {
      this.loading = true;
      try {
        const payload = {
          name: this.editUser.name,
          email: this.editUser.email,
          phone: this.editUser.phone
        };
        await axios.put('/user/profile', payload);
        this.user = { ...this.user, ...payload };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.editMode = false;
        toastService.success('Profile updated successfully');
      } catch (e) {
        toastService.error(e.response?.data?.message || 'Failed to update profile');
      } finally {
        this.loading = false;
      }
    },
    
    // Orders methods
    async loadOrderStats() {
      try {
        const response = await axios.get('/user/orders/stats');
        if (response.data.success) {
          this.orderStats = response.data.data;
        }
      } catch (error) {
        console.error('Error loading order stats:', error);
      }
    },
    
    async loadOrders(page = 1) {
      try {
        this.loadingOrders = true;
        const params = {
          page: page,
          per_page: 6
        };
        
        if (this.selectedOrderFilter !== 'all') {
          params.status = this.selectedOrderFilter;
        }
        
        const response = await axios.get('/user/orders', { params });
        if (response.data.success) {
          this.orders = response.data.data.orders;
          this.orderPagination = response.data.data.pagination;
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        this.showToast('Failed to load orders', 'error');
      } finally {
        this.loadingOrders = false;
      }
    },
    
    async changeOrderFilter(filter) {
      this.selectedOrderFilter = filter;
      await this.loadOrders(1);
    },
    
    formatOrderStatus(status) {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      };
      return statusMap[status] || status;
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    },
    
    async viewInvoice(orderId) {
      try {
        // Check if invoice already exists
        const order = this.orders.find(o => o.id === orderId);
        
        if (order && order.invoice_url) {
          // Invoice exists, navigate to invoice view
          this.$router.push(`/invoice/${orderId}`);
        } else {
          // Generate invoice first
          this.showToast('Generating invoice...', 'info');
          
          const response = await axios.post(`/user/orders/${orderId}/invoice/generate`);
          
          if (response.data.status) {
            // Update the order with invoice URL
            if (order) {
              order.invoice_url = response.data.data.invoice_url;
            }
            
            this.showToast('Invoice generated successfully!', 'success');
            
            // Navigate to invoice view
            setTimeout(() => {
              this.$router.push(`/invoice/${orderId}`);
            }, 1000);
          } else {
            this.showToast(response.data.message || 'Failed to generate invoice', 'error');
          }
        }
      } catch (error) {
        console.error('Error viewing invoice:', error);
        
        // Handle specific error cases
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || 'Failed to generate invoice';
          
          switch (status) {
            case 404:
              this.showToast('Order not found or you do not have permission to access this order', 'error');
              break;
            case 401:
              this.showToast('Please login to access invoices', 'error');
              break;
            case 500:
              this.showToast('Server error. Please try again later.', 'error');
              break;
            default:
              this.showToast(message, 'error');
          }
        } else {
          this.showToast('Network error. Please check your connection and try again.', 'error');
        }
      }
    },

    showToast(message, type = 'info') {
      // Simple toast notification
      const toast = document.createElement('div');
      toast.className = `toast-notification toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      `;
      
      if (type === 'success') {
        toast.style.backgroundColor = '#28a745';
      } else if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
      } else if (type === 'info') {
        toast.style.backgroundColor = '#17a2b8';
      }
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  }
};
</script>

<style scoped>
/* ===== MODERN PROFILE PAGE STYLES ===== */

/* Main Page Layout */
.modern-profile-page {
  background: #fafbfc;
  min-height: 100vh;
  padding: 2rem 0;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Profile Header */
.profile-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8eaed;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007aff 0%, #00d4ff 100%);
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  position: relative;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.profile-email {
  font-size: 1rem;
  color: #5f6368;
  margin: 0 0 1rem 0;
  letter-spacing: 0.01em;
}

.profile-role {
  display: flex;
  align-items: center;
}

.role-badge {
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.profile-actions {
  flex-shrink: 0;
}

.edit-btn {
  background: white;
  border: 2px solid #007aff;
  color: #007aff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.edit-btn:hover {
  background: #007aff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

/* Profile Content */
.profile-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8eaed;
}

/* Form Styles */
.profile-form {
  max-width: 100%;
}

.form-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.01em;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #007aff 0%, #00d4ff 100%);
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8eaed;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: white;
  transition: all 0.3s ease;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-input::placeholder {
  color: #9aa0a6;
  font-weight: 400;
}

.form-display {
  padding: 0.75rem 1rem;
  border: 2px solid #e8eaed;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #5f6368;
}

.display-value {
  font-weight: 500;
  color: #1a1a1a;
}

.form-display i {
  color: #007aff;
  font-size: 1.1rem;
}

.mintiss-balance .display-value {
  color: #007aff;
  font-weight: 600;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e8eaed;
}

.save-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  background: white;
  border: 2px solid #6c757d;
  color: #6c757d;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Details View */
.profile-details {
  max-width: 100%;
}

.details-section {
  margin-bottom: 2.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e8eaed;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #dadce0;
}

.detail-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #5f6368;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.01em;
}

.role-value {
  color: #007aff;
}

.mintiss-value {
  color: #007aff;
  font-weight: 700;
}

/* Mobile-First Responsive Design */
/* Base styles are mobile-first */

/* Small mobile devices (320px and up) */
@media (min-width: 320px) {
  .modern-profile-page {
    padding: 1rem 0;
  }
  
  .profile-container {
    padding: 0 0.5rem;
  }
  
  .profile-header {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .profile-details h1 {
    font-size: 1.5rem;
  }
  
  .profile-details p {
    font-size: 0.9rem;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .profile-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .profile-section {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .detail-item {
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .detail-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .detail-label {
    font-size: 0.75rem;
  }
  
  .detail-value {
    font-size: 0.9rem;
  }
  
  .account-actions {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  
  .logout-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .profile-header {
    padding: 2rem 1.5rem;
  }
  
  .profile-info {
    flex-direction: row;
    text-align: left;
  }
  
  .profile-avatar {
    width: 90px;
    height: 90px;
    font-size: 2.2rem;
  }
  
  .profile-details h1 {
    font-size: 1.75rem;
  }
  
  .profile-details p {
    font-size: 1rem;
  }
  
  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-profile-page {
    padding: 1.5rem 0;
  }
  
  .profile-container {
    padding: 0 1rem;
  }
  
  .profile-header {
    padding: 2.5rem 2rem;
    border-radius: 16px;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .profile-details h1 {
    font-size: 2rem;
  }
  
  .profile-details p {
    font-size: 1.1rem;
  }
  
  .profile-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  .stat-card {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 1rem;
  }
  
  .profile-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .profile-section {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .detail-item {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .detail-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .detail-label {
    font-size: 0.8rem;
  }
  
  .detail-value {
    font-size: 1rem;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-profile-page {
    padding: 2rem 0;
  }
  
  .profile-container {
    padding: 0 1rem;
  }
  
  .profile-header {
    padding: 3rem 2.5rem;
    border-radius: 20px;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
  
  .profile-details h1 {
    font-size: 2.5rem;
  }
  
  .profile-details p {
    font-size: 1.2rem;
  }
  
  .profile-stats {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .stat-card {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 1.1rem;
  }
  
  .profile-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .profile-section {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .detail-item {
    padding: 1.25rem;
    border-radius: 16px;
  }
  
  .detail-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .detail-label {
    font-size: 0.9rem;
  }
  
  .detail-value {
    font-size: 1.1rem;
  }
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
  .profile-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    text-align: center;
  }
  
  .stat-content {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .detail-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .detail-content {
    align-items: center;
  }
  
  .account-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {
  .stat-card,
  .detail-item,
  .logout-btn {
    min-height: 44px;
  }
  
  .stat-card:active,
  .detail-item:active {
    transform: scale(0.98);
  }
}

/* Account Actions */
.account-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e8eaed;
}

.logout-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modern-profile-page {
    padding: 1rem 0;
  }
  
  .profile-container {
    padding: 0 0.5rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .profile-content {
    padding: 1.5rem;
  }
  
  .form-grid,
  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .save-btn,
  .cancel-btn,
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
  
  .detail-item {
    padding: 1rem;
  }
  
  .detail-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 1rem;
  }
  
  .avatar-circle {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .avatar-badge {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  
  .profile-name {
    font-size: 1.25rem;
  }
  
  .profile-content {
    padding: 1rem;
  }
  
  .form-section,
  .details-section {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
}

/* ===== ORDERS SECTION STYLES ===== */

/* Orders Section */
.orders-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8eaed;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.order-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e8eaed;
  background: white;
  color: #5f6368;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #007aff;
  color: #007aff;
}

.filter-btn.active {
  background: #007aff;
  border-color: #007aff;
  color: white;
}

/* Order Stats */
.order-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e8eaed;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #dadce0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #5f6368;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Orders List */
.orders-list {
  margin-bottom: 2rem;
}

.loading-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e8eaed;
  transition: all 0.3s ease;
  display: flex;
  gap: 1rem;
}

.order-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #dadce0;
  transform: translateY(-2px);
}

.order-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e8eaed;
}

.order-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #9aa0a6;
  font-size: 1.5rem;
}

.order-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.order-product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.status-shipped {
  background: #cce5ff;
  color: #004085;
  border: 1px solid #b3d7ff;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.detail-label {
  color: #5f6368;
  font-weight: 500;
}

.detail-value {
  color: #1a1a1a;
  font-weight: 600;
}

.text-customization {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.text-customization .detail-label {
  color: #856404;
  font-weight: 600;
}

.text-customization .detail-value {
  color: #856404;
  font-style: italic;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.order-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.85rem;
  color: #5f6368;
  font-weight: 500;
}

.price-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #137333;
}

.order-mintiss {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #007aff;
  font-size: 0.8rem;
  font-weight: 600;
}

.order-mintiss i {
  font-size: 0.9rem;
}

/* Order Actions */
.order-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e8eaed;
}

.invoice-btn,
.download-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.invoice-btn {
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.invoice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
}

/* Removed disabled state - all orders can generate invoices */

.download-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  color: white;
  text-decoration: none;
}

/* No Orders */
.no-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.no-orders-content {
  text-align: center;
  max-width: 300px;
}

.no-orders-content i {
  font-size: 4rem;
  color: #9aa0a6;
  margin-bottom: 1rem;
}

.no-orders-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.no-orders-content p {
  color: #5f6368;
  margin: 0 0 2rem 0;
  font-size: 0.9rem;
}

.shop-btn {
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.shop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
  color: white;
  text-decoration: none;
}

/* Pagination */
.orders-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e8eaed;
}

.pagination-btn {
  background: white;
  border: 2px solid #e8eaed;
  color: #5f6368;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #007aff;
  color: #007aff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #5f6368;
  font-weight: 500;
}

/* Mobile Responsive for Orders */
@media (max-width: 768px) {
  .orders-section {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .orders-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .order-filters {
    justify-content: center;
  }
  
  .order-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .order-card {
    padding: 1rem;
  }
  
  .order-image {
    width: 60px;
    height: 60px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .order-status {
    align-self: flex-start;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .orders-pagination {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .pagination-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .orders-section {
    padding: 1rem;
  }
  
  .order-stats {
    grid-template-columns: 1fr;
  }
  
  .order-card {
    flex-direction: column;
    text-align: center;
  }
  
  .order-image {
    align-self: center;
  }
  
  .order-header {
    text-align: center;
  }
  
  .order-details {
    text-align: left;
  }
  
  .order-footer {
    text-align: center;
  }
}

/* Toast Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
