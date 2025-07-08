<template>
  <div class="store-feed">
    <HeaderNavbar />
    <div class="top-info-cards">
  <div class="info-card cashback-card">
    <div class="icon-wrapper">
      <i class="bi bi-cash-coin"></i>
    </div>
    <div class="info-content">
      <div class="info-title">Make <span>100%</span> Cash Back</div>
    </div>
  </div>

  <div class="info-card free-mintiss-card">
    <div class="icon-wrapper">
      <i class="bi bi-gift"></i>
    </div>
    <div class="info-content">
      <div class="info-title">Free Mintiss <span>Sign up now</span></div>
    </div>
  </div>

  <div class="info-card mintiss-value-card">
    <div class="icon-wrapper">
      <i class="bi bi-graph-up-arrow"></i>
    </div>
    <div class="info-content">
      <div class="info-title">Today’s Mintiss Value</div>
      <div class="mintiss-value-amount">₹{{ mintissValueDisplay }}</div>
    </div>
  </div>

  <div class="info-card reward-redemption-card">
    <div class="icon-wrapper">
      <i class="bi bi-trophy"></i>
    </div>
    <div class="info-content">
      <div class="info-title">Reward Redemption <span>Starting Soon</span></div>
    </div>
  </div>
</div>

    
    <div class="feed-content">
      <div v-if="loading" class="skeleton-loader">
        <div v-for="n in 2" :key="n" class="store-card skeleton-store pro">
          <div class="store-header">
            <div class="skeleton skeleton-text skeleton-title"></div>
            <div class="skeleton skeleton-text skeleton-sub"></div>
            <div class="skeleton skeleton-text skeleton-sub"></div>
          </div>
          <div class="store-description skeleton skeleton-text skeleton-desc"></div>
          <div class="products-row carousel">
            <div v-for="m in 3" :key="m" class="product-card-horizontal skeleton-product pro">
              <div class="product-img-wrap">
                <div class="skeleton skeleton-img"></div>
              </div>
              <div class="product-info-horizontal">
                <div class="skeleton skeleton-text skeleton-prod-title"></div>
                <div class="skeleton skeleton-text skeleton-prod-price"></div>
                <div class="skeleton skeleton-btn"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div v-for="(store, idx) in stores" :key="store.name" class="store-card pro">
          <div class="store-header">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-category">{{ store.category }}</div>
          </div>
          <div class="store-description">{{ store.description }}</div>
          <div class="products-carousel-wrapper">
            <div class="products-row-controls">
              <Swiper
                :slides-per-view="1.2"
                :space-between="20"
                :breakpoints="{600: {slidesPerView: 2.2, spaceBetween: 24}, 900: {slidesPerView: 3.2, spaceBetween: 32}}"
                class="products-swiper"
              >
                <SwiperSlide v-for="(product, pidx) in store.products" :key="product.unique_code">
                  <div :class="['product-card-horizontal', 'pro', 'modern-product-card']">
                    <div class="modern-img-container">
                      <img v-if="product.images && product.images.length" :src="product.images[0]" class="modern-product-img" />
                    </div>
                    <div class="modern-product-info">
                      <div class="modern-product-name">{{ product.name }}</div>
                      <div class="modern-product-pricing">
                        <span class="modern-product-price">₹{{ product.price }}</span>
                        <span v-if="product.canceled_price" class="modern-product-canceled">₹{{ product.canceled_price }}</span>
                      </div>
                      <button class="modern-cta-btn" @click="openProduct(product.purchase_url)">{{ product.cta_label || 'Shop now' }}</button>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </template>
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
  data() {
    return {
      stores: [],
      loading: true,
      currentTab: 'home',
      userBalance: null,
      mintissValue: 0,
      hoveredStore: null,
      carouselRefs: [],
    };
  },
  computed: {
    userName() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.name : '';
    },
    mintissValueDisplay() {
      return this.mintissValue ? this.mintissValue.toFixed(8) : '0.00000000';
    },
  },
  async mounted() {
    await this.fetchMintissValue();
    this.calculateUserBalance();
    this.fetchStores();
  },
  methods: {
    async fetchStores() {
      this.loading = true;
      try {
        const res = await axios.get('/showall/products');
        this.stores = res.data.stores || res.data || [];
      } catch (e) {
        // handle error
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
    openProduct(url) {
      window.open(url, '_blank');
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    setCarouselRef(el, idx) {
      if (el) this.carouselRefs[idx] = el;
    },
    scrollProducts(idx, direction) {
      const el = this.carouselRefs[idx];
      if (el) {
        const scrollAmount = Math.max(el.offsetWidth * 0.8, 200);
        console.log('Scrolling', { idx, direction, scrollAmount, el });
        if (direction < 0) {
          el.scrollLeft -= scrollAmount;
        } else {
          el.scrollLeft += scrollAmount;
        }
      }
    },
  },
};
</script>

<style scoped>
:root {
  --accent: #1177bf;
  --card-bg: #fff;
  --card-shadow: 0 2px 12px rgba(0,0,0,0.07);
  --border-radius: 1.2rem;
  --gray: #f4f6fa;
  --text-main: #222;
  --text-sub: #888;
}
.store-feed {
  background: #f4f6fa;
  min-height: 100vh;
  font-family: 'Inter', Arial, sans-serif;
}
.top-info-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}
@media (max-width: 900px) {
  .top-info-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-card {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.icon-wrapper {
  background: #fff;
  border-radius: 50%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 2rem;
  color: #4a90e2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.info-title span {
  color: #4a90e2;
  font-weight: 700;
}

.mintiss-value-amount {
  margin-top: 0.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: #27ae60;
}

.user-info-bar.curved-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 4px 24px rgba(135, 206, 235, 0.10);
  margin-bottom: 0.5rem;
  gap: 1.5rem;
}
.user-name, .user-points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.login-btn, .signup-btn {
  background: #1177bf;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.6rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.signup-btn {
  background: #ffd700;
  color: #222;
}
.login-btn:hover {
  background: #0d5c9e;
}
.signup-btn:hover {
  background: #ffe066;
}
.feed-content {
  width: 100%;
  max-width: none;
  margin: 2rem 0;
  padding: 0;
}
.products-carousel-wrapper {
  position: relative;
  width: 100%;
}
.products-row-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  width: 100%;
}
/* Remove horizontal scroll and fade indicators for carousel */
.products-row.carousel {
  overflow-x: unset !important;
  scrollbar-width: none !important;
}
.products-row.carousel::-webkit-scrollbar {
  display: none !important;
}
.carousel-fade-left, .carousel-fade-right {
  display: none !important;
}
.products-swiper {
  width: 100%;
  padding-bottom: 2rem;
}
.swiper-button-next, .swiper-button-prev {
  color: #1177bf;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(17,119,191,0.10);
  width: 36px;
  height: 36px;
  top: 40%;
}
/* Remove Swiper navigation arrow styles and after pseudo-elements */
.swiper-button-next,
.swiper-button-prev {
  display: none !important;
}
@media (max-width: 600px) {
  .swiper-button-next, .swiper-button-prev {
    width: 28px;
    height: 28px;
    top: 35%;
  }
}
.store-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  margin-bottom: 2.5rem;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
}
.store-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.7rem;
}
.store-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1177bf;
}
.store-category {
  font-size: 1rem;
  color: #888;
}
.store-location {
  font-size: 0.95rem;
  color: #aaa;
}
.store-description {
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 1rem;
}
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.product-card {
  display: flex;
  gap: 1.2rem;
  background: #f8fbff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  align-items: flex-start;
}
.product-images {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.7rem;
  background: #e0e0e0;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.product-desc {
  font-size: 0.98rem;
  color: #666;
}
.product-pricing {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0.2rem 0 0.5rem 0;
}
.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1177bf;
}
.product-canceled {
  font-size: 1rem;
  color: #c00;
  text-decoration: line-through;
}
.cta-btn {
  background: #1177bf;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cta-btn:hover {
  background: #0d5c9e;
}
.ad-placeholder {
  margin: 1.5rem 0 0.5rem 0;
  background: #e0eaff;
  color: #1177bf;
  text-align: center;
  border-radius: 1rem;
  padding: 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
}
.products-row {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.2rem;
  scrollbar-width: thin;
  scrollbar-color: #1177bf #e0eaff;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
}
.products-row::-webkit-scrollbar {
  height: 8px;
}
.products-row::-webkit-scrollbar-thumb {
  background: #1177bf;
  border-radius: 4px;
}
.product-card-horizontal {
  min-width: 300px;
  max-width: 320px;
  background: #fff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 1.5rem 0;
  margin-bottom: 0.5rem;
  position: relative;
  border: 1px solid #f0f0f0;
}
.product-img-wrap {
  width: 100%;
  height: 240px;
  background: #f8fbff;
  border-radius: 1.1rem 1.1rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-img-horizontal {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 1.1rem 1.1rem 0 0;
  background: #e0e0e0;
}
.product-info-horizontal {
  padding: 1.2rem 1.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.product-name-horizontal {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.3rem;
  min-height: 2.2em;
}
.product-pricing-horizontal {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.product-price-horizontal {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1177bf;
}
.product-canceled-horizontal {
  font-size: 1.1rem;
  color: #c00;
  text-decoration: line-through;
}
.cta-btn-horizontal {
  background: #ffd700;
  color: #222;
  border: none;
  border-radius: 1.2rem;
  padding: 0.8rem 1.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: auto;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.cta-btn-horizontal:hover {
  background: #ffe066;
}
.skeleton-loader {
  width: 100%;
  padding: 0 0.5rem;
}
.skeleton-store {
  opacity: 0.8;
}
.skeleton-product {
  opacity: 0.8;
}
.skeleton {
  background: linear-gradient(90deg, #ececec 25%, #f5f5f5 37%, #ececec 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s linear infinite;
  border-radius: 0.5rem;
}
.skeleton-text {
  height: 18px;
  margin-bottom: 0.7rem;
}
.skeleton-title {
  width: 60%;
  height: 24px;
  margin-bottom: 0.5rem;
}
.skeleton-sub {
  width: 30%;
  height: 16px;
}
.skeleton-desc {
  width: 80%;
  height: 16px;
  margin-bottom: 1rem;
}
.skeleton-img {
  width: 100%;
  height: 180px;
  border-radius: 1.1rem 1.1rem 0 0;
}
.skeleton-prod-title {
  width: 70%;
  height: 20px;
  margin-bottom: 0.4rem;
}
.skeleton-prod-price {
  width: 40%;
  height: 18px;
  margin-bottom: 0.7rem;
}
.skeleton-btn {
  width: 60%;
  height: 32px;
  border-radius: 1.2rem;
}
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
.top-info-cards.pro {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  margin: 1.5rem 0 1.5rem 0;
  padding: 0 1rem;
}
.info-card.pro {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  padding: 1.3rem 1rem 1.1rem 1rem;
  font-size: 1.08rem;
  font-weight: 600;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 90px;
  color: var(--text-main);
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.18s, border-color 0.18s, background 0.18s, transform 0.18s;
  cursor: pointer;
}
.info-card.pro:hover {
  box-shadow: 0 6px 24px rgba(17,119,191,0.13);
  border-color: var(--accent);
  background: #f7fbff;
  transform: translateY(-3px) scale(1.025);
  z-index: 2;
}
.cashback-card .info-icon { color: #1177bf; }
.free-mintiss-card .info-icon { color: #e67e22; }
.mintiss-value-card .info-icon { color: #6a1b9a; }
.reward-redemption-card .info-icon { color: #388e3c; }
.info-card.pro .info-icon {
  font-size: 1.5em;
  margin-bottom: 0.3em;
  color: var(--accent);
}
.info-card.pro .info-title {
  font-size: 1.08em;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-main);
}
.info-card.pro span {
  color: var(--accent);
  font-weight: 900;
  font-size: 1em;
}
.info-card.pro .mintiss-value-amount {
  font-size: 1.3em;
  font-weight: 900;
  margin-top: 0.2em;
  color: var(--accent);
}
@media (max-width: 900px) {
  .top-info-cards.pro {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
@media (max-width: 600px) {
  .top-info-cards.pro {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
    padding: 0 0.5rem;
  }
  .info-card.pro {
    font-size: 1rem;
    padding: 0.9rem 0.5rem;
    min-height: 70px;
  }
  .carousel-arrow {
    display: none !important;
  }
  .row-scroll-btn {
    display: none !important;
  }
  .products-row-controls {
    gap: 0;
  }
}
/* Modern Hopscotch-style Product Card */
.modern-product-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(17,119,191,0.10);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 1.2rem 0;
  margin-bottom: 2rem;
  border: none;
  overflow: hidden;
  min-width: 260px;
  max-width: 340px;
}
.modern-img-container {
  position: relative;
  width: 100%;
  background: #f4f6fa;
  border-radius: 1.5rem 1.5rem 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
.modern-product-img {
  width: 100%;
  height: 220px;
  object-fit: contain;
  border-radius: 1.5rem 1.5rem 0 0;
  background: #e0e0e0;
}
.modern-banner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #1177bf;
  color: #fff;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 0 1.5rem 1.5rem;
  font-size: 1.08rem;
  font-weight: 600;
}
.modern-banner-text {
  font-size: 1rem;
  font-weight: 600;
}
.modern-product-info {
  padding: 1.2rem 1.5rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.modern-product-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1177bf;
  margin-bottom: 0.3rem;
  min-height: 2.2em;
}
.modern-product-pricing {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.modern-product-price {
  font-size: 1.18rem;
  font-weight: 700;
  color: #1177bf;
}
.modern-product-canceled {
  font-size: 1.05rem;
  color: #c00;
  text-decoration: line-through;
}
.modern-cta-btn {
  background: #1177bf;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 1.5rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  box-shadow: 0 1px 4px rgba(17,119,191,0.08);
}
.modern-cta-btn:hover {
  background: #0d5c9e;
}
/* Remove large/small card width classes */
.product-card-horizontal--large,
.product-card-horizontal--small {
  flex: unset !important;
  max-width: unset !important;
  min-width: unset !important;
}
</style> 