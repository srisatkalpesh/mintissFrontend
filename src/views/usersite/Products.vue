<template>
  <div class="container-fluid bg-light min-vh-100 font-monospace">
    <!-- ✅ Info Cards -->
    <div class="row row-cols-2 row-cols-md-4 g-3 my-4 justify-content-center">
      <div class="col d-flex justify-content-center" v-for="card in infoCards" :key="card.title">
        <div class="card text-center border-0 shadow-lg rounded-4 card-hover-effect d-flex align-items-stretch"
          :style="'transition: transform 0.2s, box-shadow 0.2s; width: 180px; height: 180px; min-width: 180px; min-height: 180px; max-width: 180px; max-height: 180px;'"
          @click="
            card.title === 'Free Mintiss'
              ? goToLogin()
              : card.title === 'Today’s Mintiss Value'
                ? goToMintiss()
                : card.title === 'Refer & Earn'
                  ? goToReferral()
                  : null
            " :class="{
              'cursor-pointer':
                card.title === 'Free Mintiss' ||
                card.title === 'Today’s Mintiss Value' ||
                card.title === 'Refer & Earn'
            }">
          <div class="card-body d-flex flex-column align-items-center justify-content-center w-100 h-100 p-2"
            style="min-height: 0;">
            <div class="mb-2 d-flex align-items-center justify-content-center rounded-circle"
              style="background: linear-gradient(135deg, #1177bf 60%, #ffd700 100%); width: 56px; height: 56px;">
              <i :class="card.icon + ' text-white'" style="font-size: 2rem;"></i>
            </div>
            <h6 class="card-title fw-bold mt-2 mb-1" style="font-size: 1.15rem; color: #1177bf;">
              {{ card.title }}
              <span v-if="card.span" style="color: #1177bf;">{{ card.span }}</span>
            </h6>
            <div v-if="card.value" class="fw-bold text-success mt-1" style="font-size: 1.1rem;">
              {{ card.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ✅ Hero Section (Bootstrap only) -->
    <div class="my-4">
      <div v-if="heroSections.length > 0" class="w-100">
        <div v-for="hero in heroSections" :key="hero.id" class="position-relative rounded overflow-hidden shadow">
          <!-- Image -->
          <img :src="hero.image_url" :alt="hero.title" class="img-fluid w-100"
            style="object-fit: cover; max-height: 400px;" />

          <!-- Overlay (Title + Subtitle) -->
          <!-- <div
            class="position-absolute bottom-0 start-50 translate-middle-x bg-light bg-opacity-75 text-center p-2 rounded w-75 mb-3">
            <h5 class="fw-bold mb-1">{{ hero.title }}</h5>
            <p class="mb-0 text-muted">{{ hero.subtitle }}</p>
          </div> -->
        </div>
      </div>
    </div>

    <!-- ✅ Categories -->
    <div class="w-100 my-4 overflow-auto">
      <div class="d-flex flex-row flex-nowrap w-100 gx-3">
        <div v-for="cat in categories.slice(0, 10)" :key="cat.id"
          class="d-flex flex-column align-items-center flex-fill mx-2">
          <img :src="cat.image" alt="Category Image" class="rounded-circle border shadow"
            style="width: 80px; height: 80px; object-fit: cover;" />
          <div class="mt-3 text-center fw-semibold">{{ cat.name }}</div>
        </div>
      </div>
    </div>
    <!-- ✅ Products Carousel -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center my-5" style="height: 200px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
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
