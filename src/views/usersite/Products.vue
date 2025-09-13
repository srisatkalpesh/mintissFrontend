<template>
  <div class="container-fluid bg-light min-vh-100 font-monospace">
    <!-- ✅ Info Cards - Mobile Responsive -->
    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-2 g-md-3 my-3 my-md-4 justify-content-center px-2">
      <div class="col d-flex justify-content-center" v-for="card in infoCards" :key="card.title">
        <div class="card text-center border-0 shadow-lg rounded-3 rounded-md-4 card-hover-effect d-flex align-items-stretch info-card"
          @click="handleCardClick(card.title)"
          :class="{ 'cursor-pointer': isClickableCard(card.title) }">
          <div class="card-body d-flex flex-column align-items-center justify-content-center w-100 h-100 p-2 p-md-3"
            style="min-height: 0;">
            <div class="mb-1 mb-md-2 d-flex align-items-center justify-content-center rounded-circle info-icon">
              <i :class="card.icon + ' text-white'"></i>
            </div>
            <h6 class="card-title fw-bold mt-1 mt-md-2 mb-1 info-title">
              {{ card.title }}
              <span v-if="card.span" class="info-span">{{ card.span }}</span>
            </h6>
            <div v-if="card.value" class="fw-bold text-success mt-1 info-value">
              {{ card.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ✅ Hero Section - Mobile Responsive -->
    <div class="my-3 my-md-4 px-2">
      <div v-if="heroSections.length > 0" class="w-100">
        <div v-for="hero in heroSections" :key="hero.id" class="position-relative rounded-2 rounded-md-3 overflow-hidden shadow hero-section">
          <!-- Image -->
          <img :src="hero.image_url" :alt="hero.title" class="img-fluid w-100 hero-image" />
        </div>
      </div>
    </div>

    <!-- ✅ Categories - Mobile Responsive -->
    <div class="w-100 my-3 my-md-4 px-2">
      <div class="categories-container overflow-auto">
        <div class="d-flex flex-row flex-nowrap w-100 gx-2 gx-md-3">
          <div v-for="cat in categories.slice(0, 10)" :key="cat.id"
            class="d-flex flex-column align-items-center flex-fill mx-1 mx-md-2 category-item">
            <img :src="cat.image" alt="Category Image" class="rounded-circle border shadow category-image" />
            <div class="mt-2 mt-md-3 text-center fw-semibold category-name">{{ cat.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Featured Products Section - Mobile Responsive -->
    <div v-if="stores.length > 0" class="container-fluid my-3 my-md-4 px-2 px-md-4">
      <!-- Products Grouped by Category - Mobile Responsive -->
      <div v-for="(products, categoryName) in groupedByCategory" :key="categoryName" class="mb-4 mb-md-5" :data-category="categoryName">
        <div class="d-flex justify-content-between align-items-center mb-2 mb-md-3 px-1">
          <h4 class="text-primary mb-0 category-title">{{ categoryName }}</h4>
          <button class="btn btn-outline-primary btn-sm view-all-btn" @click="viewAllInCategory(categoryName)">
            View All <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
        <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2 g-md-3">
          <div v-for="product in products.slice(0, 6)" :key="product.unique_code" class="col">
            <div class="card product-card-hover h-100 p-2 p-md-3 product-card" style="cursor: pointer;"
              @click="goToProductDetail(product.id, product)">
              <div class="product-image-wrapper-small mb-2 mb-md-3">
                <img 
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]" 
                  alt="Product Image" 
                  class="product-image-small"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder-small">
                  <i class="bi bi-image text-muted"></i>
                </div>
                <div v-if="product.canceled_price && product.canceled_price > product.price" 
                     class="discount-badge">
                  {{ Math.round(((product.canceled_price - product.price) / product.canceled_price) * 100) }}% OFF
                </div>
              </div>
              <div class="product-info-overlay">
                <h6 class="product-name-ellipsis">{{ product.name }}</h6>
                <p class="product-description-ellipsis">{{ product.description }}</p>
                <div class="price-section mb-1 mb-md-2">
                  <span class="text-success fw-bold product-price">₹{{ product.price }}</span>
                  <span v-if="product.canceled_price" class="text-muted small text-decoration-line-through ms-1 ms-md-2 original-price">₹{{ product.canceled_price }}</span>
                </div>
                <div class="mintiss-reward">
                  <i class="bi bi-gift text-warning me-1"></i>
                  <small class="text-success">Earn {{ calculateMintissPoints(product.mintiss) }} mintiss</small>
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
      infoCards: [
        { icon: 'bi bi-cash-coin', title: 'Refer & Earn', span: 'Invite friends', value: 'Earn rewards' },
        { icon: 'bi bi-gift', title: 'Free Mintiss', span: 'Sign up now' },
        { icon: 'bi bi-graph-up-arrow', title: 'Today’s Mintiss Value', value: `₹${this.mintissValueDisplay}` },
        { icon: 'bi bi-trophy', title: 'Reward Redemption', span: 'Starting Soon' },
      ],
      categories: [],
      heroSections: []
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
    groupedByCategory() {
      const groups = {};
      this.stores.forEach(store => {
        store.products.forEach(product => {
          const categoryName = product.category ? product.category.name : 'Uncategorized';
          if (!groups[categoryName]) {
            groups[categoryName] = [];
          }
          groups[categoryName].push(product);
        });
      });
      return groups;
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
    await this.fetchMintissValue();
    this.calculateUserBalance();
    // this.fetchStores(); // Removed to only fetch on search
    // Update Mintiss Value card
    this.infoCards[2].value = `₹${this.mintissValueDisplay}`;
    this.fetchCategories();
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
    viewAllInCategory(categoryName) {
      // For now, just scroll to the category section
      // In the future, this could filter products by category
      const element = document.querySelector(`[data-category="${categoryName}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
        const { data } = await axios.get('/categories');
        this.categories = data;
      } catch (error) {
        // Handle error if needed
      }
    },
  },
};
</script>

<style scoped>
.card-hover-effect:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 8px 32px rgba(17, 119, 191, 0.18), 0 1.5px 8px rgba(0, 0, 0, 0.08);
}

.product-card-hover:hover {
  box-shadow: 0 8px 32px rgba(17, 119, 191, 0.22), 0 1.5px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px) scale(1.02);
}

.small-product-card {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  box-shadow: 0 2px 8px rgba(17, 119, 191, 0.12);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: #f4f8fb;
}

.product-image-wrapper-small {
  position: relative;
  width: 100%;
  background: #f4f8fb;
  overflow: hidden;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-small {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: #e9ecef;
}


.product-image-fit {
  object-fit: contain;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block;
}

/* New styles for product card layout */
.product-card {
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  box-shadow: 0 2px 8px rgba(17, 119, 191, 0.12);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: #f4f8fb;
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  background: #f4f8fb;
  overflow: hidden;
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Show the whole image */
  object-position: center;
  display: block;
  background: #e9ecef;
  /* fallback background */
}

.product-info-overlay {
  /* Remove position and z-index for normal flow */
  position: static;
  left: unset;
  bottom: unset;
  width: 100%;
  padding: 12px 10px 10px 10px;
  background: #f4f8fb;
}

.product-description-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.product-name-ellipsis {
  max-width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}

/* Store description ellipsis after 2 lines */
.store-description-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.8em;
  line-height: 1.4em;
}

.product-cta-btn {
  padding: 2px 8px !important;
  font-size: 0.75rem !important;
  height: 24px !important;
  line-height: 1.1 !important;
  border-radius: 4px !important;
  white-space: nowrap;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

/* New e-commerce styles */
.featured-banner {
  background: linear-gradient(135deg, #1177bf 0%, #0d6efd 100%);
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.3);
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

.product-image-wrapper-small {
  position: relative;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mintiss-reward {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}

.cta-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
}

.no-image-placeholder-small {
  width: 100%;
  height: 150px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.no-image-placeholder-small i {
  font-size: 2rem;
}

/* ===== MOBILE RESPONSIVE STYLES ===== */

/* Info Cards - Mobile Responsive */
.info-card {
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  height: 140px;
  min-height: 140px;
}

.info-icon {
  background: linear-gradient(135deg, #1177bf 60%, #ffd700 100%);
  width: 40px;
  height: 40px;
}

.info-title {
  font-size: 0.9rem;
  color: #1177bf;
  line-height: 1.2;
}

.info-span {
  color: #1177bf;
  font-size: 0.8rem;
  display: block;
}

.info-value {
  font-size: 0.85rem;
}

/* Hero Section - Mobile Responsive */
.hero-section {
  border-radius: 8px;
}

.hero-image {
  object-fit: cover;
  max-height: 200px;
}

/* Categories - Mobile Responsive */
.categories-container {
  padding: 0 4px;
}

.category-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.category-name {
  font-size: 0.75rem;
  line-height: 1.2;
}

/* Featured Banner - Mobile Responsive */
.banner-title {
  font-size: 1.5rem;
  line-height: 1.3;
}

.banner-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.banner-icon {
  font-size: 2rem;
  opacity: 0.7;
}

/* Product Cards - Mobile Responsive */
.product-card {
  min-height: 280px;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-image-small {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name-ellipsis {
  font-size: 0.85rem;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description-ellipsis {
  font-size: 0.75rem;
  line-height: 1.3;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #6c757d;
}

.product-price {
  font-size: 0.9rem;
}

.original-price {
  font-size: 0.75rem;
}

.category-title {
  font-size: 1.1rem;
}

.view-all-btn {
  font-size: 0.8rem;
  padding: 4px 8px;
}

.mintiss-reward {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  font-size: 0.7rem;
}

.discount-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: bold;
}

.no-image-placeholder-small {
  width: 100%;
  height: 120px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.no-image-placeholder-small i {
  font-size: 1.5rem;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .info-card {
    height: 160px;
    min-height: 160px;
  }
  
  .info-icon {
    width: 48px;
    height: 48px;
  }
  
  .info-title {
    font-size: 1rem;
  }
  
  .info-value {
    font-size: 0.9rem;
  }
  
  .hero-image {
    max-height: 250px;
  }
  
  .category-image {
    width: 70px;
    height: 70px;
  }
  
  .category-name {
    font-size: 0.8rem;
  }
  
  .banner-title {
    font-size: 1.75rem;
  }
  
  .banner-text {
    font-size: 1rem;
  }
  
  .banner-icon {
    font-size: 2.5rem;
  }
  
  .product-image-small {
    height: 140px;
  }
  
  .product-name-ellipsis {
    font-size: 0.9rem;
  }
  
  .product-description-ellipsis {
    font-size: 0.8rem;
  }
  
  .product-price {
    font-size: 1rem;
  }
  
  .category-title {
    font-size: 1.25rem;
  }
  
  .view-all-btn {
    font-size: 0.85rem;
    padding: 5px 10px;
  }
  
  .mintiss-reward {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .discount-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
  
  .no-image-placeholder-small {
    height: 140px;
  }
  
  .no-image-placeholder-small i {
    font-size: 1.75rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .info-card {
    height: 180px;
    min-height: 180px;
  }
  
  .info-icon {
    width: 56px;
    height: 56px;
  }
  
  .info-title {
    font-size: 1.15rem;
  }
  
  .info-value {
    font-size: 1.1rem;
  }
  
  .hero-image {
    max-height: 300px;
  }
  
  .category-image {
    width: 80px;
    height: 80px;
  }
  
  .category-name {
    font-size: 0.9rem;
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-text {
    font-size: 1.1rem;
  }
  
  .banner-icon {
    font-size: 3rem;
  }
  
  .product-card {
    min-height: 300px;
  }
  
  .product-image-small {
    height: 150px;
  }
  
  .product-name-ellipsis {
    font-size: 1rem;
  }
  
  .product-description-ellipsis {
    font-size: 0.85rem;
  }
  
  .product-price {
    font-size: 1.1rem;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .view-all-btn {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .mintiss-reward {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
  
  .discount-badge {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .no-image-placeholder-small {
    height: 150px;
  }
  
  .no-image-placeholder-small i {
    font-size: 2rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .hero-image {
    max-height: 400px;
  }
  
  .product-card {
    min-height: 320px;
  }
  
  .product-image-small {
    height: 160px;
  }
  
  .no-image-placeholder-small {
    height: 160px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .product-card {
    min-height: 340px;
  }
  
  .product-image-small {
    height: 180px;
  }
  
  .no-image-placeholder-small {
    height: 180px;
  }
}

/* Hover effects for desktop */
@media (min-width: 768px) {
  .info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
  
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
}

/* Touch-friendly interactions for mobile */
@media (max-width: 767px) {
  .info-card:active {
    transform: scale(0.98);
  }
  
  .product-card:active {
    transform: scale(0.98);
  }
  
  .btn:active {
    transform: scale(0.95);
  }
}
</style>
