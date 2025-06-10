<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Left Sidebar - Subcategories -->
      <div class="col-md-3">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Subcategories</h5>
          </div>
          <div class="list-group list-group-flush">
            <a v-for="sub in subcategories" 
               :key="sub.id" 
               href="#" 
               class="list-group-item list-group-item-action d-flex align-items-center"
               :class="{ active: selectedSubcategory === sub.id }"
               @click.prevent="selectSubcategory(sub.id)">
              <img :src="sub.image || 'https://via.placeholder.com/50x50?text=No+Image'"
                   class="me-3 rounded"
                   style="width: 50px; height: 50px; object-fit: cover;"
                   :alt="sub.name">
              <span>{{ sub.name }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content - Products -->
      <div class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">{{ categoryName }}</h2>
          <div class="d-flex gap-2">
            <select class="form-select" v-model="sortBy">
              <option value="name">Sort by Name</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="row">
          <div v-for="n in 6" :key="n" class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-img-top placeholder-glow" style="height: 200px;"></div>
              <div class="card-body">
                <h5 class="card-title placeholder-glow">
                  <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-4"></span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else class="row">
          <div v-for="product in products" :key="product.id" class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img :src="product.image || 'https://via.placeholder.com/300x200?text=No+Image'" 
                   class="card-img-top" 
                   :alt="product.name"
                   style="height: 200px; object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text text-muted">{{ product.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 mb-0">₹{{ product.price }}</span>
                  <button class="btn btn-primary" @click="addToCart(product)">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Products Message -->
        <div v-if="!loading && products.length === 0" class="text-center py-5">
          <h3 class="text-muted">No products found</h3>
          <p class="text-muted">Try selecting a different subcategory</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
  name: 'CategoryView',
  data() {
    return {
      categoryName: '',
      subcategories: [],
      products: [],
      selectedSubcategory: null,
      sortBy: 'name',
      loading: true
    };
  },
  watch: {
    sortBy() {
      this.sortProducts();
    }
  },
  methods: {
    async fetchCategoryData() {
      this.loading = true;
      try {
        const categoryId = this.$route.params.id;
        const response = await axios.get(`/sub-categories/${categoryId}`);
        this.categoryName = response.data.name;
        this.subcategories = response.data.subcategories;
        
        if (this.subcategories.length > 0) {
          this.selectedSubcategory = this.subcategories[0].id;
          await this.fetchProducts();
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get(`/products`, {
          params: {
            subcategory_id: this.selectedSubcategory
          }
        });
        this.products = response.data;
        this.sortProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    selectSubcategory(subcategoryId) {
      this.selectedSubcategory = subcategoryId;
      this.fetchProducts();
    },
    sortProducts() {
      switch (this.sortBy) {
        case 'name':
          this.products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price_asc':
          this.products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          this.products.sort((a, b) => b.price - a.price);
          break;
      }
    },
    addToCart(product) {
      // Get existing cart from localStorage
      const savedCart = localStorage.getItem('cart');
      let cart = savedCart ? JSON.parse(savedCart) : [];
      
      // Check if product already exists in cart
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If product exists, increase quantity
        existingItem.quantity += 1;
        toastService.success('Product quantity updated in cart!');
      } else {
        // If product doesn't exist, add it with quantity 1
        cart.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: 1
        });
        toastService.success('Product added to cart successfully!');
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  },
  mounted() {
    this.fetchCategoryData();
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

.placeholder-glow {
  background-color: #e9ecef;
  animation: placeholder-glow 2s ease-in-out infinite;
}

@keyframes placeholder-glow {
  50% {
    opacity: 0.5;
  }
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .col-md-3 {
    position: sticky;
    top: 20px;
    z-index: 100;
  }
  
  .list-group-item {
    padding: 0.75rem;
  }
  
  .list-group-item img {
    width: 40px !important;
    height: 40px !important;
  }
}
</style> 