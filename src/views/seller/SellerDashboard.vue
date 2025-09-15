<template>
  <div class="seller-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <div class="welcome-section">
            <h1 class="dashboard-title">
              <i class="bi bi-speedometer2 me-2"></i>
              Dashboard
            </h1>
            <p class="dashboard-subtitle">
              Welcome back, <span class="user-name">{{ user?.name || 'Seller' }}</span>! 
              Here's what's happening with your store today.
            </p>
          </div>
          <div class="header-actions">
            <button class="btn btn-refresh" @click="refreshData" :disabled="loading">
              <i class="bi bi-arrow-clockwise me-1" :class="{ 'spinning': loading }"></i>
              Refresh
            </button>
            <router-link to="/seller/orders" class="btn btn-primary">
              <i class="bi bi-list-ul me-1"></i>
              View Orders
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-card total-orders">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="bi bi-cart-check"></i>
              </div>
              <div class="stat-trend positive">
                <i class="bi bi-arrow-up"></i>
                <span>+{{ stats.this_month_orders || 0 }}</span>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.total_orders || 0 }}</h3>
              <p class="stat-label">Total Orders</p>
              <div class="stat-description">This month</div>
            </div>
          </div>

          <div class="stat-card pending-orders">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div class="stat-trend" :class="stats.pending_orders > 0 ? 'warning' : 'positive'">
                <i :class="stats.pending_orders > 0 ? 'bi bi-exclamation-triangle' : 'bi bi-check-circle'"></i>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.pending_orders || 0 }}</h3>
              <p class="stat-label">Pending Orders</p>
              <div class="stat-description">{{ stats.pending_orders > 0 ? 'Needs attention' : 'All caught up' }}</div>
            </div>
          </div>

          <div class="stat-card revenue">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="bi bi-currency-rupee"></i>
              </div>
              <div class="stat-trend positive">
                <i class="bi bi-trending-up"></i>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">₹{{ formatCurrency(stats.total_revenue || 0) }}</h3>
              <p class="stat-label">Total Revenue</p>
              <div class="stat-description">From delivered orders</div>
            </div>
          </div>

          <div class="stat-card today-orders">
            <div class="stat-header">
              <div class="stat-icon">
                <i class="bi bi-calendar-day"></i>
              </div>
              <div class="stat-trend" :class="stats.today_orders > 0 ? 'positive' : 'neutral'">
                <i class="bi bi-calendar-check"></i>
              </div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.today_orders || 0 }}</h3>
              <p class="stat-label">Today's Orders</p>
              <div class="stat-description">{{ stats.today_orders > 0 ? 'Great day!' : 'No orders yet' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">
      <div class="content-container">
        <div class="content-grid">
          <!-- Recent Orders -->
          <div class="content-main">
            <div class="modern-card">
              <div class="card-header">
                <div class="header-content">
                  <div class="header-info">
                    <i class="bi bi-clock-history"></i>
                    <h5 class="card-title">Recent Orders</h5>
                  </div>
                  <router-link to="/seller/orders" class="btn btn-outline-primary">
                    <i class="bi bi-arrow-right me-1"></i>
                    View All
                  </router-link>
                </div>
              </div>
              <div class="card-body">
                <div v-if="loading" class="loading-state">
                  <div class="spinner"></div>
                  <p>Loading orders...</p>
                </div>
                <div v-else-if="recentOrders.length === 0" class="empty-state">
                  <i class="bi bi-inbox"></i>
                  <h6>No recent orders</h6>
                  <p>Your recent orders will appear here</p>
                </div>
                <div v-else class="orders-list">
                  <div
                    v-for="order in recentOrders"
                    :key="order.id"
                    class="order-item"
                    @click="viewOrderDetails(order.id)"
                  >
                    <div class="order-main">
                      <div class="order-id">#{{ order.id }}</div>
                      <div class="order-customer">{{ order.user?.name || 'N/A' }}</div>
                      <div class="order-product">{{ order.product?.name || 'N/A' }}</div>
                    </div>
                    <div class="order-side">
                      <div class="order-amount">₹{{ order.total_amount }}</div>
                      <div class="order-status">
                        <span class="status-badge" :class="'status-' + order.status">
                          {{ order.status }}
                        </span>
                      </div>
                      <div class="order-date">{{ formatDate(order.created_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="content-sidebar">
            <!-- Quick Actions -->
            <div class="modern-card">
              <div class="card-header">
                <div class="header-info">
                  <i class="bi bi-lightning"></i>
                  <h5 class="card-title">Quick Actions</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="quick-actions-grid">
                  <router-link to="/seller/products/add" class="quick-action">
                    <div class="action-icon">
                      <i class="bi bi-plus-circle"></i>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Add Product</span>
                      <span class="action-desc">Create new listing</span>
                    </div>
                  </router-link>
                  <router-link to="/seller/orders" class="quick-action">
                    <div class="action-icon">
                      <i class="bi bi-list-ul"></i>
                    </div>
                    <div class="action-content">
                      <span class="action-title">View Orders</span>
                      <span class="action-desc">Manage orders</span>
                    </div>
                  </router-link>
                  <router-link to="/seller/text-management" class="quick-action">
                    <div class="action-icon">
                      <i class="bi bi-type"></i>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Text Management</span>
                      <span class="action-desc">Configure text pricing</span>
                    </div>
                  </router-link>
                  <router-link to="/seller/profile" class="quick-action">
                    <div class="action-icon">
                      <i class="bi bi-person-gear"></i>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Edit Profile</span>
                      <span class="action-desc">Update settings</span>
                    </div>
                  </router-link>
                  <button class="quick-action" @click="refreshData">
                    <div class="action-icon">
                      <i class="bi bi-arrow-clockwise"></i>
                    </div>
                    <div class="action-content">
                      <span class="action-title">Refresh Data</span>
                      <span class="action-desc">Update dashboard</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Order Status Overview -->
            <div class="modern-card">
              <div class="card-header">
                <div class="header-info">
                  <i class="bi bi-pie-chart"></i>
                  <h5 class="card-title">Order Status</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="status-overview">
                  <div class="status-item">
                    <div class="status-info">
                      <span class="status-dot pending"></span>
                      <span class="status-label">Pending</span>
                    </div>
                    <span class="status-count">{{ stats.pending_orders || 0 }}</span>
                  </div>
                  <div class="status-item">
                    <div class="status-info">
                      <span class="status-dot processing"></span>
                      <span class="status-label">Processing</span>
                    </div>
                    <span class="status-count">{{ stats.processing_orders || 0 }}</span>
                  </div>
                  <div class="status-item">
                    <div class="status-info">
                      <span class="status-dot shipped"></span>
                      <span class="status-label">Shipped</span>
                    </div>
                    <span class="status-count">{{ stats.shipped_orders || 0 }}</span>
                  </div>
                  <div class="status-item">
                    <div class="status-info">
                      <span class="status-dot delivered"></span>
                      <span class="status-label">Delivered</span>
                    </div>
                    <span class="status-count">{{ stats.delivered_orders || 0 }}</span>
                  </div>
                  <div class="status-item">
                    <div class="status-info">
                      <span class="status-dot cancelled"></span>
                      <span class="status-label">Cancelled</span>
                    </div>
                    <span class="status-count">{{ stats.cancelled_orders || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'SellerDashboard',
  data() {
    return {
      stats: {},
      recentOrders: [],
      loading: true,
      user: null
    };
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      try {
        this.loading = true;
        await Promise.all([
          this.fetchStats(),
          this.fetchRecentOrders(),
          this.fetchUserProfile()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const response = await axios.get('/seller/orders/stats');
        this.stats = response.data.data || {};
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },

    async fetchRecentOrders() {
      try {
        const response = await axios.get('/seller/orders/recent?limit=5');
        this.recentOrders = response.data.data || [];
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    },

    async fetchUserProfile() {
      try {
        const response = await axios.get('/seller/profile');
        this.user = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },

    viewOrderDetails(orderId) {
      this.$router.push(`/seller/orders/${orderId}`);
    },

    refreshData() {
      this.loadDashboardData();
      this.showToast('Data refreshed successfully!', 'success');
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN').format(amount);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
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
.seller-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Header Styles */
.dashboard-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.welcome-section {
  flex: 1;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #007aff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.user-name {
  color: #007aff;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-refresh {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stats Overview */
.stats-overview {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007aff 0%, #00d4ff 100%);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.stat-trend.positive {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.stat-trend.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-trend.neutral {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
  line-height: 1;
}

.stat-label {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.stat-description {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
}

/* Dashboard Content */
.dashboard-content {
  padding: 2rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-main {
  min-width: 0;
}

.content-sidebar {
  min-width: 0;
}

/* Modern Cards */
.modern-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-info i {
  color: #007aff;
  font-size: 1.25rem;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
}

.card-body {
  padding: 1.5rem;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-state i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h6 {
  color: #333;
  margin-bottom: 0.5rem;
}

/* Orders List */
.orders-list {
  max-height: 500px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.order-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.order-main {
  flex: 1;
}

.order-id {
  font-weight: 600;
  color: #007aff;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.order-customer {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.order-product {
  font-size: 0.85rem;
  color: #666;
}

.order-side {
  text-align: right;
}

.order-amount {
  font-weight: 600;
  color: #28a745;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.order-status {
  margin-bottom: 0.25rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #d1ecf1; color: #0c5460; }
.status-shipped { background: #e2e3f1; color: #383d41; }
.status-delivered { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }

.order-date {
  font-size: 0.8rem;
  color: #666;
}

/* Quick Actions */
.quick-actions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;
}

.quick-action:hover {
  background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.quick-action:hover .action-icon {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.action-content {
  flex: 1;
}

.action-title {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.action-desc {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Status Overview */
.status-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-dot.pending { background: #ffc107; }
.status-dot.processing { background: #17a2b8; }
.status-dot.shipped { background: #6f42c1; }
.status-dot.delivered { background: #28a745; }
.status-dot.cancelled { background: #dc3545; }

.status-label {
  font-size: 0.9rem;
  color: #333;
  text-transform: capitalize;
  font-weight: 500;
}

.status-count {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .stats-container {
    padding: 0 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .content-container {
    padding: 0 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .order-side {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .quick-actions-grid {
    gap: 0.75rem;
  }
  
  .quick-action {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1.5rem 0;
  }
  
  .dashboard-title {
    font-size: 1.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .card-header, .card-body {
    padding: 1rem;
  }
}
</style>
