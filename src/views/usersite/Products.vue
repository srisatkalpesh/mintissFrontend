<template>
  <div class="container-fluid bg-light min-vh-100 font-monospace">
    <HeaderNavbar />
    <div class="row row-cols-2 row-cols-md-4 g-3 my-4 justify-content-center">
      <div class="col d-flex justify-content-center" v-for="card in infoCards" :key="card.title">
        <div class="card text-center border-0 shadow-lg rounded-4 card-hover-effect d-flex align-items-stretch" style="transition: transform 0.2s, box-shadow 0.2s; width: 140px; height: 140px; min-width: 140px; min-height: 140px; max-width: 140px; max-height: 140px;">
          <div class="card-body d-flex flex-column align-items-center justify-content-center w-100 h-100 p-2" style="min-height: 0;">
            <div class="mb-2 d-flex align-items-center justify-content-center rounded-circle" style="background: linear-gradient(135deg, #1177bf 60%, #ffd700 100%); width: 40px; height: 40px;">
              <i :class="card.icon + ' text-white'" style="font-size: 1.3rem;"></i>
            </div>
            <h6 class="card-title fw-bold mt-2 mb-1" style="font-size: 0.95rem;">{{ card.title }} <span v-if="card.span" class="text-primary">{{ card.span }}</span></h6>
            <div v-if="card.value" class="fw-bold text-success mt-1" style="font-size: 0.95rem;">{{ card.value }}</div>
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
        <div v-for="(store, idx) in stores" :key="store.name" class="card mb-4 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex flex-column mb-2">
              <span class="fs-5 fw-bold text-primary">{{ store.name }}</span>
              <span class="text-muted small">{{ store.category }}</span>
            </div>
            <div class="mb-2 text-secondary">{{ store.description }}</div>
            <div class="products-carousel-wrapper">
              <Swiper :slides-per-view="1.2" :space-between="20"
                :breakpoints="{ 600: { slidesPerView: 2.2, spaceBetween: 24 }, 900: { slidesPerView: 4.2, spaceBetween: 32 } }"
                class="products-swiper">
                <SwiperSlide v-for="(product, pidx) in store.products" :key="product.unique_code">
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="ratio ratio-4x3 bg-light d-flex align-items-center justify-content-center">
                      <img v-if="product.images && product.images.length" :src="product.images[0]"
                        class="img-fluid object-fit-contain" />
                    </div>
                    <div class="card-body d-flex flex-column">
                      <div class="fw-bold text-primary mb-1">{{ product.name }}</div>
                      <div class="mb-2">
                        <span class="fw-bold text-success">₹{{ product.price }}</span>
                        <span v-if="product.canceled_price" class="text-decoration-line-through text-danger ms-2">₹{{ product.canceled_price }}</span>
                      </div>
                      <button class="btn btn-primary mt-auto" @click="openProduct(product.purchase_url)">{{ product.cta_label || 'Shop now' }}</button>
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
      infoCards: [
        { icon: 'bi bi-cash-coin', title: 'Make', span: '100%', value: 'Cash Back' },
        { icon: 'bi bi-gift', title: 'Free Mintiss', span: 'Sign up now' },
        { icon: 'bi bi-graph-up-arrow', title: 'Today’s Mintiss Value', value: `₹${this.mintissValueDisplay}` },
        { icon: 'bi bi-trophy', title: 'Reward Redemption', span: 'Starting Soon' },
      ],
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
    // Update Mintiss Value card
    this.infoCards[2].value = `₹${this.mintissValueDisplay}`;
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
  box-shadow: 0 8px 32px rgba(17, 119, 191, 0.18), 0 1.5px 8px rgba(0,0,0,0.08);
}
</style>
