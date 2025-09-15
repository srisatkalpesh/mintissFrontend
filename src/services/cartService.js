import toastService from './toastService';

class CartService {
  constructor() {
    this.cartKey = 'cart';
  }

  // Get all cart items
  getCartItems() {
    try {
      const cart = localStorage.getItem(this.cartKey);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  // Add item to cart
  addToCart(product, quantity = 1) {
    try {
      const cartItems = this.getCartItems();
      
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += quantity;
        toastService.success(`Updated quantity for ${product.name}`);
      } else {
        // Add new item to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          quantity: quantity,
          mintissPoints: product.mintiss || 0,
          store_id: product.store_id,
          unique_code: product.unique_code
        };
        
        cartItems.push(cartItem);
        toastService.success(`${product.name} added to cart!`);
      }
      
      // Save to localStorage
      localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
      
      // Emit cart updated event
      this.emitCartUpdated();
      
      return cartItems;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toastService.error('Failed to add item to cart');
      return this.getCartItems();
    }
  }

  // Remove item from cart
  removeFromCart(productId) {
    try {
      const cartItems = this.getCartItems();
      const updatedCart = cartItems.filter(item => item.id !== productId);
      localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
      
      // Emit cart updated event
      this.emitCartUpdated();
      
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toastService.error('Failed to remove item from cart');
      return this.getCartItems();
    }
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    try {
      const cartItems = this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item.id === productId);
      
      if (itemIndex > -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          return this.removeFromCart(productId);
        } else {
          cartItems[itemIndex].quantity = quantity;
          localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
          
          // Emit cart updated event
          this.emitCartUpdated();
          
          return cartItems;
        }
      }
      
      return cartItems;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toastService.error('Failed to update quantity');
      return this.getCartItems();
    }
  }

  // Clear entire cart
  clearCart() {
    try {
      localStorage.removeItem(this.cartKey);
      
      // Emit cart updated event
      this.emitCartUpdated();
      
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      toastService.error('Failed to clear cart');
      return this.getCartItems();
    }
  }

  // Get cart count
  getCartCount() {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getCartTotal() {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Check if item is in cart
  isInCart(productId) {
    const cartItems = this.getCartItems();
    return cartItems.some(item => item.id === productId);
  }

  // Get item quantity in cart
  getItemQuantity(productId) {
    const cartItems = this.getCartItems();
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  // Emit cart updated event
  emitCartUpdated() {
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: {
        cartItems: this.getCartItems(),
        cartCount: this.getCartCount(),
        cartTotal: this.getCartTotal()
      }
    }));
  }

  // Listen for cart updates
  onCartUpdated(callback) {
    window.addEventListener('cartUpdated', callback);
  }

  // Remove cart update listener
  offCartUpdated(callback) {
    window.removeEventListener('cartUpdated', callback);
  }
}

// Create and export singleton instance
const cartService = new CartService();
export default cartService;
