<template>
  <div class="container-fluid bg-light min-vh-100 font-monospace">
    <!-- HeaderNavbar removed, now handled globally -->
    <div class="row row-cols-2 row-cols-md-4 g-3 my-4 justify-content-center">
      <div class="col d-flex justify-content-center" v-for="card in infoCards" :key="card.title">
        <div
          class="card text-center border-0 shadow-lg rounded-4 card-hover-effect d-flex align-items-stretch"
          :style="'transition: transform 0.2s, box-shadow 0.2s; width: 180px; height: 180px; min-width: 180px; min-height: 180px; max-width: 180px; max-height: 180px;'"
          @click="
            card.title === 'Free Mintiss'
              ? goToLogin()
              : card.title === 'Today’s Mintiss Value'
              ? goToMintiss()
              : null
          "
          :class="{
            'cursor-pointer':
              card.title === 'Free Mintiss' ||
              card.title === 'Today’s Mintiss Value'
          }"
        >
          <div class="card-body d-flex flex-column align-items-center justify-content-center w-100 h-100 p-2"
            style="min-height: 0;">
            <div class="mb-2 d-flex align-items-center justify-content-center rounded-circle"
              style="background: linear-gradient(135deg, #1177bf 60%, #ffd700 100%); width: 56px; height: 56px;">
              <i :class="card.icon + ' text-white'" style="font-size: 2rem;"></i>
            </div>
            <h6 class="card-title fw-bold mt-2 mb-1" style="font-size: 1.15rem; color: #1177bf;">{{ card.title }} <span
                v-if="card.span" style="color: #1177bf;">{{ card.span }}</span></h6>
            <div v-if="card.value" class="fw-bold text-success mt-1" style="font-size: 1.1rem;">{{ card.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="feed-content">
      <div v-if="loading" class="row g-3">
        <div v-for="n in 2" :key="n" class="col-12 mb-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="placeholder-glow mb-2">
                <span class="placeholder col-6"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-4"></span>
              </div>
              <div class="placeholder-glow mb-3">
                <span class="placeholder col-8"></span>
              </div>
              <div class="row g-2">
                <div v-for="m in 3" :key="m" class="col">
                  <div class="card h-100">
                    <div class="ratio ratio-4x3 bg-secondary bg-opacity-10 mb-2"></div>
                    <div class="card-body p-2">
                      <span class="placeholder col-8 mb-2"></span>
                      <span class="placeholder col-4 mb-2"></span>
                      <span class="placeholder col-6"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div v-if="noResults" class="d-flex flex-column align-items-center justify-content-center my-5">
          <i class="bi bi-emoji-frown text-danger mb-2" style="font-size: 3rem;"></i>
          <div class="text-center text-danger fw-bold" style="font-size: 1.2rem;">We don't have this product or store.
          </div>
        </div>
        <div v-else>
          <div v-for="(store, idx) in stores" :key="store.name" class="card mb-4 shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex flex-column mb-2">
                <span class="fs-5 fw-bold" style="color: #1177bf;">{{ store.name }}</span>
              </div>
              <div class="mb-2 text-secondary store-description-ellipsis">
                {{ store.description }}
              </div>
              <div class="products-carousel-wrapper">
                <Swiper :slides-per-view="1.2" :space-between="20"
                  :breakpoints="{ 600: { slidesPerView: 2.2, spaceBetween: 24 }, 900: { slidesPerView: 4.2, spaceBetween: 32 } }"
                  class="products-swiper">
                  <SwiperSlide v-for="(product, pidx) in store.products" :key="product.unique_code">
                    <div class="card product-card" @click="openProduct(product.purchase_url)">
                      <div class="product-image-wrapper">
                        <img v-if="product.images && product.images.length" :src="product.images[0]"
                          class="product-image" alt="Product" />
                      </div>
                      <div class="product-info-overlay">
                        <!-- Product name and CTA label (button) if no price/canceled_price -->
                        <div class="d-flex align-items-center justify-content-between mb-1">
                          <div class="fw-bold product-name-ellipsis" style="color: #1177bf;">
                            {{ product.name }}
                          </div>
                          <button
                            v-if="!product.price && !product.canceled_price && product.cta_label"
                            class="btn btn-sm px-2 product-cta-btn"
                            style="background-color: #1177bf; border-color: #1177bf; color: #fff;" tabindex="-1">
                            {{ product.cta_label }}
                          </button>
                        </div>
                        <!-- Price/canceled_price and CTA button only if price/canceled_price exists -->
                        <div class="d-flex align-items-center justify-content-between mb-1" v-if="product.price || product.canceled_price">
                          <div>
                            <span v-if="product.price !== null && product.price !== undefined && product.price !== ''"
                                  class="fw-bold text-success">
                              ₹{{ product.price }}
                            </span>
                            <span v-if="product.canceled_price !== null && product.canceled_price !== undefined && product.canceled_price !== ''"
                                  class="text-decoration-line-through text-danger ms-2">
                              ₹{{ product.canceled_price }}
                            </span>
                          </div>
                          <button class="btn btn-sm px-2 product-cta-btn"
                            style="background-color: #1177bf; border-color: #1177bf; color: #fff;" tabindex="-1">
                            {{ product.cta_label || 'Shop now' }}
                          </button>
                        </div>
                        <div class="product-description-ellipsis text-secondary small">
                          {{ product.description }}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
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
        { icon: 'bi bi-cash-coin', title: 'Make', span: '100%', value: 'Cash Back' },
        { icon: 'bi bi-gift', title: 'Free Mintiss', span: 'Sign up now' },
        { icon: 'bi bi-graph-up-arrow', title: 'Today’s Mintiss Value', value: `₹${this.mintissValueDisplay}` },
        { icon: 'bi bi-trophy', title: 'Reward Redemption', span: 'Starting Soon' },
      ],
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
    // this.fetchStores(); // Removed to only fetch on search
    // Update Mintiss Value card
    this.infoCards[2].value = `₹${this.mintissValueDisplay}`;
  },
  methods: {
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
    openProduct(url) {
      window.open(url, '_blank');
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

/* Responsive product card widths */
@media (max-width: 1200px) {
  .product-card {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }

  .product-image-wrapper {
    height: 340px;
    min-height: 340px;
    max-height: 340px;
  }
}

@media (max-width: 900px) {
  .card-body {
    padding: 12px 6px !important;
  }
}

/* @media (max-width: 600px) {
  .product-card {
    width: 160px;
    min-width: 160px;
    max-width: 160px;
  }
  .product-image-wrapper {
    height: 120px;
    min-height: 120px;
    max-height: 120px;
  }
  .card-body {
    padding: 12px 6px !important;
  }
} */

/* @media (max-width: 380px) {
  .product-card {
    width: 120px;
    min-width: 120px;
    max-width: 120px;
  }
  .product-image-wrapper {
    height: 80px;
    min-height: 80px;
    max-height: 80px;
  }
} */

/* Reduce padding under the slider for large screens */
.products-carousel-wrapper {
  padding-bottom: 16px;
}

@media (min-width: 1400px) {
  .products-carousel-wrapper {
    padding-bottom: 4px !important;
  }

  .card-body {
    padding-bottom: 12px !important;
    padding-top: 18px !important;
  }
}
</style>
