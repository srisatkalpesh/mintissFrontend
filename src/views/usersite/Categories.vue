<template>
  <div class="categories-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner-container">
          <div class="spinner-border professional-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <p class="loading-text">Loading Categories...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h2 class="error-title">Error Loading Categories</h2>
        <p class="error-message">{{ error }}</p>
        <router-link to="/" class="btn professional-btn">
          <i class="bi bi-house me-2"></i>Back to Home
        </router-link>
      </div>
    </div>

    <!-- Categories Content -->
    <div v-else class="categories-content">
      <!-- Professional Header Section -->
      <div class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
          <div class="container">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="professional-breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/" class="breadcrumb-link">
                    <i class="bi bi-house me-1"></i>Home
                  </router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  <i class="bi bi-grid-3x3-gap me-1"></i>Categories
                </li>
              </ol>
            </nav>

            <!-- Page Header -->
            <div class="page-header">
              <h1 class="page-title">
                <span class="title-highlight">Shop by Category</span>
              </h1>
              <p class="page-subtitle">
                Discover our carefully curated collection of product categories
              </p>
              <div class="stats-container">
                <div class="stat-item">
                  <span class="stat-number">{{ categories.length }}</span>
                  <span class="stat-label">Categories</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">{{ filteredCategories.length }}</span>
                  <span class="stat-label">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <div class="container">
          <div class="search-container">
            <div class="search-box">
              <div class="search-icon">
                <i class="bi bi-search"></i>
              </div>
              <input
                type="text"
                class="search-input"
                placeholder="Search categories..."
                v-model="searchQuery"
                @input="filterCategories"
              />
              <div v-if="searchQuery" class="clear-search" @click="clearSearch">
                <i class="bi bi-x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-section">
        <div class="container">
          <div v-if="filteredCategories.length > 0" class="categories-grid">
            <div class="row g-4">
              <div
                v-for="(category, index) in filteredCategories"
                :key="category.id"
                class="col-6 col-md-4 col-lg-3"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="category-card" @click="goToCategory(category.id)">
                  <div class="category-image-container">
                    <div class="image-overlay"></div>
                    <img
                      v-if="category.image"
                      :src="category.image"
                      :alt="category.name"
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
                    <h5 class="category-name">{{ category.name }}</h5>
                    <p class="category-description">Explore products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Categories Found -->
          <div v-else class="no-categories-found">
            <div class="no-results-content">
              <div class="no-results-icon">
                <i class="bi bi-search"></i>
              </div>
              <h3 class="no-results-title">No Categories Found</h3>
              <p class="no-results-message">
                {{ searchQuery ? `No categories found matching "${searchQuery}"` : 'No categories available.' }}
              </p>
              <button v-if="searchQuery" @click="clearSearch" class="btn professional-btn">
                <i class="bi bi-x-circle me-2"></i>Clear Search
              </button>
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
  name: 'Categories',
  data() {
    return {
      categories: [],
      filteredCategories: [],
      loading: true,
      error: null,
      searchQuery: ''
    };
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/categories');
        this.categories = response.data;
        this.filteredCategories = [...this.categories];
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    
    filterCategories() {
      if (!this.searchQuery.trim()) {
        this.filteredCategories = [...this.categories];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredCategories = this.categories.filter(category => 
          category.name.toLowerCase().includes(query)
        );
      }
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.filterCategories();
    },
    
    goToCategory(categoryId) {
      this.$router.push(`/category/${categoryId}`);
    }
  }
};
</script>

<style scoped>
/* ===== PROFESSIONAL CATEGORIES PAGE STYLES ===== */
.categories-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* ===== LOADING STATES ===== */
.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.loading-content {
  text-align: center;
  padding: 2rem;
}

.spinner-container {
  margin-bottom: 1rem;
}

.professional-spinner {
  width: 3rem;
  height: 3rem;
  color: #007aff;
  border-width: 3px;
}

.loading-text {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* ===== ERROR STATES ===== */
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.error-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
}

/* ===== HERO SECTION ===== */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  color: white;
  padding: 4rem 0 6rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
}

/* ===== BREADCRUMB ===== */
.professional-breadcrumb {
  margin-bottom: 2rem;
}

.professional-breadcrumb .breadcrumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  margin: 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.professional-breadcrumb .breadcrumb-item {
  color: rgba(255, 255, 255, 0.8);
}

.professional-breadcrumb .breadcrumb-item.active {
  color: white;
  font-weight: 600;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.breadcrumb-link:hover {
  color: white;
  transform: translateX(2px);
}

/* ===== PAGE HEADER ===== */
.page-header {
  text-align: center;
  padding: 2rem 0;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.title-highlight {
  background: linear-gradient(45deg, #ffffff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-weight: 400;
}

/* ===== STATS CONTAINER ===== */
.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* ===== SEARCH SECTION ===== */
.search-section {
  background: white;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 3;
  margin-top: -3rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.search-box:focus-within {
  border-color: #007aff;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.2);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #007aff;
  font-size: 1.2rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 60px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #999;
  font-weight: 400;
}

.clear-search {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 2;
}

.clear-search:hover {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

/* ===== CATEGORIES SECTION ===== */
.categories-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.categories-grid {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== CATEGORY CARDS ===== */
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
  height: 220px;
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

/* ===== NO RESULTS ===== */
.no-categories-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 4rem;
  color: #007aff;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.no-results-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 1rem;
}

.no-results-message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* ===== BUTTONS ===== */
.professional-btn {
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.professional-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.professional-btn:hover::before {
  left: 100%;
}

.professional-btn:hover {
  background: linear-gradient(135deg, #0056cc 0%, #004499 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
}

/* ===== MOBILE RESPONSIVE STYLES ===== */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
  
  .hero-section {
    padding: 3rem 0 4rem;
  }
  
  .search-section {
    margin-top: -2rem;
    padding: 1.5rem 0;
  }
  
  .search-input {
    padding: 16px 20px 16px 50px;
    font-size: 1rem;
  }
  
  .category-image-container {
    height: 180px;
  }
  
  .category-info {
    padding: 20px;
  }
  
  .category-name {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .hero-section {
    padding: 2rem 0 3rem;
  }
  
  .search-section {
    margin-top: -1.5rem;
    padding: 1rem 0;
  }
  
  .category-image-container {
    height: 160px;
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
  
  .categories-section {
    padding: 3rem 0;
  }
}
</style>
