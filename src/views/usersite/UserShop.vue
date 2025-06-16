<template>
    <div class="shop container mt-4">
      <!-- SLIDER (Non-removable) -->
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button v-if="!loading" v-for="(image, index) in images" :key="index" type="button"
            :data-bs-target="'#carouselExampleIndicators'" :data-bs-slide-to="index" :class="{ active: index === 0 }"
            aria-current="true" :aria-label="'Slide ' + (index + 1)"></button>
  
          <button v-else v-for="n in 5" :key="'placeholder-indicator-' + n" type="button" :class="{ active: n === 1 }"
            aria-current="true" :aria-label="'Loading slide ' + n" disabled></button>
        </div>
  
        <div class="carousel-inner">
          <div v-if="!loadingimg" v-for="(image, index) in images" :key="index"
            :class="['carousel-item', { active: index === 0 }]">
            <img :src="image" class="d-block w-100" alt="Slider image" style="height: 300px; object-fit: cover;" />
          </div>
  
          <div v-else v-for="n in 5" :key="'placeholder-slide-' + n" :class="['carousel-item', { active: n === 1 }]">
            <div class="d-block w-100 placeholder-slide shimmer-bg" style="height: 300px; background-color: #e2e2e2;">
            </div>
          </div>
        </div>
  
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev" :disabled="loadingimg">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next" :disabled="loading">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
  
  
      <!-- CATEGORIES & SUBCATEGORIES -->
      <div class="mt-5">
        <!-- Loading placeholders -->
        <div v-if="loading" class="d-flex flex-wrap justify-content-center gap-3">
          <div v-for="n in 6" :key="'placeholder-' + n" class="custom-col">
            <div class="custom-card placeholder-card h-100 rounded-4">
              <div class="card-img-wrapper rounded-top-4 overflow-hidden shimmer-bg" style="height: 200px;"></div>
              <div class="card-body bg-light rounded-bottom-4">
                <div class="shimmer-bg" style="height: 20px; width: 60%; margin-bottom: 0.5rem; border-radius: 4px;">
                </div>
                <div class="shimmer-bg" style="height: 14px; width: 80%; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Actual categories -->
        <div v-else>
          <div v-for="category in categories" :key="category.category_id" class="mb-5">
            <h3 class="fw-bold mb-3 text-primary text-center">
              {{ category.category_name }}
            </h3>
            <div class="d-flex flex-wrap justify-content-center gap-3">
              <div v-for="sub in category.subcategories" :key="sub.id" class="custom-col">
                <div class="custom-card card h-100 shadow-sm border-0 rounded-4" @click="navigateToCategory(category.category_id)">
                  <div class="card-img-wrapper rounded-top-4 overflow-hidden">
                    <img :src="sub.image || 'https://via.placeholder.com/300x200?text=No+Image'"
                      class="card-img-top img-fluid"
                      style="height: 200px; object-fit: cover; transition: transform 0.3s ease;" />
                  </div>
                  <div class="card-body bg-light rounded-bottom-4">
                    <h5 class="card-title text-dark fw-semibold">
                      {{ sub.name }}
                    </h5>
                    <p class="card-text text-muted small" v-if="sub.description">
                      {{ sub.description }}
                    </p>
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
    name: "UserShop",
    data() {
      return {
        images: [],
        categories: [],
        loading: true,  // <-- new loading state
        loadingimg: true  // <-- new loading state
      };
    },
    mounted() {
      if (!sessionStorage.getItem('homeLoadedOnce')) {
        sessionStorage.setItem('homeLoadedOnce', 'true');
        window.location.reload();
      } else {
        sessionStorage.removeItem('homeLoadedOnce');
      }
  
      this.generateRandomImages();
      this.fetchCategories();
    },
    methods: {
      generateRandomImages() {
        this.loadingimg = true;
        this.images = [];
  
        for (let i = 0; i < 5; i++) {
          this.images.push(`https://picsum.photos/800/500?random=${i}`);
        }
  
        setTimeout(() => {
          this.loadingimg = false;
        }, 1000);
      }
      ,
      async fetchCategories() {
        this.loading = true;
        try {
          const response = await axios.get('/sub-categories');
          this.categories = response.data;
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          this.loading = false;
        }
      },
      navigateToCategory(categoryId) {
        this.$router.push(`/category/${categoryId}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .shimmer-bg {
    position: relative;
    overflow: hidden;
    background-color: #e2e2e2;
  }
  
  .shimmer-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150px;
    bottom: 0;
    width: 150px;
    background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -150px;
    }
  
    100% {
      left: 100%;
    }
  }
  
  /* Skeleton loader styles */
  .skeleton-card {
    pointer-events: none;
    user-select: none;
    background: #e2e2e2;
  }
  
  .skeleton-img {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, #e2e2e2 25%, #f5f5f5 50%, #e2e2e2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem 0.375rem 0 0;
    /* match rounded-top-4 */
  }
  
  .skeleton-text {
    height: 1rem;
    background: linear-gradient(90deg, #e2e2e2 25%, #f5f5f5 50%, #e2e2e2 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }
  
  .skeleton-title {
    width: 60%;
    height: 1.2rem;
    margin: 1rem 0 0.5rem 0;
  }
  
  .skeleton-desc {
    width: 80%;
    height: 0.8rem;
    margin-bottom: 1rem;
  }
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
  
    100% {
      background-position: -200% 0;
    }
  }
  
  /* Rest of your existing styles */
  
  .card-title {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .custom-card:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .card-img-wrapper:hover img {
    transform: scale(1.05);
  }
  
  .custom-col {
    flex: 0 0 calc(33.333% - 1rem);
    max-width: calc(33.333% - 1rem);
  }
  
  /* shimmer background */
  .shimmer-bg {
    position: relative;
    overflow: hidden;
    background-color: #e2e2e2;
  }
  
  .shimmer-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: -150px;
    bottom: 0;
    width: 150px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -150px;
    }
  
    100% {
      left: 100%;
    }
  }
  
  .placeholder-card {
    box-shadow: none;
    pointer-events: none;
    user-select: none;
  }
  
  
  @media (max-width: 768px) {
    .custom-col {
      flex: 0 0 calc(30% - 1rem);
      max-width: calc(30% - 1rem);
    }
  
    .card-img-top {
      height: 150px !important;
    }
  }
  
  @media (max-width: 480px) {
    .custom-col {
      flex: 0 0 calc(45% - 1rem);
      max-width: calc(45% - 1rem);
    }
  }
  </style>
  