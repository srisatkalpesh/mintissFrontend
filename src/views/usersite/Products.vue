<template>
  <div class="modern-store-page">
    <!-- ✅ Info Cards - Modern E-commerce Style (Keep as is) -->
    <div class="info-cards-section">
      <div class="container">
        <div class="row row-cols-2 row-cols-sm-4 g-3 justify-content-center">
      <div class="col d-flex justify-content-center" v-for="card in infoCards" :key="card.title">
            <div class="card text-center border-0 shadow-sm rounded-4 modern-info-card"
          @click="handleCardClick(card.title)"
          :class="{ 'cursor-pointer': isClickableCard(card.title) }">
              <div class="card-body d-flex flex-column align-items-center justify-content-center p-3">
                <div class="mb-3 d-flex align-items-center justify-content-center rounded-circle modern-info-icon">
              <i :class="card.icon + ' text-white'"></i>
            </div>
                <h6 class="card-title fw-bold mb-2 modern-info-title">
              {{ card.title }}
            </h6>
                <div class="modern-info-span mb-2">{{ card.span || '&nbsp;' }}</div>
                <div class="fw-bold text-success modern-info-value">
                  {{ card.value || '&nbsp;' }}
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
    <!-- ✅ Hero Section - Modern Display -->
    <div class="hero-section">
      <div class="container">
        <div v-if="heroSections.length > 0" class="hero-container">
          <div v-for="hero in heroSections" :key="hero.id" class="hero-card">
            <img :src="hero.image_url" :alt="hero.title" class="hero-image" />
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Categories Section -->
    <div v-if="categories.length > 0" class="categories-section">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Shop by Category</h2>
          <p class="section-subtitle">Explore our wide range of products</p>
          </div>
        <div class="categories-horizontal-scroll">
          <div class="categories-scroll-container">
            <div
              v-for="(category, index) in categories"
              :key="category.id"
              class="category-item-horizontal"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="category-card-horizontal" @click="goToCategory(category.id)">
                <div class="category-image-container-horizontal">
                  <div class="image-overlay"></div>
                  <img
                    v-if="category.image"
                    :src="category.image"
                    :alt="category.name"
                    class="category-image-horizontal"
                  />
                  <div v-else class="no-image-placeholder-horizontal">
                    <i class="bi bi-grid-3x3-gap"></i>
                  </div>
                  <div class="category-badge-horizontal">
                    <i class="bi bi-arrow-right"></i>
                  </div>
                </div>
                <div class="category-info-horizontal">
                  <h6 class="category-name-horizontal">{{ category.name }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- ✅ All Products Section - Modern Grid Layout -->
    <div v-if="allProducts.length > 0" class="products-section">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Discover amazing products at great prices</p>
        </div>
        <div class="products-grid">
          <div v-for="product in allProducts" :key="product.unique_code" class="product-item">
            <div class="modern-product-card" @click="goToProductDetail(product.id, product)">
              <div class="product-image-container">
                <img 
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]" 
                  alt="Product Image" 
                  class="product-image"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image text-muted"></i>
                </div>
                <div v-if="product.canceled_price && product.canceled_price > product.price" 
                     class="discount-badge">
                  {{ Math.round(((product.canceled_price - product.price) / product.canceled_price) * 100) }}% OFF
                </div>
              </div>
              <div class="product-content">
                <h6 class="product-name">{{ product.name }}</h6>
                <p class="product-description">{{ product.description }}</p>
                <div class="price-section">
                  <span class="product-price">₹{{ product.price }}</span>
                  <span v-if="product.canceled_price" class="original-price">₹{{ product.canceled_price }}</span>
                </div>
                <div class="mintiss-reward">
                  <i class="bi bi-gift me-1"></i>
                  <small>Earn {{ calculateMintissPoints(product.mintiss) }} mintiss</small>
                </div>
                <div class="product-actions">
                  <button 
                    @click.stop="addToCart(product)" 
                    class="add-to-cart-btn"
                    :disabled="isAddingToCart"
                  >
                    <i class="bi bi-cart-plus me-1"></i>
                    <span v-if="!isAddingToCart">Add to Cart</span>
                    <span v-else>Adding...</span>
                  </button>
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
        { icon: 'bi bi-gift', title: 'Free Mintiss', span: 'Sign up now' },
        { icon: 'bi bi-graph-up-arrow', title: 'Today\'s Mintiss Value', value: '₹0.00000000' },
        { icon: 'bi bi-trophy', title: 'Reward Redemption', span: 'Starting Soon' },
      ],
      heroSections: [],
      isAddingToCart: false
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
    // this.fetchStores(); // Removed to only fetch on search
    // Update Mintiss Value card
    this.infoCards[2].value = `₹${this.mintissValueDisplay}`;
  },
  methods: {
    handleCardClick(cardTitle) {
      if (cardTitle === 'Free Mintiss') {
        this.goToLogin();
      } else if (cardTitle === "Today's Mintiss Value") {
        this.goToMintiss();
      } else if (cardTitle === 'Refer & Earn') {
        this.goToReferral();
      }
    },
    isClickableCard(cardTitle) {
      return cardTitle === 'Free Mintiss' ||
             cardTitle === "Today's Mintiss Value" ||
             cardTitle === 'Refer & Earn';
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
  },
};
</script>

<style scoped>
/* ===== MODERN E-COMMERCE STYLES ===== */

/* Main Page Layout */
.modern-store-page {
  background: #fafbfc;
  min-height: 100vh;
}

/* Info Cards Section - Keep exactly as is */
.info-cards-section {
  padding: 3rem 0;
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

/* Hero Section */
.hero-section {
  padding: 2rem 0;
  background: white;
  border-bottom: 1px solid #e8eaed;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.hero-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

/* Categories Section */
.categories-section {
  padding: 4rem 0;
  background: #fafbfc;
}

.section-header {
  margin-bottom: 3rem;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-subtitle {
  font-size: 1rem;
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
  padding: 5rem 0;
  background: white;
  border-top: 1px solid #e8eaed;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #f1f3f4;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modern-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #e8eaed;
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
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1);
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
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
  min-height: 2.8rem;
}

.product-description {
  font-size: 0.85rem;
  color: #5f6368;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  letter-spacing: 0.01em;
  min-height: 2.55rem;
}

.price-section {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.product-price {
  font-size: 1.25rem;
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

.mintiss-reward {
  display: flex;
  align-items: center;
  color: #007aff;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: auto;
  letter-spacing: 0.01em;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 212, 255, 0.08) 100%);
  border-radius: 8px;
  border: 1px solid rgba(0, 122, 255, 0.15);
}

.mintiss-reward i {
  color: #007aff;
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

/* Add to Cart Button Styles */
.product-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f4;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
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
  object-fit: cover;
  transition: all 0.3s ease;
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

.mintiss-reward {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: 6px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .hero-image {
    height: 200px;
  }
  
  .category-image-container {
    height: 100px;
  }
  
  .product-image-container {
    height: 180px;
  }
  
  .product-content {
    padding: 1.25rem;
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
  
  .product-content {
    padding: 1rem;
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
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }
  
  .add-to-cart-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
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
