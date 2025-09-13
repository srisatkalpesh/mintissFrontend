<template>
  <div class="modern-product-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading product details...</p>
      </div>
    </div>

    <!-- Product Detail Content -->
    <div v-else-if="product" class="product-detail-container">
      <!-- Main Product Section -->
      <div class="product-main-section">
        <!-- Product Images -->
        <div class="product-images-section">
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
              <i class="bi bi-image"></i>
              <p>No image available</p>
            </div>
            
            <!-- Thumbnail Images -->
            <div v-if="product.images && product.images.length > 1" class="thumbnail-container">
              <div class="thumbnail-grid">
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
        <div class="product-info-section">
          <div class="product-info-card">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <!-- Store Information -->
            <div v-if="product.store" class="store-info">
              <div class="store-header">
                <i class="bi bi-shop"></i>
                <span class="store-name">{{ product.store.name }}</span>
              </div>
              <div v-if="product.store.address" class="store-address">
                <i class="bi bi-geo-alt"></i>
                {{ product.store.address }}, {{ product.store.city }}, {{ product.store.state }}
              </div>
            </div>

            <!-- Price Section -->
            <div class="price-section">
              <div class="price-row">
                <span class="current-price">₹{{ product.price }}</span>
                <span v-if="product.canceled_price" class="original-price">₹{{ product.canceled_price }}</span>
                <span v-if="product.canceled_price" class="discount-badge">
                  {{ Math.round(((product.canceled_price - product.price) / product.canceled_price) * 100) }}% OFF
                </span>
              </div>
              <div v-if="product.mintiss" class="mintiss-reward">
                <i class="bi bi-gift"></i>
                <span>Earn {{ calculateMintissPoints(product.mintiss) }} mintiss points on this purchase</span>
                <div class="mintiss-value">
                  <small>(Worth ₹{{ product.mintiss }} at current mintiss value)</small>
                </div>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-section">
              <h5 class="section-label">Quantity</h5>
              <div class="quantity-controls">
                <button 
                  class="quantity-btn"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  class="quantity-input" 
                  v-model.number="quantity"
                  min="1"
                  max="99"
                />
                <button 
                  class="quantity-btn"
                  @click="increaseQuantity"
                  :disabled="quantity >= 99"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>

            <!-- Product Description -->
            <div class="description-section">
              <h5 class="section-label">Description</h5>
              <p class="product-description">{{ product.description || 'No description available.' }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button 
                class="btn btn-primary btn-lg"
                  @click="addToCart"
                  :disabled="isAddingToCart"
                >
                <i class="bi bi-cart-plus me-1"></i>
                  <span v-if="isAddingToCart">Adding...</span>
                  <span v-else>Add to Cart</span>
                </button>
                <button 
                class="btn btn-success btn-lg"
                  @click="buyNow"
                  :disabled="isAddingToCart"
                >
                <i class="bi bi-bag me-1"></i>
                  Buy Now
                </button>
                <button 
                class="btn btn-outline-danger btn-lg"
                  @click="toggleWishlist"
                >
                <i :class="isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                <span class="ms-1">{{ isInWishlist ? 'Wishlisted' : 'Wishlist' }}</span>
                </button>
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
                    <small style="color: #007aff;">+₹{{ relatedProduct.mintiss }} mintiss</small>
                  </div>
                </div>
                <div class="mt-2">
                  <button 
                    class="btn btn-sm modern-related-btn w-100"
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
                    <small style="color: #007aff;">+₹{{ storeProduct.mintiss }} mintiss</small>
                  </div>
                </div>
                <div class="mt-2">
                  <button 
                    class="btn btn-sm modern-related-btn w-100"
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
                      <small style="color: #007aff;">+{{ calculateMintissPoints(relatedProduct.mintiss) }} mintiss</small>
                    </div>
                  </div>
                  <div class="mt-2">
                    <button 
                      class="btn btn-sm modern-related-btn w-100"
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
    <div v-else class="error-state">
      <div class="error-content">
        <i class="bi bi-exclamation-triangle"></i>
        <h4>Product not found</h4>
        <p>The product you're looking for doesn't exist or has been removed.</p>
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
/* ===== MODERN PRODUCT DETAIL STYLES ===== */

/* Main Page Layout */
.modern-product-detail-page {
  background: #fafbfc;
  min-height: 100vh;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading-spinner {
  text-align: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Product Detail Container */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Main Product Section */
.product-main-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* Product Images Section */
.product-images-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8eaed;
}

.product-image-container {
  position: relative;
}

.main-image-wrapper {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  border: 1px solid #e8eaed;
}

.main-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-product-image:hover {
  transform: scale(1.05);
}

.no-image-placeholder {
  text-align: center;
  color: #999;
}

.no-image-placeholder i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.thumbnail-container {
  margin-top: 1rem;
}

.thumbnail-grid {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #007aff;
  transform: scale(1.05);
}

/* Product Info Section */
.product-info-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8eaed;
  height: fit-content;
}

.product-info-card {
  height: 100%;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

/* Store Info */
.store-info {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #007aff;
}

.store-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.store-header i {
  color: #007aff;
  font-size: 1.1rem;
}

.store-name {
  font-weight: 600;
  color: #007aff;
  font-size: 1.1rem;
}

.store-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.store-address i {
  color: #999;
}

/* Price Section */
.price-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 600;
  color: #137333;
  letter-spacing: -0.01em;
}

.original-price {
  font-size: 1.1rem;
  color: #5f6368;
  text-decoration: line-through;
  letter-spacing: 0.01em;
}

.discount-badge {
  background: #ea4335;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(234, 67, 53, 0.3);
}

.mintiss-reward {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007aff;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

.mintiss-reward i {
  color: #007aff;
}

.mintiss-value {
  margin-top: 0.25rem;
}

.mintiss-value small {
  color: #5f6368;
  font-size: 0.8rem;
}

/* Quantity Section */
.quantity-section {
  margin-bottom: 1.5rem;
}

.section-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  letter-spacing: 0.01em;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e8eaed;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #007aff;
}

.quantity-btn:hover:not(:disabled) {
  background: #007aff;
  color: white;
  border-color: #007aff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 80px;
  height: 40px;
  border: 1px solid #e8eaed;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.quantity-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

/* Description Section */
.description-section {
  margin-bottom: 1.5rem;
}

.product-description {
  color: #5f6368;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-buttons .btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;
}

.action-buttons .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-buttons .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Product Details Section */
.product-details-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8eaed;
  margin-bottom: 2rem;
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.error-content {
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8eaed;
  max-width: 400px;
}

.error-content i {
  font-size: 4rem;
  color: #ffc107;
  margin-bottom: 1rem;
}

.error-content h4 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 500;
}

.error-content p {
  color: #5f6368;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .product-detail-container {
    padding: 1rem;
  }
  
  .product-main-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .main-image-wrapper {
    height: 300px;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .current-price {
    font-size: 1.5rem;
  }
  
  .action-buttons {
    gap: 0.75rem;
  }
  
  .action-buttons .btn {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .product-detail-container {
    padding: 0.5rem;
  }
  
  .product-images-section,
  .product-info-section,
  .product-details-section {
    padding: 1rem;
  }
  
  .main-image-wrapper {
    height: 250px;
  }
  
  .product-title {
    font-size: 1.25rem;
  }
  
  .current-price {
    font-size: 1.25rem;
  }
  
  .thumbnail-image {
    width: 60px;
    height: 60px;
  }
}

/* Product Image Container */
.modern-product-image-container {
  position: relative;
}

.main-image-wrapper {
  width: 100%;
  height: 280px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.main-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-product-image:hover {
  transform: scale(1.02);
}

.no-image-placeholder {
  width: 100%;
  height: 280px;
  border: 1px solid #f0f0f0;
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
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #007aff;
  transform: scale(1.05);
}

/* Product Info Styles */
.modern-product-info {
  padding: 0 1rem;
}

.modern-product-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.modern-store-info {
  padding: 8px 12px;
  background: rgba(0, 122, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid #007aff;
}

/* Price Section */
.modern-price-section {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.modern-current-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007aff;
}

.modern-original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.modern-discount-badge {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.modern-mintiss-reward {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
}

/* Quantity Controls */
.modern-quantity-section {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.modern-quantity-controls {
  max-width: 200px;
}

.modern-quantity-btn {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #007aff;
  background: white;
  color: #007aff;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modern-quantity-btn:hover:not(:disabled) {
  background: #007aff;
  color: white;
}

.modern-quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modern-quantity-input {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  width: 60px;
}

/* Description */
.modern-description-section {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.modern-product-description {
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Action Buttons */
.modern-action-buttons {
  margin-bottom: 2rem;
}

.modern-primary-btn {
  background: #007aff;
  border: 1px solid #007aff;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-primary-btn:hover:not(:disabled) {
  background: #0056cc;
  border-color: #0056cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.modern-success-btn {
  background: #28a745;
  border: 1px solid #28a745;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-success-btn:hover:not(:disabled) {
  background: #218838;
  border-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.modern-wishlist-btn {
  background: white;
  border: 1px solid #007aff;
  color: #007aff;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modern-wishlist-btn:hover {
  background: #007aff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.btn-lg {
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Product Details */
.product-details {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 600;
  color: #333;
}

.detail-value {
  color: #666;
}

/* Related Products */
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.product-image-wrapper {
  width: 100%;
  height: 150px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  height: 2.6em;
  color: #333;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price {
  font-weight: 700;
  color: #007aff;
  font-size: 1rem;
}

.mintiss-info {
  font-size: 0.75rem;
  color: #007aff;
}

.original-price-small {
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
}

.modern-related-btn {
  background: #007aff;
  border: 1px solid #007aff;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modern-related-btn:hover {
  background: #0056cc;
  border-color: #0056cc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
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

/* ===== MOBILE RESPONSIVE STYLES ===== */
@media (max-width: 768px) {
  .modern-product-title {
    font-size: 1.3rem;
  }
  
  .modern-current-price {
    font-size: 1.3rem;
  }
  
  .main-image-wrapper {
    height: 250px;
  }
  
  .modern-action-buttons .btn {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .modern-product-info {
    padding: 0;
    margin-top: 0.5rem;
  }
  
  .modern-price-section,
  .modern-quantity-section,
  .modern-description-section {
    padding: 0.5rem;
  }
  
  .modern-quantity-controls {
    max-width: 120px;
  }
  
  .modern-quantity-btn {
    width: 30px;
    height: 30px;
  }
  
  .modern-quantity-input {
    width: 50px;
  }
  
  .btn-lg {
    padding: 8px 16px;
    font-size: 0.85rem;
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
