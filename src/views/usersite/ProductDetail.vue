<template>
  <div class="container-fluid bg-light min-vh-100">
    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Product Detail Content -->
    <div v-else-if="product" class="container py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <span v-if="product.category">{{ product.category.name }}</span>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <!-- Main Product Section -->
      <div class="row">
        <!-- Product Images -->
        <div class="col-lg-6 mb-4">
          <div class="product-image-container">
            <div v-if="product.images && product.images.length > 0" class="main-image-wrapper">
              <img 
                :src="selectedImage || product.images[0]" 
                :alt="product.name"
                class="main-product-image"
                @error="handleImageError"
              />
            </div>
            <div v-else class="no-image-placeholder">
              <i class="bi bi-image text-muted" style="font-size: 4rem;"></i>
              <p class="text-muted mt-2">No image available</p>
            </div>
            
            <!-- Thumbnail Images -->
            <div v-if="product.images && product.images.length > 1" class="thumbnail-container mt-3">
              <div class="d-flex gap-2 overflow-auto">
                <img 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  :src="image" 
                  :alt="`${product.name} ${index + 1}`"
                  class="thumbnail-image"
                  :class="{ active: selectedImage === image }"
                  @click="selectedImage = image"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-title mb-3">{{ product.name }}</h1>
            
            <!-- Store Information -->
            <div v-if="product.store" class="store-info mb-3">
              <div class="d-flex align-items-center">
                <i class="bi bi-shop text-primary me-2"></i>
                <span class="fw-semibold">{{ product.store.name }}</span>
              </div>
              <div v-if="product.store.address" class="text-muted small">
                <i class="bi bi-geo-alt me-1"></i>
                {{ product.store.address }}, {{ product.store.city }}, {{ product.store.state }}
              </div>
            </div>

            <!-- Price Section -->
            <div class="price-section mb-4">
              <div class="d-flex align-items-center gap-3">
                <span class="current-price">₹{{ product.price }}</span>
                <span v-if="product.canceled_price" class="original-price">₹{{ product.canceled_price }}</span>
                <span v-if="product.canceled_price" class="discount-badge">
                  {{ Math.round(((product.canceled_price - product.price) / product.canceled_price) * 100) }}% OFF
                </span>
              </div>
              <div v-if="product.mintiss" class="mintiss-reward mt-2">
                <i class="bi bi-gift text-warning me-1"></i>
                <span class="text-success fw-semibold">Earn {{ calculateMintissPoints(product.mintiss) }} mintiss points on this purchase</span>
                <div class="mintiss-value-info mt-1">
                  <small class="text-muted">(Worth ₹{{ product.mintiss }} at current mintiss value)</small>
                </div>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-section mb-4">
              <h5 class="mb-3">Quantity</h5>
              <div class="quantity-controls d-flex align-items-center">
                <button 
                  class="btn btn-outline-secondary"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  class="form-control text-center mx-2" 
                  v-model.number="quantity"
                  min="1"
                  max="99"
                  style="width: 80px;"
                />
                <button 
                  class="btn btn-outline-secondary"
                  @click="increaseQuantity"
                  :disabled="quantity >= 99"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            <!-- Product Description -->
            <div class="description-section mb-4">
              <h5 class="mb-3">Description</h5>
              <p class="product-description">{{ product.description || 'No description available.' }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <div class="d-flex gap-3 flex-wrap">
                <button 
                  class="btn btn-primary btn-lg px-4"
                  @click="addToCart"
                  :disabled="isAddingToCart"
                >
                  <i class="bi bi-cart-plus me-2"></i>
                  <span v-if="isAddingToCart">Adding...</span>
                  <span v-else>Add to Cart</span>
                </button>
                <button 
                  class="btn btn-success btn-lg px-4"
                  @click="buyNow"
                  :disabled="isAddingToCart"
                >
                  <i class="bi bi-bag me-2"></i>
                  Buy Now
                </button>
                <button 
                  class="btn btn-outline-secondary btn-lg px-4"
                  @click="toggleWishlist"
                >
                  <i :class="isInWishlist ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
                  <span class="ms-2">{{ isInWishlist ? 'Wishlisted' : 'Wishlist' }}</span>
                </button>
              </div>
            </div>

            <!-- Product Details -->
            <div class="product-details mt-4">
              <div class="row">
                <div class="col-md-6">
                  <div class="detail-item">
                    <span class="detail-label">Product Code:</span>
                    <span class="detail-value">{{ product.unique_code }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">{{ product.category ? product.category.name : 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div v-if="relatedProducts && relatedProducts.length > 0" class="mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0">Related Products</h4>
          <small class="text-muted">{{ relatedProducts.length }} products found</small>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="col">
            <div class="card product-card h-100" @click="goToProductDetail(relatedProduct.id)">
              <div class="product-image-wrapper">
                <img 
                  v-if="relatedProduct.images && relatedProduct.images.length > 0"
                  :src="relatedProduct.images[0]" 
                  :alt="relatedProduct.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder-small">
                  <i class="bi bi-image text-muted"></i>
                </div>
                <div v-if="relatedProduct.canceled_price && relatedProduct.canceled_price > relatedProduct.price" 
                     class="discount-badge">
                  {{ Math.round(((relatedProduct.canceled_price - relatedProduct.price) / relatedProduct.canceled_price) * 100) }}% OFF
                </div>
              </div>
              <div class="card-body p-2">
                <h6 class="card-title product-name">{{ relatedProduct.name }}</h6>
                <div class="price-info">
                  <div class="d-flex align-items-center gap-2">
                    <span class="price">₹{{ relatedProduct.price }}</span>
                    <span v-if="relatedProduct.canceled_price" class="original-price-small">₹{{ relatedProduct.canceled_price }}</span>
                  </div>
                  <div v-if="relatedProduct.mintiss" class="mintiss-info">
                    <small class="text-success">+₹{{ relatedProduct.mintiss }} mintiss</small>
                  </div>
                </div>
                <div class="mt-2">
                  <button 
                    class="btn btn-sm btn-outline-primary w-100"
                    @click.stop="addRelatedToCart(relatedProduct)"
                  >
                    <i class="bi bi-cart-plus me-1"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Store Products Section -->
      <div v-if="storeProducts && storeProducts.length > 0" class="mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="mb-0">More from {{ product.store ? product.store.name : 'this store' }}</h4>
          <small class="text-muted">{{ storeProducts.length }} products found</small>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
          <div v-for="storeProduct in storeProducts" :key="storeProduct.id" class="col">
            <div class="card product-card h-100" @click="goToProductDetail(storeProduct.id)">
              <div class="product-image-wrapper">
                <img 
                  v-if="storeProduct.images && storeProduct.images.length > 0"
                  :src="storeProduct.images[0]" 
                  :alt="storeProduct.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div v-else class="no-image-placeholder-small">
                  <i class="bi bi-image text-muted"></i>
                </div>
                <div v-if="storeProduct.canceled_price && storeProduct.canceled_price > storeProduct.price" 
                     class="discount-badge">
                  {{ Math.round(((storeProduct.canceled_price - storeProduct.price) / storeProduct.canceled_price) * 100) }}% OFF
                </div>
              </div>
              <div class="card-body p-2">
                <h6 class="card-title product-name">{{ storeProduct.name }}</h6>
                <div class="price-info">
                  <div class="d-flex align-items-center gap-2">
                    <span class="price">₹{{ storeProduct.price }}</span>
                    <span v-if="storeProduct.canceled_price" class="original-price-small">₹{{ storeProduct.canceled_price }}</span>
                  </div>
                  <div v-if="storeProduct.mintiss" class="mintiss-info">
                    <small class="text-success">+₹{{ storeProduct.mintiss }} mintiss</small>
                  </div>
                </div>
                <div class="mt-2">
                  <button 
                    class="btn btn-sm btn-outline-primary w-100"
                    @click.stop="addRelatedToCart(storeProduct)"
                  >
                    <i class="bi bi-cart-plus me-1"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Related Products Section -->
      <div v-if="relatedProducts && relatedProducts.length > 0" class="mt-5">
        <div class="related-products-bottom">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">You Might Also Like</h4>
            <small class="text-muted">Discover more products</small>
          </div>
          <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
            <div v-for="relatedProduct in relatedProducts.slice(0, 8)" :key="relatedProduct.id" class="col">
              <div class="card product-card h-100" @click="goToProductDetail(relatedProduct.id)">
                <div class="product-image-wrapper">
                  <img 
                    v-if="relatedProduct.images && relatedProduct.images.length > 0"
                    :src="relatedProduct.images[0]" 
                    :alt="relatedProduct.name"
                    class="product-image"
                    @error="handleImageError"
                  />
                  <div v-else class="no-image-placeholder-small">
                    <i class="bi bi-image text-muted"></i>
                  </div>
                  <div v-if="relatedProduct.canceled_price && relatedProduct.canceled_price > relatedProduct.price" 
                       class="discount-badge">
                    {{ Math.round(((relatedProduct.canceled_price - relatedProduct.price) / relatedProduct.canceled_price) * 100) }}% OFF
                  </div>
                </div>
                <div class="card-body p-2">
                  <h6 class="card-title product-name">{{ relatedProduct.name }}</h6>
                  <div class="price-info">
                    <div class="d-flex align-items-center gap-2">
                      <span class="price">₹{{ relatedProduct.price }}</span>
                      <span v-if="relatedProduct.canceled_price" class="original-price-small">₹{{ relatedProduct.canceled_price }}</span>
                    </div>
                    <div v-if="relatedProduct.mintiss" class="mintiss-info">
                      <small class="text-success">+{{ calculateMintissPoints(relatedProduct.mintiss) }} mintiss</small>
                    </div>
                  </div>
                  <div class="mt-2">
                    <button 
                      class="btn btn-sm btn-outline-primary w-100"
                      @click.stop="addRelatedToCart(relatedProduct)"
                    >
                      <i class="bi bi-cart-plus me-1"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="text-center">
        <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Product not found</h4>
        <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      relatedProducts: [],
      storeProducts: [],
      loading: true,
      selectedImage: null,
      isAddingToCart: false,
      isInWishlist: false,
      quantity: 1,
      mintissValue: 0,
    };
  },
  async mounted() {
    await this.fetchMintissValue();
    await this.fetchProductDetail();
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.loading = true;
        const productId = this.$route.params.id;
        
        if (!productId) {
          throw new Error('Product ID is required');
        }
        
        const response = await axios.get(`/products/${productId}`);
        
        this.product = response.data.product;
        this.relatedProducts = response.data.related_products || [];
        this.storeProducts = response.data.store_products || [];
        
        // Set first image as selected
        if (this.product && this.product.images && this.product.images.length > 0) {
          this.selectedImage = this.product.images[0];
        }
        
        // Check wishlist status
        this.checkWishlistStatus();
      } catch (error) {
        console.error('Error fetching product detail:', error);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },
    addToCart() {
      if (!this.product) return;
      
      this.isAddingToCart = true;
      
      try {
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Check if product already exists in cart
        const existingItemIndex = existingCart.findIndex(item => item.id === this.product.id);
        
        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          existingCart[existingItemIndex].quantity += this.quantity;
        } else {
          // Add new item to cart
          const cartItem = {
            id: this.product.id,
            name: this.product.name,
            description: this.product.description,
            price: this.product.price,
            image: this.product.images && this.product.images.length > 0 ? this.product.images[0] : null,
            quantity: this.quantity,
            mintiss: this.product.mintiss,
            mintissPoints: this.calculateMintissPoints(this.product.mintiss),
            store: this.product.store
          };
          existingCart.push(cartItem);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));
        
        // Show success message
        this.showToast('Product added to cart successfully!', 'success');
        
        // Emit cart update event
        this.$emit('cart-updated');
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showToast('Failed to add product to cart', 'error');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    buyNow() {
      if (!this.product) return;
      
      // Add to cart first
      this.addToCart();
      
      // Navigate to cart page
      setTimeout(() => {
        this.$router.push('/cart');
      }, 500);
    },
    
    toggleWishlist() {
      if (!this.product) return;
      
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const existingIndex = wishlist.findIndex(item => item.id === this.product.id);
        
        if (existingIndex > -1) {
          // Remove from wishlist
          wishlist.splice(existingIndex, 1);
          this.isInWishlist = false;
          this.showToast('Removed from wishlist', 'info');
        } else {
          // Add to wishlist
          const wishlistItem = {
            id: this.product.id,
            name: this.product.name,
            description: this.product.description,
            price: this.product.price,
            image: this.product.images && this.product.images.length > 0 ? this.product.images[0] : null,
            mintiss: this.product.mintiss,
            store: this.product.store
          };
          wishlist.push(wishlistItem);
          this.isInWishlist = true;
          this.showToast('Added to wishlist', 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
      } catch (error) {
        console.error('Error updating wishlist:', error);
        this.showToast('Failed to update wishlist', 'error');
      }
    },
    
    checkWishlistStatus() {
      if (!this.product) return;
      
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        this.isInWishlist = wishlist.some(item => item.id === this.product.id);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    },
    
    showToast(message, type = 'info') {
      // Simple toast notification
      const toast = document.createElement('div');
      toast.className = `toast-notification toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      `;
      
      if (type === 'success') {
        toast.style.backgroundColor = '#28a745';
      } else if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
      } else if (type === 'info') {
        toast.style.backgroundColor = '#17a2b8';
      }
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    },
    
    increaseQuantity() {
      if (this.quantity < 99) {
        this.quantity++;
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    addRelatedToCart(product) {
      try {
        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Check if product already exists in cart
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          existingCart[existingItemIndex].quantity += 1;
        } else {
          // Add new item to cart
          const cartItem = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            quantity: 1,
            mintiss: product.mintiss,
            mintissPoints: this.calculateMintissPoints(product.mintiss),
            store: product.store
          };
          existingCart.push(cartItem);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));
        
        // Show success message
        this.showToast('Product added to cart successfully!', 'success');
        
        // Emit cart update event
        this.$emit('cart-updated');
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showToast('Failed to add product to cart', 'error');
      }
    },
    
    async fetchMintissValue() {
      try {
        const response = await axios.get('/mintiss-value/latest');
        this.mintissValue = parseFloat(response.data.data.value);
      } catch (error) {
        console.error('Error fetching mintiss value:', error);
        this.mintissValue = 0;
      }
    },
    
    calculateMintissPoints(mintissValue) {
      if (!this.mintissValue || this.mintissValue === 0) {
        return '0';
      }
      // Calculate mintiss points: mintiss value / current mintiss value
      const points = mintissValue / this.mintissValue;
      return points.toFixed(8);
    },
    
    goToProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.fetchProductDetail();
      }
    }
  }
};
</script>

<style scoped>
.product-image-container {
  position: relative;
}

.main-image-wrapper {
  width: 100%;
  height: 400px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-image-placeholder {
  width: 100%;
  height: 400px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thumbnail-container {
  max-width: 100%;
}

.thumbnail-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #0d6efd;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
}

.store-info {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #0d6efd;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #198754;
}

.original-price {
  font-size: 1.2rem;
  color: #6c757d;
  text-decoration: line-through;
}

.discount-badge {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.mintiss-reward {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 8px 12px;
}

.product-description {
  line-height: 1.6;
  color: #495057;
}

.action-buttons {
  margin-bottom: 2rem;
}

.btn-lg {
  padding: 12px 24px;
  font-weight: 600;
}

.product-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 600;
  color: #495057;
}

.detail-value {
  color: #6c757d;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #dee2e6;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  width: 100%;
  height: 150px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  height: 2.6em;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price {
  font-weight: 700;
  color: #198754;
  font-size: 1rem;
}

.mintiss-info {
  font-size: 0.75rem;
}

.original-price-small {
  font-size: 0.8rem;
  color: #6c757d;
  text-decoration: line-through;
}

.quantity-controls {
  max-width: 200px;
}

.quantity-controls .btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.quantity-controls input {
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
  
  .main-image-wrapper {
    height: 300px;
  }
  
  .action-buttons .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}

/* Toast Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
