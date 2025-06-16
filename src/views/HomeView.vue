<template>
  <div class="mintiss-home">
    <!-- Hero Section -->
    <section class="welcome-section">
      <img class="mintiss-logo-img" :src="mintiss1" alt="Mintiss Welcome" />
      <h1 class="main-title">Welcome to Mintiss</h1>
      <p class="subtitle">Experience the future of Mintiss — rewards that grow every day, with every purchase.</p>
    </section>

    <!-- Mintiss Value Section -->
    <section class="mintiss-value-section">
      <div class="value-content">
        <div class="value-label">Current Mintiss Value</div>
        <div class="value-counter">
          ₹<span>{{ isLoading ? '0.00000000' : animatedValue }}</span>
        </div>
        <div class="user-balance mt-3">
          <div class="value-label">Your Mintiss Balance</div>
          <div class="value-counter">
            ₹<span>{{ userBalance || '0.00000000' }}</span>
          </div>
        </div>
        <div class="value-explanation">
          <i class="bi bi-graph-up-arrow"></i>
          Mintiss's value grows every day! The more you shop, the more valuable your rewards become. Join the movement and watch your Mintiss grow with us.
        </div>
        <div class="cta-buttons">
          <button class="mintiss-btn primary" @click="goToSignup">Get mintiss</button>
          <button class="mintiss-btn secondary" @click="goToSignup">Create account</button>
        </div>
      </div>
    </section>

    <!-- Gallery/Feature Section -->
    <section class="gallery-section">
      <div class="gallery-row">
        <div class="gallery-img-wrapper">
          <img :src="mintiss1" alt="Shopping Together" class="gallery-img" />
          <div class="gallery-caption">Shop together, earn together</div>
        </div>
        <div class="gallery-img-wrapper">
          <img :src="mintiss2" alt="Mintiss App" class="gallery-img" />
          <div class="gallery-caption">Share and connect with Mintiss</div>
        </div>
      </div>
      <div class="gallery-row">
        <div class="gallery-img-wrapper">
          <img :src="mintiss3" alt="Secure Payment" class="gallery-img" />
          <div class="gallery-caption">Shop securely, pay easily</div>
        </div>
        <div class="gallery-img-wrapper">
          <img :src="mintiss4" alt="Mintiss Conversation" class="gallery-img" />
          <div class="gallery-caption">All your rewards in one app</div>
        </div>
      </div>
    </section>

    <!-- How Mintiss Works Section -->
    <section class="how-works-section">
      <h2>How Mintiss Works</h2>
      <div class="how-steps">
        <div class="how-step">
          <div class="how-icon"><i class="bi bi-person-plus"></i></div>
          <h3>Sign Up</h3>
          <p>Create your free Mintiss account in seconds.</p>
        </div>
        <div class="how-step">
          <div class="how-icon"><i class="bi bi-bag"></i></div>
          <h3>Shop</h3>
          <p>Browse and buy from your favorite brands and stores.</p>
        </div>
        <div class="how-step">
          <div class="how-icon"><i class="bi bi-gift"></i></div>
          <h3>Earn Rewards</h3>
          <p>Get instant rewards and exclusive offers with every purchase.</p>
        </div>
        <div class="how-step">
          <div class="how-icon"><i class="bi bi-cash-stack"></i></div>
          <h3>Redeem</h3>
          <p>Use your rewards for discounts, gifts, or cash back.</p>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <h2>Why Choose Mintiss?</h2>
      <div class="benefits-grid">
        <div class="benefit">
          <div class="benefit-icon"><i class="bi bi-trophy"></i></div>
          <h4>Earn Rewards</h4>
          <p>Get rewarded for every purchase, every day.</p>
        </div>
        <div class="benefit">
          <div class="benefit-icon"><i class="bi bi-shield-lock"></i></div>
          <h4>Shop Securely</h4>
          <p>Your data and payments are always protected.</p>
        </div>
        <div class="benefit">
          <div class="benefit-icon"><i class="bi bi-arrow-repeat"></i></div>
          <h4>Easy Returns</h4>
          <p>Hassle-free returns and quick refunds.</p>
        </div>
        <div class="benefit">
          <div class="benefit-icon"><i class="bi bi-chat-dots"></i></div>
          <h4>24/7 Support</h4>
          <p>We're here for you, anytime you need help.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2>What Our Users Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial">
          <!-- <div class="avatar"><i class="bi bi-emoji-smile"></i></div> -->
          <p class="quote">"Mintiss makes shopping so much more rewarding! I love the instant cashback."</p>
          <div class="user">— Priya S.</div>
        </div>
        <div class="testimonial">
          <!-- <div class="avatar"><i class="bi bi-emoji-sunglasses"></i></div> -->
          <p class="quote">"The app is super easy to use and the support team is fantastic."</p>
          <div class="user">— Rahul M.</div>
        </div>
        <div class="testimonial">
          <!-- <div class="avatar"><i class="bi bi-emoji-heart-eyes"></i></div> -->
          <p class="quote">"I've saved so much with Mintiss rewards. Highly recommended!"</p>
          <div class="user">— Anjali K.</div>
        </div>
      </div>
    </section>

    <!-- Footer Call-to-Action -->
    <section class="footer-cta-section">
      <h2>Ready to start earning with Mintiss?</h2>
      <button class="mintiss-btn primary" @click="goToSignup">Join Now</button>
    </section>
  </div>
</template>

<script>
import mintiss1 from '@/assets/mintiss1.png';
import mintiss2 from '@/assets/mintiss2.png';
import mintiss3 from '@/assets/mintiss3.png';
import mintiss4 from '@/assets/mintiss4.png';
import axios from '@/axios';

export default {
  name: "HomeView",
  data() {
    return {
      mintiss1,
      mintiss2,
      mintiss3,
      mintiss4,
      animatedValue: 0,
      targetValue: 0,
      isLoading: true,
      userBalance: null
    };
  },
  async mounted() {
    await this.fetchMintissValue();
    this.calculateUserBalance();
  },
  methods: {
    async fetchMintissValue() {
      try {
        const response = await axios.get('/mintiss-value/latest');
        this.targetValue = parseFloat(response.data.data.value);
        this.animateValue();
      } catch (error) {
        console.error('Error fetching mintiss value:', error);
      } finally {
        this.isLoading = false;
      }
    },
    calculateUserBalance() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.mintiss) {
        this.userBalance = (parseFloat(user.mintiss) * this.targetValue).toFixed(8);
      }
    },
    animateValue() {
      let start = 0;
      const end = this.targetValue;
      const duration = 2000;
      const stepTime = 20;
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        this.animatedValue = (start + (end - start) * progress).toFixed(8);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedValue = end.toFixed(8);
          this.calculateUserBalance(); // Recalculate user balance after animation
        }
      };
      requestAnimationFrame(animate);
    },
    goToSignup() {
      this.$router.push('/signup');
    }
  }
};
</script>

<style scoped>
.mintiss-home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', Arial, sans-serif;
  background: #f8fbff;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  background:  #87ceeb ;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(135, 206, 235, 0.08);
  padding: 2.5rem 1rem 2rem 1rem;
}
.mintiss-logo-img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 24px rgba(135, 206, 235, 0.12);
  background: #fff;
}
.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 0.5rem;
}
.subtitle {
  font-size: 1.25rem;
  color: #1976d2;
  margin-bottom: 1.5rem;
}
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.mintiss-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(135, 206, 235, 0.10);
}
.mintiss-btn.primary {
  background:  #87ceeb ;
  color: #fff;
}
.mintiss-btn.secondary {
  background: #fff;
  color: #1976d2;
  border: 2px solid #87ceeb;
}
.mintiss-btn.primary:hover {
  background:  #87ceeb ;
  color: #fff;
}
.mintiss-btn.secondary:hover {
  background:  #87ceeb ;
  color: #1976d2;
}

.gallery-section {
  margin: 3rem 0;
}
.gallery-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.gallery-img-wrapper {
  position: relative;
  transition: transform 0.3s;
}
.gallery-img-wrapper:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 8px 32px rgba(135, 206, 235, 0.18);
}
.gallery-img {
  width: 320px;
  height: 220px;
  object-fit: cover;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(135, 206, 235, 0.10);
  background: #fff;
  transition: box-shadow 0.3s;
}
.gallery-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  background: rgba(135, 206, 235, 0.92);
  color: #fff;
  font-size: 1.05rem;
  padding: 0.5rem 1rem;
  border-radius: 0 0 1.5rem 1.5rem;
  text-align: center;
  opacity: 0.98;
}

.how-works-section {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem 1rem;
  margin: 3rem 0 2rem 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(135, 206, 235, 0.08);
}
.how-works-section h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 2rem;
}
.how-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.how-step {
  background: #e3f2fd;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(135, 206, 235, 0.06);
  padding: 1.5rem 1.25rem;
  max-width: 220px;
  flex: 1 1 180px;
  text-align: center;
}
.how-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #1976d2;
}

.benefits-section {
  margin: 3rem 0 2rem 0;
  text-align: center;
}
.benefits-section h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 2rem;
}
.benefits-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.benefit {
  background: #e3f2fd;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(135, 206, 235, 0.06);
  padding: 1.5rem 1.25rem;
  max-width: 220px;
  flex: 1 1 180px;
  text-align: center;
}
.benefit-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #1976d2;
}

.testimonials-section {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2rem 1rem;
  margin: 3rem 0 2rem 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(135, 206, 235, 0.08);
}
.testimonials-section h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 2rem;
}
.testimonials-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.testimonial {
  background: #e3f2fd;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(135, 206, 235, 0.06);
  padding: 1.5rem 1.25rem;
  max-width: 320px;
  flex: 1 1 220px;
  text-align: left;
  position: relative;
}
.avatar {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1976d2;
}
.quote {
  font-style: italic;
  color: #1976d2;
  margin-bottom: 0.5rem;
}
.user {
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
}

.footer-cta-section {
  text-align: center;
  margin: 3rem 0 1rem 0;
}
.footer-cta-section h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 1.5rem;
}

.mintiss-value-section {
    background:  #87ceeb ;
  border-radius: 1.5rem;
  margin: 2rem 0 3rem 0;
  padding: 2rem 1rem 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 2px 16px rgba(135, 206, 235, 0.10);
}
.value-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.value-label {
  font-size: 1.1rem;
  color: #1976d2;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.value-counter {
  font-size: 2rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
  transition: color 0.3s;
}
.value-explanation {
  font-size: 1.1rem;
  color: #1976d2;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
.value-explanation i {
  font-size: 1.5rem;
  color: #1976d2;
}

.user-balance {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

.mintiss-value-display {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  margin: 1rem auto;
  max-width: 400px;
}

.current-value, .user-balance {
  text-align: center;
}

.value-label {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.value-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

@media (max-width: 900px) {
  .gallery-row {
    flex-direction: column;
    align-items: center;
  }
  .gallery-img {
    width: 90vw;
    max-width: 350px;
    height: 180px;
  }
  .learn-cards, .how-steps, .benefits-grid, .testimonials-grid {
    flex-direction: column;
    align-items: center;
  }
}
</style>
