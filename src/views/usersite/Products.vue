<template>
  <div class="amazon-style-homepage">
    
    <!-- Clean Hero Banners -->
    <div v-if="heroSections.length > 0" class="amazon-hero-section">
      <div class="hero-carousel">
        <div v-for="hero in heroSections" :key="hero.id" class="hero-slide" @click="handleBannerClick(hero)">
          <img 
            :src="hero.image_url" 
            :alt="hero.title || 'Banner Image'" 
            class="hero-image"
            @error="handleHeroImageError"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Amazon-style No Banners -->
    <div v-else class="amazon-no-banners">
      <div class="container">
        <div class="no-banners-content">
          <i class="bi bi-image no-banners-icon"></i>
          <h3>No Featured Banners</h3>
          <p>Check back later for amazing offers and promotions</p>
        </div>
      </div>
    </div>

    <!-- Amazon-style Info Cards -->
    <div class="amazon-info-section">
      <div class="container">
        <div class="info-cards-grid">
          <div v-for="card in infoCards" :key="card.title" 
               class="amazon-info-card"
               @click="handleCardClick(card.title)"
               :class="{ 'clickable': isClickableCard(card.title) }">
            <div class="card-icon">
              <i :class="card.icon"></i>
            </div>
            <div class="card-content">
              <h4 class="card-title">{{ card.title }}</h4>
              <p class="card-subtitle">{{ card.span || '&nbsp;' }}</p>
              <span class="card-value">{{ card.value || '&nbsp;' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Categories Section -->
    <div v-if="categories.length > 0" class="compact-categories-section">
      <div class="container">
        <div class="categories-header">
          <h3 class="categories-title">Categories</h3>
        </div>
        <div class="compact-categories-grid">
          <div v-for="(category, index) in categories.slice(0, 4)" :key="category.id" 
               class="compact-category-item"
               @click="goToCategory(category.id)">
            <div class="category-icon">
              <img v-if="category.image" :src="category.image" :alt="category.name" class="category-icon-image" />
              <i v-else class="bi bi-grid-3x3-gap"></i>
            </div>
            <span class="category-label">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Amazon-style Featured Products -->
    <div v-if="firstProducts.length > 0" class="amazon-products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Products <span class="product-count">({{ firstProducts.length }})</span></h2>
          <p class="section-subtitle">Discover our top-rated products</p>
        </div>
        <div class="row g-5">
          <div
            v-for="product in firstProducts"
            :key="product.unique_code"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="modern-product-card" @click="goToProductDetail(product.id, product)">
              <div class="product-image-container">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image" style="color: #007aff; font-size: 2rem;"></i>
                  <small style="color: #666;">No Image</small>
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
    </div>



    <!-- Amazon-style Search and Filters -->
    <div class="amazon-search-section">
      <div class="container">
        <div class="search-wrapper">
          <div class="amazon-search-bar">
            <div class="search-input-group">
              <input type="text" placeholder="Search products..." class="search-input" v-model="searchQuery" @input="filterProducts">
              <button class="search-btn">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div class="filter-tabs">
            <button class="filter-tab" :class="{ active: selectedFilter === 'all' }" @click="setFilter('all')">
              All Products
            </button>
            <button class="filter-tab" :class="{ active: selectedFilter === 'new' }" @click="setFilter('new')">
              New Arrivals
            </button>
            <button class="filter-tab" :class="{ active: selectedFilter === 'sale' }" @click="setFilter('sale')">
              On Sale
            </button>
            <button class="filter-tab" :class="{ active: selectedFilter === 'popular' }" @click="setFilter('popular')">
              Popular
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Amazon-style More Products -->
    <div v-if="moreProducts.length > 0" class="amazon-more-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">More Products <span class="product-count">({{ moreProducts.length }})</span></h2>
          <p class="section-subtitle">Discover more amazing products at great prices</p>
        </div>
        <div class="row g-5">
          <div
            v-for="product in moreProducts"
            :key="product.unique_code"
            class="col-6 col-md-4 col-lg-3"
          >
            <div class="modern-product-card" @click="goToProductDetail(product.id, product)">
              <div class="product-image-container">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image" style="color: #007aff; font-size: 2rem;"></i>
                  <small style="color: #666;">No Image</small>
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
    </div>

    <!-- No Products Found -->
    <div v-else-if="allProducts.length > 0" class="no-products-section">
      <div class="container">
        <div class="no-products-content">
          <div class="no-products-icon">
            <i class="bi bi-search"></i>
          </div>
          <h3 class="no-products-title">No products found</h3>
          <p class="no-products-message">Try adjusting your search or filter criteria</p>
          <button class="clear-filters-btn" @click="clearFilters">
            <i class="bi bi-arrow-clockwise"></i>
            Clear Filters
          </button>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import axios from '@/axios';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import cartService from '@/services/cartService';

export default {
  name: 'StoreFeed',
  components: { Swiper, SwiperSlide },
  props: {
  },
  data() {
    return {
      stores: [],
      loading: true,
      noResults: false,
      currentTab: 'home',
      userBalance: null,
      mintissValue: 0,
      hoveredStore: null,
      carouselRefs: [],
      categories: [],
      infoCards: [
        { icon: 'bi bi-cash-coin', title: 'Refer & Earn', span: 'Invite friends', value: 'Earn rewards' },
        { icon: 'bi bi-graph-up-arrow', title: 'Today\'s Mintiss Value', value: '₹0.00000000' },
      ],
      heroSections: [],
      isAddingToCart: false,
      // Search and filter functionality
      searchQuery: '',
      selectedFilter: 'all',
      filteredProducts: []
    };
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      handler(newVal) {
        this.fetchStores(newVal);
      },
    },
  },
  computed: {
    allProducts() {
      const products = [];
      this.stores.forEach(store => {
        if (store.products && Array.isArray(store.products)) {
          products.push(...store.products);
        }
      });
      return products;
    },
    firstProducts() {
      // Show first 6 products
      return this.allProducts.slice(0, 6);
    },
    moreProducts() {
      // Show products after the first 6
      return this.allProducts.slice(6);
    },
    userName() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.name : '';
    },
    mintissValueDisplay() {
      return this.mintissValue ? this.mintissValue.toFixed(8) : '0.00000000';
    },
  },
  async mounted() {
    this.fetchHeroSections();
    this.fetchCategories();
    await this.fetchMintissValue();
    this.calculateUserBalance();
    this.fetchStores(); // Load products by default for home page
    // Update Mintiss Value card
    this.infoCards[1].value = `₹${this.mintissValueDisplay}`;
    this.initializeFilteredProducts();
  },
  methods: {
    handleCardClick(cardTitle) {
       if (cardTitle === "Today's Mintiss Value") {
        this.goToMintiss();
      }
    },
    isClickableCard(cardTitle) {
      return cardTitle === "Today's Mintiss Value" ;
    },
    goToCheckout(product) {
      this.$router.push({
        name: 'checkout',
        query: {
          product: JSON.stringify(product)
        }
      });
    },
    goToProductDetail(productId, product) {
      // Fallback to unique_code if id is not available
      const idToUse = productId || product?.unique_code;
      if (!idToUse) {
        console.error('No product ID or unique_code available');
        return;
      }
      
      this.$router.push(`/product/${idToUse}`);
    },
    scrollToProducts() {
      const element = document.querySelector('.featured-banner');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    },
    
    calculateMintissPoints(mintissValue) {
      if (!this.mintissValue || this.mintissValue === 0) {
        return '0';
      }
      // Calculate mintiss points: mintiss value / current mintiss value
      const points = mintissValue / this.mintissValue;
      return points.toFixed(8);
    },
    async fetchHeroSections() {
      try {
        const { data } = await axios.get('/public/hero');
        // If API returns a single object
        this.heroSections = Array.isArray(data) ? data : [data];
      } catch (error) {
        console.error("Error fetching hero sections:", error);
      }
    },
    async fetchStores(query = null) {
      this.loading = true;
      this.noResults = false;
      try {
        let res;
        if (query) {
          res = await axios.get('/showall/products', { params: { search: query } });
        } else {
          res = await axios.get('/showall/products');
        }
        const storesData = res.data.stores || res.data || [];
        this.stores = storesData;
        this.noResults = Array.isArray(storesData) && storesData.length === 0;
      } catch (e) {
        this.stores = [];
        this.noResults = true;
      } finally {
        this.loading = false;
      }
    },
    async fetchMintissValue() {
      try {
        const response = await axios.get('/mintiss-value/latest');
        this.mintissValue = parseFloat(response.data.data.value);
        this.calculateUserBalance();
      } catch (error) {
        // handle error
      }
    },
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.mintiss) {
        this.userBalance = (parseFloat(user.mintiss) * this.mintissValue).toFixed(8);
      }
    },
    openProduct(product) {
      if (product.store_id === 4) {
        this.$router.push({
          name: 'checkout',
          query: {
            product: JSON.stringify(product),
          },
        });
      } else {
        window.open(product.purchase_url, '_blank');
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    goToMintiss() {
      this.$router.push('/mintiss');
    },
    goToReferral() {
      this.$router.push('/referral')
    },
    setCarouselRef(el, idx) {
      if (el) this.carouselRefs[idx] = el;
    },
    scrollProducts(idx, direction) {
      const el = this.carouselRefs[idx];
      if (el) {
        const scrollAmount = Math.max(el.offsetWidth * 0.8, 200);
        if (direction < 0) {
          el.scrollLeft -= scrollAmount;
        } else {
          el.scrollLeft += scrollAmount;
        }
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('/categories');
        this.categories = response.data || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
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
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    // Search and filter methods
    initializeFilteredProducts() {
      this.filteredProducts = [...this.allProducts];
    },
    
    filterProducts() {
      let products = [...this.allProducts];
      
      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.store && product.store.name.toLowerCase().includes(query))
        );
      }
      
      // Apply category filter
      switch (this.selectedFilter) {
        case 'new':
          // Sort by creation date (newest first)
          products.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          break;
        case 'sale':
          // Filter products with discount
          products = products.filter(product => 
            product.canceled_price && product.canceled_price > product.price
          );
          break;
        case 'popular':
          // Sort by mintiss points (higher points = more popular)
          products.sort((a, b) => (b.mintiss || 0) - (a.mintiss || 0));
          break;
        default:
          // 'all' - no additional filtering
          break;
      }
      
      this.filteredProducts = products;
    },
    
    setFilter(filter) {
      this.selectedFilter = filter;
      this.filterProducts();
    },
    
    clearFilters() {
      this.searchQuery = '';
      this.selectedFilter = 'all';
      this.filteredProducts = [...this.allProducts];
    },
    
    // Banner handling methods
    handleBannerClick(hero) {
      // Handle banner click - could navigate to specific page or show modal
      console.log('Banner clicked:', hero);
      // You can add navigation logic here based on hero.link or hero.action
    },
    
    handleHeroImageError(event) {
      // Fallback image for broken hero images
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEJhbm5lciBJbWFnZTwvdGV4dD48L3N2Zz4=';
    }
  },
};
</script>

<style scoped>
/* ===== MOBILE-FIRST E-COMMERCE STYLES ===== */

/* Main Page Layout - Mobile First */
/* Amazon-style Homepage */
.amazon-style-homepage {
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Amazon Ember', Arial, sans-serif;
}

/* Amazon-style Hero Section */
.amazon-hero-section {
  background: #232f3e;
  padding: 0;
  margin-bottom: 2rem;
}

.hero-carousel {
  position: relative;
  overflow: hidden;
}

.hero-slide {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.hero-slide:hover {
  transform: scale(1.02);
}

.hero-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

/* Amazon-style No Banners */
.amazon-no-banners {
  background: #f3f3f3;
  padding: 3rem 0;
  text-align: center;
}

.no-banners-content {
  max-width: 400px;
  margin: 0 auto;
}

.no-banners-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.no-banners-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.no-banners-content p {
  color: #666;
}

/* Amazon-style Info Cards */
.amazon-info-section {
  background: #f7f7f7;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.amazon-info-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.amazon-info-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.amazon-info-card.clickable {
  cursor: pointer;
}

.card-icon {
  background: #1177bf;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-value {
  color: #1177bf;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Compact Categories */
.compact-categories-section {
  background: #f8f9fa;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.categories-header {
  text-align: center;
  margin-bottom: 1rem;
}

.categories-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.compact-categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  max-width: 600px;
  margin: 0 auto;
}

.compact-category-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.compact-category-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
  border-color: #1177bf;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
}

.category-icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.category-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

/* Amazon-style Products */
.amazon-products-section,
.amazon-more-products {
  background: white;
  padding: 0.25rem 0;
  margin-bottom: 0.25rem;
}

.amazon-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
  max-width: 800px;
  margin: 0 auto;
}

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
  height: 280px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.3s ease;
  background: white;
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

.product-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.product-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1177bf;
}

.original-price {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: line-through;
}

.mintiss-reward {
  margin-bottom: 0.5rem;
}

.mintiss-reward span {
  color: #1177bf;
  font-size: 0.875rem;
  font-weight: 500;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.store-info i {
  color: #6c757d;
  font-size: 0.875rem;
}

.store-info small {
  color: #6c757d;
  font-size: 0.8rem;
}

.product-actions {
  margin-top: auto;
}

.modern-add-to-cart-btn {
  width: 100%;
  background: #1177bf;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modern-add-to-cart-btn:hover {
  background: #0d5a9a;
  transform: translateY(-1px);
}

.modern-add-to-cart-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* ===== RESPONSIVE IMAGE DISPLAY ===== */
@media (max-width: 768px) {
  .product-image-container {
    height: 240px;
  }
}

@media (max-width: 576px) {
  .product-image-container {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .product-image-container {
    height: 200px;
  }
}

.product-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image-container {
  position: relative;
  height: 100px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ccc;
}

.discount-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-info {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.product-details {
  flex-grow: 1;
}

.product-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
  line-height: 1.1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.3rem;
}

.stars {
  color: #1177bf;
  font-size: 0.7rem;
}

.rating-count {
  color: #666;
  font-size: 0.65rem;
}

.price-section {
  margin-bottom: 0.3rem;
}

.current-price {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 0.7rem;
  color: #666;
  text-decoration: line-through;
  margin-left: 0.3rem;
}

.product-bottom {
  margin-top: auto;
}

.mintiss-reward {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #1177bf;
  font-size: 0.65rem;
  margin-bottom: 0.4rem;
}

.amazon-add-to-cart-btn {
  width: 100%;
  background: #1177bf;
  color: #fff;
  border: none;
  padding: 0.35rem;
  border-radius: 3px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  font-size: 0.7rem;
}

.amazon-add-to-cart-btn:hover {
  background: #0d5a9a;
}

.amazon-add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Amazon-style Search */
.amazon-search-section {
  background: #f7f7f7;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.search-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.amazon-search-bar {
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #1177bf;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: #0d5a9a;
}

.search-btn {
  background: #1177bf;
  color: #fff;
  border: 2px solid #1177bf;
  border-radius: 0 4px 4px 0;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #0d5a9a;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tab {
  background: white;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #1177bf;
}

.filter-tab.active {
  background: #1177bf;
  color: #fff;
  border-color: #1177bf;
}

.products-count {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .amazon-hero-section {
    margin-bottom: 1rem;
  }
  
  .hero-image {
    height: 200px;
  }
  
  .info-cards-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0 1rem;
  }
  
  .amazon-info-card {
    padding: 0.75rem;
    margin: 0;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-subtitle {
    font-size: 0.8rem;
  }
  
  .card-value {
    font-size: 1rem;
  }
  
  .compact-categories-section {
    padding: 0.75rem 0;
  }
  
  .compact-categories-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0 1rem;
  }
  
  .compact-category-item {
    padding: 0.5rem 0.25rem;
  }
  
  .category-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .category-label {
    font-size: 0.6rem;
  }
  
  .amazon-products-section,
  .amazon-more-products {
    padding: 0.2rem 0;
  }
  
  .amazon-products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.3rem;
    padding: 0 1rem;
  }
  
  .amazon-product-card {
    margin: 0;
  }
  
  .product-image-container {
    height: 240px;
  }
  
  .product-info {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }
  
  .product-details {
    flex-grow: 1;
  }
  
  .product-title {
    font-size: 0.65rem;
    line-height: 1.1;
    margin-bottom: 0.15rem;
  }
  
  .product-rating {
    margin-bottom: 0.25rem;
  }
  
  .stars {
    font-size: 0.7rem;
  }
  
  .rating-count {
    font-size: 0.6rem;
  }
  
  .current-price {
    font-size: 0.9rem;
  }
  
  .original-price {
    font-size: 0.7rem;
  }
  
  .product-bottom {
    margin-top: auto;
  }
  
  .mintiss-reward {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
  }
  
  .amazon-add-to-cart-btn {
    padding: 0.25rem 0.3rem;
    font-size: 0.6rem;
  }
  
  .amazon-search-section {
    padding: 1rem 0;
  }
  
  .search-input-group {
    max-width: 100%;
    margin: 0 1rem;
  }
  
  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .search-btn {
    padding: 0.5rem 0.75rem;
  }
  
  .filter-tabs {
    gap: 0.25rem;
    padding: 0 1rem;
    flex-wrap: wrap;
  }
  
  .filter-tab {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
  
  .section-title {
    font-size: 0.8rem;
  }
  
  .product-count {
    font-size: 0.6rem;
  }
  
  .section-subtitle {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .hero-image {
    height: 150px;
  }
  
  .section-title {
    font-size: 0.75rem;
  }
  
  .product-count {
    font-size: 0.55rem;
  }
  
  .section-subtitle {
    font-size: 0.55rem;
  }
  
  .info-cards-grid {
    padding: 0 0.5rem;
  }
  
  .amazon-info-card {
    padding: 0.5rem;
    flex-direction: column;
    text-align: center;
  }
  
  .card-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .card-title {
    font-size: 0.9rem;
  }
  
  .card-subtitle {
    font-size: 0.7rem;
  }
  
  .card-value {
    font-size: 0.9rem;
  }
  
  .compact-categories-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 0.5rem;
  }
  
  .compact-category-item {
    padding: 0.4rem 0.2rem;
  }
  
  .category-icon {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .category-label {
    font-size: 0.55rem;
  }
  
  .amazon-products-grid {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 0.5rem;
  }
  
  .product-image-container {
    height: 60px;
  }
  
  .product-info {
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }
  
  .product-details {
    flex-grow: 1;
  }
  
  .product-title {
    font-size: 0.6rem;
    line-height: 1.1;
  }
  
  .stars {
    font-size: 0.6rem;
  }
  
  .rating-count {
    font-size: 0.5rem;
  }
  
  .current-price {
    font-size: 0.8rem;
  }
  
  .original-price {
    font-size: 0.6rem;
  }
  
  .product-bottom {
    margin-top: auto;
  }
  
  .mintiss-reward {
    font-size: 0.6rem;
  }
  
  .amazon-add-to-cart-btn {
    padding: 0.2rem 0.25rem;
    font-size: 0.5rem;
  }
  
  .search-input-group {
    margin: 0 0.5rem;
  }
  
  .search-input {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .search-btn {
    padding: 0.4rem 0.6rem;
  }
  
  .filter-tabs {
    padding: 0 0.5rem;
  }
  
  .filter-tab {
    padding: 0.25rem 0.5rem;
    font-size: 0.6rem;
  }
}









/* Search and Filters Section - Mobile First */
.search-filters-section {
  padding: 1rem 0;
  background: white;
  border-bottom: 1px solid #e8eaed;
}

.search-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar {
  position: relative;
  width: 100%;
  margin: 0;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e8eaed;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  min-height: 44px;
}

.search-input:focus {
  outline: none;
  border-color: #1177bf;
  background: white;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.filter-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  width: 100%;
}

.filter-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e8eaed;
  background: white;
  color: #6c757d;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.filter-btn:hover {
  border-color: #1177bf;
  color: #1177bf;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #1177bf;
  border-color: #1177bf;
  color: white;
}

.products-count {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

/* No Products Found */
.no-products-section {
  padding: 4rem 0;
  background: white;
}

.no-products-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.no-products-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-products-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.no-products-message {
  color: #6c757d;
  margin-bottom: 2rem;
}

.clear-filters-btn {
  background: #1177bf;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.clear-filters-btn:hover {
  background: #0d5a9a;
  transform: translateY(-2px);
}

/* Refer & Earn Section - Optimized spacing */
.refer-earn-section {
  padding: 1.5rem 0;
  background: white;
  border-bottom: 1px solid #e8eaed;
}

.modern-info-card {
  background: #ffffff;
  border: 1px solid #e8eaed;
  transition: all 0.2s ease;
  height: 160px !important;
  min-height: 160px !important;
  max-height: 160px !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
}

.modern-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #dadce0;
}

.modern-info-card .card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  height: 100%;
  min-height: 100%;
}

/* Ensure all info cards are exactly the same size */
.row .col .modern-info-card {
  height: 160px !important;
  min-height: 160px !important;
  max-height: 160px !important;
}

.modern-info-icon {
  background: #007aff;
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
  border-radius: 6px;
}

.modern-info-title {
  font-size: 0.85rem;
  color: #1a1a1a;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  text-align: center;
  height: 1.2rem;
  min-height: 1.2rem;
  max-height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.01em;
}

.modern-info-span {
  font-size: 0.75rem;
  color: #5f6368;
  font-weight: 400;
  margin-bottom: 0.25rem;
  text-align: center;
  height: 1rem;
  min-height: 1rem;
  max-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.01em;
}

.modern-info-value {
  font-size: 0.8rem;
  color: #007aff;
  font-weight: 600;
  text-align: center;
  height: 1.1rem;
  min-height: 1.1rem;
  max-height: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.01em;
}

/* Hero Section - Admin Banners */
.hero-section {
  padding: 3rem 0;
  background: white;
  border-bottom: 1px solid #e8eaed;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.hero-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: #f8f9fa;
  min-height: 250px;
  display: flex;
  flex-direction: column;
}

.hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.hero-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  background: #f8f9fa;
}

.hero-card:hover .hero-image {
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}

.hero-banner-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-banner-description {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(17, 119, 191, 0.9);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.hero-card:hover .hero-badge {
  opacity: 1;
}

/* No Banners State */
.no-banners-section {
  padding: 3rem 0;
  background: white;
  border-bottom: 1px solid #e8eaed;
}

.no-banners-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.no-banners-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-banners-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.no-banners-message {
  color: #6c757d;
  margin: 0;
}

/* Categories Section */
.categories-section {
  padding: 4rem 0;
  background: #fafbfc;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.category-item {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.category-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(17, 119, 191, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(10px);
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 119, 191, 0.05) 0%, rgba(13, 90, 154, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 60px rgba(17, 119, 191, 0.2);
  border-color: rgba(17, 119, 191, 0.3);
}

.category-image-container {
  position: relative;
  height: 160px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1.1);
}

.category-card:hover .category-image {
  transform: scale(1.08);
  filter: brightness(1.1) contrast(1.2);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 2rem;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 119, 191, 0.9) 0%, rgba(13, 90, 154, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.category-badge {
  background: white;
  color: #1177bf;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover .category-badge {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.category-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  background: white;
}

.category-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 0.5px;
}

.category-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  text-align: center;
  font-weight: 500;
}

.section-header {
  margin-bottom: 0.3rem;
  text-align: center;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.1rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-count {
  font-size: 0.65rem;
  font-weight: 400;
  color: #666;
  margin-left: 0.2rem;
}

.section-subtitle {
  font-size: 0.6rem;
  color: #5f6368;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
}

/* Horizontal Categories Layout */
.categories-horizontal-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem 0;
  margin: 0 -1rem;
  scrollbar-width: thin;
  scrollbar-color: #007aff #f1f1f1;
}

.categories-horizontal-scroll::-webkit-scrollbar {
  height: 6px;
}

.categories-horizontal-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.categories-horizontal-scroll::-webkit-scrollbar-thumb {
  background: #007aff;
  border-radius: 3px;
}

.categories-horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.categories-scroll-container {
  display: flex;
  gap: 1.5rem;
  padding: 0 1rem;
  min-width: max-content;
}

.category-item-horizontal {
  flex-shrink: 0;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Horizontal Category Cards */
.category-card-horizontal {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid #e8eaed;
  width: 150px;
  height: 180px;
  display: flex;
  flex-direction: column;
}

.category-card-horizontal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #dadce0;
}

.category-image-container-horizontal {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: #f8f9fa;
}

.category-image-horizontal {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.category-card-horizontal:hover .category-image-horizontal {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 86, 179, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card-horizontal:hover .image-overlay {
  opacity: 1;
}

.no-image-placeholder-horizontal {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 2rem;
}

.category-badge-horizontal {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: #007aff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s ease;
}

.category-card-horizontal:hover .category-badge-horizontal {
  opacity: 1;
  transform: scale(1);
}

.category-info-horizontal {
  padding: 1rem;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-name-horizontal {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.01em;
}

/* Products Section */
.products-section {
  padding: 4rem 0;
  background: white;
  border-top: 1px solid #e8eaed;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-item {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.modern-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(10px);
}

.modern-product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 119, 191, 0.05) 0%, rgba(13, 90, 154, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.modern-product-card:hover::before {
  opacity: 1;
}

.modern-product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1.1);
}

.modern-product-card:hover .product-image {
  transform: scale(1.08);
  filter: brightness(1.1) contrast(1.2);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 3rem;
}

.discount-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  animation: pulse 2s infinite;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.discount-text {
  display: block;
  line-height: 1;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 119, 191, 0.95) 0%, rgba(13, 90, 154, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
}

.modern-product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.quick-view-btn {
  background: white;
  color: #1177bf;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  min-width: 140px;
  justify-content: center;
}

.quick-view-btn:hover {
  background: #1177bf;
  color: white;
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 8px 30px rgba(17, 119, 191, 0.4);
}

.wishlist-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #ff4757;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.wishlist-btn:hover {
  background: #ff4757;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
}


.product-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  background: white;
  gap: 0.5rem;
}

.product-header {
  margin-bottom: 1rem;
}


.store-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1177bf;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding: 0.3rem 0.8rem;
  background: rgba(17, 119, 191, 0.1);
  border-radius: 15px;
  width: fit-content;
}

.store-info i {
  font-size: 0.9rem;
}

.product-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
  flex: 1;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.currency {
  font-size: 1rem;
  font-weight: 600;
  color: #1177bf;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1177bf;
  line-height: 1;
}

.original-price {
  font-size: 1rem;
  color: #6c757d;
  text-decoration: line-through;
  font-weight: 500;
}

.mintiss-reward {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  margin-bottom: 0;
  color: white;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.3);
}

.reward-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  backdrop-filter: blur(10px);
}

.reward-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.reward-label {
  font-size: 0.4rem;
  color: #1177bf !important;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.reward-amount {
  font-size: 0.6rem;
  font-weight: 800;
  color: white;
}

.product-actions {
  margin-top: auto;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(17, 119, 191, 0.3);
  min-height: 36px;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-to-cart-btn:hover .btn-shine {
  left: 100%;
}

.add-to-cart-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.5);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(17, 119, 191, 0.2);
}

.add-to-cart-btn:disabled .btn-shine {
  display: none;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.product-item {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #e8eaed;
  height: 420px;
  min-height: 420px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modern-product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #dadce0;
}

.modern-product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #007aff 0%, #00d4ff 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-product-card:hover::before {
  opacity: 1;
}

.product-image-container {
  position: relative;
  height: 350px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1);
  background: #f8f9fa;
}

.modern-product-card:hover .product-image {
  transform: scale(1.05);
  filter: brightness(1.05) contrast(1.1);
}

.discount-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #ea4335 0%, #d33b2c 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(234, 67, 53, 0.4);
  z-index: 2;
  letter-spacing: 0.02em;
}

.product-content {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.product-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
  min-height: 1.2rem;
}

.product-description {
  font-size: 0.7rem;
  color: #5f6368;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  letter-spacing: 0.01em;
  min-height: 1rem;
}

.price-section {
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #137333;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.original-price {
  font-size: 0.9rem;
  color: #9aa0a6;
  text-decoration: line-through;
  letter-spacing: 0.01em;
  font-weight: 500;
}



/* Add to Cart Button Styles */
.product-actions {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.7rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(40, 167, 69, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.add-to-cart-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.add-to-cart-btn:disabled {
  background: #e8eaed;
  color: #9aa0a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.add-to-cart-btn i {
  font-size: 1rem;
}

/* View All Categories Button */
.modern-categories-btn {
  background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.modern-categories-btn:hover {
  background: linear-gradient(135deg, #0056cc 0%, #004499 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
}

/* Hero Section - Simple Style */
.simple-hero-section {
  position: relative;
  overflow: hidden;
}

.hero-image-simple {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}



/* Product Cards - Modern Style */
.modern-product-card {
  border: 1px solid #e8eaed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  height: 420px;
  min-height: 420px;
  max-height: 420px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modern-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.product-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.modern-product-card:hover .product-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
}

.no-image-placeholder i {
  font-size: 2rem;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 2;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.8rem;
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: #007aff;
}

.original-price {
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
}


.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #007aff;
}

.view-all-btn {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  border-color: #007aff;
  color: #007aff;
}

/* ===== CATEGORIES BUTTON ===== */
.modern-categories-btn {
  background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.modern-categories-btn:hover {
  background: linear-gradient(135deg, #0056cc 0%, #004499 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
}

.modern-categories-btn:active {
  transform: translateY(0);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  
  .section-title {
    font-size: 1.75rem;
    white-space: nowrap;
  }
  
  .categories-horizontal-scroll {
    margin: 0 -0.5rem;
  }
  
  .categories-scroll-container {
    gap: 1rem;
    padding: 0 0.5rem;
  }
  
  .category-card-horizontal {
    width: 120px;
    height: 160px;
  }
  
  .category-image-container-horizontal {
    height: 100px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .hero-card {
    min-height: 200px;
  }
  
  .hero-image {
    height: 350px;
  }
  
  .hero-banner-title {
    font-size: 1.2rem;
  }
  
  .hero-banner-description {
    font-size: 0.8rem;
  }
  
  .category-image-container {
    height: 100px;
  }
  
  .product-image-container {
    height: 180px;
  }
  
  .modern-product-card {
    height: 380px;
    min-height: 380px;
    max-height: 380px;
  }
  
  .product-content {
    padding: 0.6rem;
  }
  
  .product-name {
    font-size: 0.95rem;
    min-height: 2.6rem;
  }
  
  .product-description {
    font-size: 0.8rem;
    min-height: 2.4rem;
  }
  
  .product-price {
    font-size: 1.1rem;
  }
  }
  
@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
    white-space: nowrap;
  }
  
  .categories-horizontal-scroll {
    margin: 0 -0.25rem;
  }
  
  .categories-scroll-container {
    gap: 0.75rem;
    padding: 0 0.25rem;
  }
  
  .category-card-horizontal {
    width: 100px;
    height: 140px;
  }
  
  .category-image-container-horizontal {
    height: 80px;
  }
  
  .category-info-horizontal {
    padding: 0.75rem;
  }
  
  .category-name-horizontal {
    font-size: 0.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 0 0.25rem;
  }
  
  .hero-image {
    height: 150px;
  }
  
  .category-image-container {
    height: 80px;
  }
  
  .product-image-container {
    height: 140px;
  }
  
  .modern-product-card {
    height: 340px;
    min-height: 340px;
    max-height: 340px;
  }
  
  .product-content {
    padding: 0.5rem;
  }
  
  .product-name {
    font-size: 0.9rem;
    min-height: 2.4rem;
  }
  
  .product-description {
    font-size: 0.75rem;
    min-height: 2.25rem;
  }
  
  .product-price {
    font-size: 1rem;
  }
  
  .mintiss-reward {
    font-size: 0.5rem;
    padding: 0.4rem 0.6rem;
  }
  
  .add-to-cart-btn {
    padding: 0.35rem 0.5rem;
    font-size: 0.7rem;
  }
  
  .modern-categories-btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* ===== MOBILE RESPONSIVE STYLES ===== */

/* Mobile First - Base styles for mobile */
@media (max-width: 575px) {
  .modern-info-card {
    height: 160px !important;
    min-height: 160px !important;
    max-height: 160px !important;
  }
  
  .modern-info-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  }
  
  .modern-info-title {
    font-size: 0.8rem;
  }
  
  .modern-info-span {
    font-size: 0.7rem;
  }
  
  .modern-info-value {
    font-size: 0.8rem;
  }
  
  
  .hero-image-simple {
    max-height: 200px;
  }
  
  .product-image-container {
    height: 150px;
  }
  
  .modern-product-card {
    height: 360px;
    min-height: 360px;
    max-height: 360px;
  }
  
  .product-name {
    font-size: 0.8rem;
  }
  
  .product-description {
    font-size: 0.75rem;
  }
  
  .product-price {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .category-title {
    font-size: 1.1rem;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .modern-info-card {
    height: 160px !important;
    min-height: 160px !important;
    max-height: 160px !important;
  }
  
  .modern-info-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
    background: linear-gradient(135deg, #007aff 0%, #0056cc 100%);
  }
  
  .modern-info-title {
    font-size: 0.85rem;
  }
  
  .modern-info-value {
    font-size: 0.85rem;
  }
  
  
  .hero-image-simple {
    max-height: 220px;
  }
  
  .product-image-container {
    height: 160px;
  }
  
  .modern-product-card {
    height: 370px;
    min-height: 370px;
    max-height: 370px;
  }
  
  .product-name {
    font-size: 0.85rem;
  }
  
  .product-price {
    font-size: 0.95rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  
  .hero-image-simple {
    max-height: 240px;
  }
  
  .product-image-container {
    height: 170px;
  }
  
  .modern-product-card {
    height: 300px;
    min-height: 300px;
    max-height: 300px;
  }
  
  .product-name {
    font-size: 0.9rem;
  }
  
  .product-price {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .category-title {
    font-size: 1.15rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  
  .hero-image-simple {
    max-height: 250px;
  }
  
  .product-image-container {
    height: 180px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .category-title {
    font-size: 1.2rem;
  }
}

/* Touch-friendly interactions for mobile */
@media (max-width: 767px) {
  .modern-info-card:active {
    transform: scale(0.98);
  }
  
  .modern-product-card:active {
    transform: scale(0.98);
  }
  
  
  .btn:active {
    transform: scale(0.95);
  }
}


/* Category Cards Styles */
.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
}

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
  height: 120px;
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
  font-size: 2rem;
  color: #007aff;
  opacity: 0.7;
}

.category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 122, 255, 0.9);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
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

/* Mobile-First Responsive Design for Home Page */
/* Base styles are mobile-first (320px+) */

/* Mobile-specific product card improvements */
@media (max-width: 767px) {
  .product-content {
    padding: 0.75rem;
  }
  
  .product-header {
    margin-bottom: 0.5rem;
  }
  
  
  .store-info {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
    padding: 0.2rem 0.6rem;
  }
  
  .store-info i {
    font-size: 0.8rem;
  }
  
  .mintiss-reward {
    margin-bottom: 0;
    padding: 0.6rem;
  }
  
  .price-section {
    margin-bottom: 0.5rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .original-price {
    font-size: 0.8rem;
  }
  
  .discount-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
  
  .product-actions {
    gap: 0.5rem;
  }
  
  .add-to-cart-btn {
    padding: 0.3rem 0.4rem;
    font-size: 0.65rem;
  }
  
  .wishlist-btn {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}

/* Extra small mobile devices (320px and below) */
@media (max-width: 480px) {
  .product-content {
    padding: 0.5rem;
  }
  
  
  .store-info {
    font-size: 0.65rem;
    margin-bottom: 0.4rem;
    padding: 0.15rem 0.5rem;
  }
  
  .mintiss-reward {
    margin-bottom: 0;
    padding: 0.5rem;
  }
  
  .current-price {
    font-size: 0.9rem;
  }
  
  .original-price {
    font-size: 0.75rem;
  }
  
  .add-to-cart-btn {
    padding: 0.25rem 0.35rem;
    font-size: 0.6rem;
  }
  
  .wishlist-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  
  .hero-features {
    gap: 0.5rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0.5rem 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .feature-item {
    padding: 0.5rem 0.75rem;
    flex-shrink: 0;
    white-space: nowrap;
    min-height: 36px;
  }
  
  .feature-item span {
    font-size: 0.75rem;
  }
  
  .search-filters-section {
    padding: 1.5rem 0;
  }
  
  .search-container {
    padding: 0 1.5rem;
  }
  
  .filter-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .filter-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  
  .hero-features {
    gap: 0.4rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0.4rem 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .feature-item {
    padding: 0.4rem 0.6rem;
    flex-shrink: 0;
    white-space: nowrap;
    min-height: 32px;
  }
  
  .feature-item span {
    font-size: 0.7rem;
  }
  
  .search-filters-section {
    padding: 2rem 0;
  }
  
  .search-container {
    padding: 0 2rem;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
  
  .search-bar {
    max-width: 500px;
  }
  
  .filter-buttons {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
  
  .filter-btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  
  .hero-features {
    gap: 0.3rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0.3rem 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .feature-item {
    padding: 0.3rem 0.5rem;
    flex-shrink: 0;
    white-space: nowrap;
    min-height: 28px;
  }
  
  .feature-item span {
    font-size: 0.65rem;
  }
  
  .search-filters-section {
    padding: 2.5rem 0;
  }
  
  .search-container {
    padding: 0 2.5rem;
  }
  
  .filter-buttons {
    gap: 1.5rem;
  }
  
  .filter-btn {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .hero-section {
    padding: 2rem 1.5rem;
  }
  
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .product-image {
    height: 180px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .category-card {
    height: 160px;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-products-page {
    padding: 1.5rem 0;
  }
  
  .products-container {
    padding: 0 1rem;
  }
  
  .hero-section {
    padding: 2.5rem 2rem;
    border-radius: 16px;
  }
  
  
  .search-section {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .product-card {
    padding: 1.25rem;
    border-radius: 16px;
  }
  
  .product-image {
    height: 350px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  .category-card {
    height: 180px;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-products-page {
    padding: 2rem 0;
  }
  
  .products-container {
    padding: 0 1rem;
  }
  
  .hero-section {
    padding: 3rem 2.5rem;
    border-radius: 20px;
  }
  
  
  .search-section {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .product-card {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  .product-image {
    height: 120px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  
  .category-card {
    height: 350px;
  }
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
  .search-filters {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-btn {
    width: 100%;
    justify-content: center;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .add-to-cart-btn {
    width: 100%;
  }
  
  .view-details-btn {
    width: 100%;
  }
  
  .category-badge {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-state-icon {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .empty-state-title {
    font-size: 1.25rem;
  }
  
  .empty-state-message {
    font-size: 0.9rem;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {
  .add-to-cart-btn,
  .view-details-btn,
  .filter-btn,
  .category-card {
    min-height: 44px;
    min-width: 44px;
  }
  
  .product-card {
    transition: transform 0.2s ease;
  }
  
  .product-card:active {
    transform: scale(0.98);
  }
  
  .category-card:active {
    transform: scale(0.98);
  }
}

.category-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

/* Mobile responsive for category cards */
@media (max-width: 576px) {
  
  .category-image-container {
    height: 100px;
  }
  
  .category-info {
    padding: 12px;
  }
  
  .category-name {
    font-size: 0.8rem;
  }
  
  .category-badge {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
}

/* Legacy styles cleanup - keeping only essential ones */
.cursor-pointer {
  cursor: pointer;
}
</style>
