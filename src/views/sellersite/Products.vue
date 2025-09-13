<template>
  <div class="seller-products">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <div class="page-title-section">
            <h1 class="page-title">
              <i class="bi bi-box me-2"></i>
              My Products
            </h1>
            <p class="page-subtitle">
              Manage your product listings and inventory
            </p>
          </div>
          <div class="header-actions">
            <button class="btn btn-refresh" @click="fetchProducts" :disabled="loading">
              <i class="bi bi-arrow-clockwise me-1" :class="{ 'spinning': loading }"></i>
              Refresh
            </button>
            <button class="btn btn-primary" @click="goToAdd">
              <i class="bi bi-plus-circle me-1"></i>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Content -->
    <div class="products-content">
      <div class="content-container">
        <!-- Stats Cards -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-box"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ products.length }}</h3>
                <p class="stat-label">Total Products</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-eye"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ activeProducts }}</h3>
                <p class="stat-label">Active Products</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-currency-rupee"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">₹{{ totalValue }}</h3>
                <p class="stat-label">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="products-table-section">
          <div class="modern-card">
            <div class="card-header">
              <div class="header-info">
                <i class="bi bi-list-ul"></i>
                <h5 class="card-title">Product List</h5>
              </div>
              <div class="table-actions">
                <div class="search-box">
                  <i class="bi bi-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    v-model="searchQuery"
                    @input="filterProducts"
                  >
                </div>
              </div>
            </div>
            <div class="card-body">
              <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Loading products...</p>
              </div>
              <div v-else-if="filteredProducts.length === 0" class="empty-state">
                <i class="bi bi-inbox"></i>
                <h6>{{ searchQuery ? 'No products found' : 'No products yet' }}</h6>
                <p>{{ searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first product' }}</p>
                <button v-if="!searchQuery" class="btn btn-primary" @click="goToAdd">
                  <i class="bi bi-plus-circle me-1"></i>
                  Add First Product
                </button>
              </div>
              <div v-else class="products-table">
                <div class="table-responsive">
                  <table class="modern-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in filteredProducts" :key="product.id" class="product-row">
                        <td class="product-info">
                          <div class="product-image">
                            <img 
                              :src="getProductImage(product)" 
                              :alt="product.name"
                              @error="handleImageError"
                            >
                          </div>
                          <div class="product-details">
                            <h6 class="product-name">{{ product.name }}</h6>
                            <p class="product-description">{{ truncateText(product.description, 50) }}</p>
                            <span class="product-code">Code: {{ product.unique_code || 'N/A' }}</span>
                          </div>
                        </td>
                        <td class="price-info">
                          <div class="current-price">₹{{ formatPrice(product.price) }}</div>
                          <div v-if="product.canceled_price" class="original-price">
                            ₹{{ formatPrice(product.canceled_price) }}
                          </div>
                        </td>
                        <td class="stock-info">
                          <span class="stock-badge" :class="getStockClass(product.stock)">
                            {{ product.stock || 0 }} units
                          </span>
                        </td>
                        <td class="status-info">
                          <span class="status-badge" :class="getStatusClass(product.status)">
                            {{ product.status || 'active' }}
                          </span>
                        </td>
                        <td class="actions-info">
                          <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary" @click="goToEdit(product)" title="Edit">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(product)" title="Delete">
                              <i class="bi bi-trash"></i>
                            </button>
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'SellerProducts',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: false,
      searchQuery: ''
    };
  },
  computed: {
    activeProducts() {
      return this.products.filter(p => p.status === 'active' || !p.status).length;
    },
    totalValue() {
      return this.products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0).toLocaleString();
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/products', { headers: { Authorization: `Bearer ${token}` } });
        let products = res.data.products || [];
        this.products = products.map(p => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : (p.images ? p.images.split(',') : []),
          mintiss: p.mintiss || ''
        }));
        this.filteredProducts = [...this.products];
      } catch (e) {
        console.error('Failed to fetch products.', e);
        this.showToast('Failed to load products', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    filterProducts() {
      if (!this.searchQuery.trim()) {
        this.filteredProducts = [...this.products];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.unique_code.toLowerCase().includes(query)
      );
    },
    
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        return product.images[0];
      }
      return '/img/placeholder-product.png';
    },
    
    handleImageError(event) {
      event.target.src = '/img/placeholder-product.png';
    },
    
    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    
    formatPrice(price) {
      return parseFloat(price || 0).toLocaleString();
    },
    
    getStockClass(stock) {
      const stockNum = parseInt(stock || 0);
      if (stockNum === 0) return 'out-of-stock';
      if (stockNum < 10) return 'low-stock';
      return 'in-stock';
    },
    
    getStatusClass(status) {
      return status === 'active' || !status ? 'active' : 'inactive';
    },
    
    goToAdd() {
      this.$router.push('/seller/products/add');
    },
    
    goToEdit(product) {
      this.$router.push(`/seller/products/${product.id}/edit`);
    },
    
    async deleteProduct(product) {
      if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
      
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/products/${product.id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        this.showToast('Product deleted successfully', 'success');
        this.fetchProducts();
      } catch (e) {
        console.error('Failed to delete product.', e);
        this.showToast('Failed to delete product', 'error');
      }
    },
    
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast-notification toast-${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
          ${message}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
          <i class="bi bi-x"></i>
        </button>
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }
};
</script>

<style scoped>
.seller-products {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.page-header::before {
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

.page-title-section {
  flex: 1;
}

.page-title {
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

.page-subtitle {
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  line-height: 1.5;
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

/* Content Styles */
.products-content {
  padding: 2rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  display: flex;
  align-items: center;
  gap: 1rem;
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
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
  line-height: 1;
}

.stat-label {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Products Table Section */
.products-table-section {
  margin-top: 2rem;
}

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

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: #666;
  z-index: 1;
}

.search-box input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.9rem;
  width: 300px;
  transition: all 0.3s ease;
  background: white;
}

.search-box input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.card-body {
  padding: 0;
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

/* Modern Table */
.products-table {
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.modern-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modern-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
}

.modern-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.product-row {
  transition: all 0.3s ease;
}

.product-row:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 300px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
}

.product-description {
  color: #666;
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  line-height: 1.3;
}

.product-code {
  color: #999;
  font-size: 0.8rem;
  font-family: monospace;
}

.price-info {
  text-align: right;
  min-width: 120px;
}

.current-price {
  font-weight: 600;
  color: #28a745;
  font-size: 1rem;
}

.original-price {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
}

.stock-info {
  text-align: center;
  min-width: 100px;
}

.stock-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stock-badge.in-stock {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.stock-badge.low-stock {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stock-badge.out-of-stock {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.status-info {
  text-align: center;
  min-width: 100px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-badge.inactive {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.actions-info {
  text-align: center;
  min-width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-buttons .btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Toast Notifications */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  z-index: 9999;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid #007aff;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-notification.toast-success {
  border-left-color: #28a745;
}

.toast-notification.toast-error {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.25rem;
  padding: 0;
  margin-left: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toast-close:hover {
  color: #333;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .content-container {
    padding: 0 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .search-box input {
    width: 200px;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    min-width: 200px;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.75rem 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.5rem 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .card-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .modern-table {
    font-size: 0.8rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.5rem;
  }
}
</style>
