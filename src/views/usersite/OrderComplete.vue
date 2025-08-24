<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-lg border-0 text-center">
          <div class="card-body p-5">
            <!-- Success Icon -->
            <div class="success-icon mb-4">
              <div class="checkmark-circle">
                <div class="checkmark draw"></div>
              </div>
            </div>
            
            <!-- Order Success Message -->
            <h2 class="text-success fw-bold mb-3">Order Placed Successfully!</h2>
            <p class="text-muted mb-4">Your order has been confirmed and is being processed.</p>
            
            <!-- Order Details -->
            <div class="order-details mb-4">
              <div class="row text-start">
                <div class="col-6">
                  <span class="text-muted">Order ID:</span>
                </div>
                <div class="col-6">
                  <span class="fw-bold">{{ orderId }}</span>
                </div>
              </div>
              <div class="row text-start">
                <div class="col-6">
                  <span class="text-muted">Order Date:</span>
                </div>
                <div class="col-6">
                  <span class="fw-bold">{{ orderDate }}</span>
                </div>
              </div>
              <div class="row text-start">
                <div class="col-6">
                  <span class="text-muted">Total Amount:</span>
                </div>
                <div class="col-6">
                  <span class="fw-bold text-success">₹{{ totalAmount }}</span>
                </div>
              </div>
            </div>
            
            <!-- WhatsApp Notification Info -->
            <div class="whatsapp-info mb-4 p-3" style="background-color: #f8f9fa; border-radius: 10px;">
              <div class="d-flex align-items-center mb-2">
                <i class="fab fa-whatsapp text-success me-2" style="font-size: 1.2rem;"></i>
                <span class="fw-bold">WhatsApp Updates</span>
              </div>
              <p class="text-muted mb-0 small">
                You will receive order updates and tracking information on WhatsApp at 
                <span class="fw-bold">{{ phoneNumber }}</span>
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div class="d-grid gap-2">
              <button 
                @click="goToHome" 
                class="btn btn-primary btn-lg fw-bold"
                style="background-color: #1177bf; border-color: #1177bf;"
              >
                <i class="fas fa-home me-2"></i>
                Continue Shopping
              </button>
              <button 
                @click="viewOrders" 
                class="btn btn-outline-secondary"
              >
                <i class="fas fa-list me-2"></i>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderComplete',
  data() {
    return {
      orderId: '',
      orderDate: '',
      totalAmount: 0,
      phoneNumber: ''
    };
  },
  mounted() {
    // Get order details from route params or localStorage
    this.getOrderDetails();
  },
  methods: {
    getOrderDetails() {
      // Try to get from route params first
      if (this.$route.params.orderId) {
        this.orderId = this.$route.params.orderId;
      } else {
        // Fallback to localStorage or generate a random order ID
        this.orderId = 'ORD' + Date.now().toString().slice(-8);
      }
      
      // Set current date
      this.orderDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Get total amount from localStorage or route
      if (this.$route.params.totalAmount) {
        this.totalAmount = parseFloat(this.$route.params.totalAmount);
      } else {
        this.totalAmount = 0;
      }
      
      // Get phone number from user data
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.phone) {
        this.phoneNumber = user.phone;
      } else {
        this.phoneNumber = 'your registered number';
      }
    },
    goToHome() {
      this.$router.push('/');
    },
    viewOrders() {
      // Navigate to orders page if it exists, otherwise go to profile
      this.$router.push('/profile');
    }
  }
};
</script>

<style scoped>
.success-icon {
  display: flex;
  justify-content: center;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #28a745;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #28a745;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  position: relative;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 8% auto;
  box-shadow: inset 0px 0px 0px #28a745;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark.draw:after {
  content: '';
  animation: draw .6s ease-in-out .8s forwards;
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #28a745;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes draw {
  0% {
    stroke-dasharray: 0, 100;
  }
  100% {
    stroke-dasharray: 100, 0;
  }
}

.order-details {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.order-details .row {
  margin-bottom: 0.5rem;
}

.order-details .row:last-child {
  margin-bottom: 0;
}

.whatsapp-info {
  border-left: 4px solid #25d366;
}

.card {
  border-radius: 1rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
}
</style>
