<template>
  <div class="category-products-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: #007aff;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container py-5">
      <div class="text-center">
        <h2 class="text-danger mb-3">Error Loading Products</h2>
        <p class="text-muted mb-4">{{ error }}</p>
        <router-link to="/" class="btn modern-primary-btn">
          <i class="bi bi-house me-2"></i>Back to Home
        </router-link>
      </div>
    </div>

    <!-- Category Products Content -->
    <div v-else-if="category && products" class="container py-3">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb modern-breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none breadcrumb-link">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/categories" class="text-decoration-none breadcrumb-link">Categories</router-link>
          </li>
          <li class="breadcrumb-item active breadcrumb-active" aria-current="page">
            {{ category.name }}
          </li>
        </ol>
      </nav>

      <!-- Category Header -->
      <div class="category-header mb-4">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="category-title mb-2">{{ category.name }}</h1>
            <p class="category-subtitle text-muted mb-0">
              {{ products.length }} {{ products.length === 1 ? 'product' : 'products' }} found
            </p>
          </div>
          <div class="col-md-4 text-md-end">
            <div v-if="category.image" class="category-image-container">
              <img :src="category.image" :alt="category.name" class="category-image" />
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter-section mb-4">
        <div class="row">
          <div class="col-md-6">
            <div class="search-box">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search" style="color: #007aff;"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search products in {{ category.name }}..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="sort-options">
              <select class="form-select modern-select" v-model="sortBy" @change="handleSort">
                <option value="name">Sort by Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="mintiss">Mintiss Rewards</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="products-section">
        <div class="row g-3">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="modern-product-card" @click="goToProduct(product.id)">
              <div class="product-image-container">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="product-image"
                />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image" style="color: #007aff; font-size: 2rem;"></i>
                  <small style="color: #666;">No Image</small>
                </div>
                <div v-if="product.canceled_price" class="discount-badge">
                  {{ Math.round(((product.canceled_price - product.price) / product.canceled_price) * 100) }}% OFF
                </div>
              </div>
              <div class="product-info">
                <h6 class="product-name">{{ product.name }}</h6>
                <p class="product-description">{{ product.description || 'No description available.' }}</p>
                <div class="price-section">
                  <span class="product-price">₹{{ product.price }}</span>
                  <span v-if="product.canceled_price" class="original-price">₹{{ product.canceled_price }}</span>
                </div>
                <div v-if="product.mintiss" class="mintiss-reward">
                  <span style="color: #1177bf;">{{ product.mintiss }} Mintiss</span>
                </div>
                <div v-if="product.store" class="store-info">
                  <i class="bi bi-shop me-1" style="color: #666;"></i>
                  <small style="color: #666;">{{ product.store.name }}</small>
                </div>
                <div class="product-actions mt-2">
                  <button 
                    class="btn btn-sm modern-add-to-cart-btn"
                    @click.stop="addToCart(product)"
                    :disabled="isAddingToCart"
                  >
                    <i class="bi bi-cart-plus me-1"></i>
                    <span v-if="isAddingToCart">Adding...</span>
                    <span v-else>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Categories Suggestions -->
      <div v-if="otherCategories.length > 0" class="other-categories-section mt-5">
        <div class="section-header text-center mb-5">
          <h3 class="section-title">Explore Other Categories</h3>
          <p class="section-subtitle text-muted">Discover more products in different categories</p>
        </div>
        <div class="row g-4">
          <div
            v-for="(otherCategory, index) in otherCategories"
            :key="otherCategory.id"
            class="col-6 col-md-4 col-lg-3"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="category-card" @click="goToCategory(otherCategory.id)">
              <div class="category-image-container">
                <div class="image-overlay"></div>
                <img
                  v-if="otherCategory.image"
                  :src="otherCategory.image"
                  :alt="otherCategory.name"
                  class="category-image"
                />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-grid-3x3-gap"></i>
                </div>
                <div class="category-badge">
                  <i class="bi bi-arrow-right"></i>
                </div>
              </div>
              <div class="category-info">
                <h5 class="category-name">{{ otherCategory.name }}</h5>
                <p class="category-description">Explore products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Products Found -->
      <div v-else class="no-products-found text-center py-5">
        <i class="bi bi-search" style="color: #007aff; font-size: 3rem;"></i>
        <h3 class="mt-3 mb-2">No Products Found</h3>
        <p class="text-muted mb-4">
          {{ searchQuery ? `No products found matching "${searchQuery}"` : 'No products available in this category.' }}
        </p>
        <button v-if="searchQuery" @click="clearSearch" class="btn modern-primary-btn">
          <i class="bi bi-x-circle me-2"></i>Clear Search
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-container position-fixed top-0 end-0 p-3">
      <div class="toast show" role="alert">
        <div class="toast-header">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          <strong class="me-auto">Success</strong>
          <button type="button" class="btn-close" @click="showToast = false"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import cartService from '@/services/cartService';

export default {
  name: 'CategoryProducts',
  data() {
    return {
      category: null,
      products: [],
      filteredProducts: [],
      otherCategories: [],
      loading: true,
      error: null,
      searchQuery: '',
      sortBy: 'name',
      showToast: false,
      toastMessage: '',
      searchTimeout: null,
      isAddingToCart: false
    };
  },
  computed: {
    categoryId() {
      return this.$route.params.id;
    }
  },
  watch: {
    categoryId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchCategoryProducts();
        }
      }
    }
  },
  methods: {
    async fetchCategoryProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`/category/${this.categoryId}/products`),
          axios.get('/categories')
        ]);
        
        this.category = productsResponse.data.category;
        this.products = productsResponse.data.products;
        this.filteredProducts = [...this.products];
        this.applySorting();
        
        // Get other categories (exclude current category)
        this.otherCategories = categoriesResponse.data.filter(cat => cat.id != this.categoryId).slice(0, 4);
      } catch (error) {
        console.error('Error fetching category products:', error);
        this.error = 'Failed to load products. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.filterProducts();
      }, 300);
    },
    
    filterProducts() {
      if (!this.searchQuery.trim()) {
        this.filteredProducts = [...this.products];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredProducts = this.products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.store?.name.toLowerCase().includes(query)
        );
      }
      this.applySorting();
    },
    
    handleSort() {
      this.applySorting();
    },
    
    applySorting() {
      const products = [...this.filteredProducts];
      
      switch (this.sortBy) {
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price_low':
          products.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_high':
          products.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'mintiss':
          products.sort((a, b) => (b.mintiss || 0) - (a.mintiss || 0));
          break;
      }
      
      this.filteredProducts = products;
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.filterProducts();
    },
    
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    
    goToCategory(categoryId) {
      this.$router.push(`/category/${categoryId}`);
    },
    
    async addToCart(product) {
      try {
        this.isAddingToCart = true;
        
        // Add product to cart using cart service
        cartService.addToCart(product, 1);
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showToastMessage('Failed to add product to cart');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
/* ===== CATEGORY PRODUCTS PAGE STYLES ===== */
.category-products-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Breadcrumb Styles */
.modern-breadcrumb {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.breadcrumb-link {
  color: #007aff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #0056cc;
}

.breadcrumb-active {
  color: #666;
  font-weight: 500;
}

/* Category Header */
.category-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.category-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.category-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.category-image {
  max-width: 120px;
  max-height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Search and Filter */
.search-filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-box .input-group-text {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-right: none;
}

.search-box .form-control {
  border: 1px solid #e9ecef;
  border-left: none;
  padding: 12px 16px;
  font-size: 1rem;
}

.search-box .form-control:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 0.2rem rgba(0, 122, 255, 0.25);
}

.modern-select {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  background: white;
}

.modern-select:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 0.2rem rgba(0, 122, 255, 0.25);
}

/* Product Cards */
.modern-product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modern-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modern-product-card:hover .product-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.product-description {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
  flex-grow: 1;
}

.price-section {
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #007aff;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.mintiss-reward {
  margin-bottom: 8px;
}

.mintiss-reward span {
  font-size: 0.85rem;
  font-weight: 500;
}

.store-info {
  margin-top: auto;
}

.store-info small {
  font-size: 0.8rem;
}

/* No Products Found */
.no-products-found {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Buttons */
.modern-primary-btn {
  background: #007aff;
  border: 1px solid #007aff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.modern-primary-btn:hover {
  background: #0056cc;
  border-color: #0056cc;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

/* Product Actions */
.product-actions {
  margin-top: auto;
  padding-top: 0.5rem;
}

.modern-add-to-cart-btn {
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056cc 0%, #004499 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.modern-add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Other Categories Section */
.other-categories-section {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
}

/* Professional Category Cards (same as main categories page) */
.category-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.6s ease-out both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #007aff;
}

.category-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 122, 255, 0.1), rgba(0, 86, 204, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.category-card:hover .image-overlay {
  opacity: 1;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.no-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.no-image-placeholder i {
  font-size: 3rem;
  color: #007aff;
  opacity: 0.7;
}

.category-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 122, 255, 0.9);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.category-card:hover .category-badge {
  opacity: 1;
  transform: scale(1);
}

.category-info {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.category-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.category-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* Toast Styles */
.toast-container {
  z-index: 1055;
}

.toast {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== MOBILE RESPONSIVE STYLES ===== */
@media (max-width: 768px) {
  .category-title {
    font-size: 2rem;
  }
  
  .category-header {
    padding: 16px;
  }
  
  .search-filter-section {
    padding: 16px;
  }
  
  .product-image-container {
    height: 160px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-name {
    font-size: 0.9rem;
  }
  
  .product-description {
    font-size: 0.8rem;
  }
  
  .product-price {
    font-size: 1rem;
  }
  
  .modern-select {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  
  .search-box .form-control {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .other-categories-section {
    padding: 2rem 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .category-image-container {
    height: 160px;
  }
  
  .category-info {
    padding: 20px;
  }
  
  .category-name {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .category-title {
    font-size: 1.5rem;
  }
  
  .category-subtitle {
    font-size: 1rem;
  }
  
  .product-image-container {
    height: 140px;
  }
  
  .modern-product-card {
    border-radius: 8px;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .other-categories-section {
    padding: 1.5rem 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .category-image-container {
    height: 140px;
  }
  
  .category-card {
    border-radius: 16px;
  }
  
  .category-info {
    padding: 16px;
  }
  
  .category-name {
    font-size: 1rem;
  }
  
  .category-description {
    font-size: 0.8rem;
  }
}
</style>
