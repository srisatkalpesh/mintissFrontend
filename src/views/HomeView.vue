<template>
  <div class="mintiss-home">
    <!-- Hero Section -->
    <section class="welcome-section">
      <div class="welcome-content">
        <h1 class="main-title">Welcome to Mintiss</h1>
        <p class="subtitle">Experience the future of Mintiss — rewards that grow every day, with every purchase.</p>
      </div>
    </section>

    <!-- Mintiss Value Section -->
    <section class="mintiss-value-section">
      <div class="value-content">
        <div class="value-label">Current Mintiss Value</div>
        <div class="value-counter">
          ₹<span>{{ isLoading ? '0.00000000' : animatedValue }}</span>
        </div>
        <div class="value-explanation">
          <i class="bi bi-graph-up-arrow"></i>
          Mintiss's value grows every day! The more you shop, the more valuable your rewards become. Join the movement
          and watch your Mintiss grow with us.
        </div>
        <!-- Area Chart for Mintiss Value History -->
        <div v-if="!isChartLoading" class="mintiss-area-chart">
          <apexchart type="area" height="320"  :options="chartOptions" :series="chartSeries" />
        </div>
        <div v-else class="text-white text-center py-3">Loading chart...</div>
        <div class="cta-buttons">
          <button class="mintiss-btn primary" @click="goToSignup">Get mintiss</button>
          <button v-if="!isLoggedIn" class="mintiss-btn secondary" @click="goToSignup">Create account</button>
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
          <div class="benefit-icon"><i class="bi bi-chat-dots"></i></div>
          <h4>24/7 Support</h4>
          <p>We're here for you, anytime you need help.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <!--
    <section class="testimonials-section">
      <h2>What Our Users Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial">
          <p class="quote">"Mintiss makes shopping so much more rewarding! I love the instant cashback."</p>
          <div class="user">— Priya S.</div>
        </div>
        <div class="testimonial">
          <p class="quote">"The app is super easy to use and the support team is fantastic."</p>
          <div class="user">— Rahul M.</div>
        </div>
        <div class="testimonial">
          <p class="quote">"I've saved so much with Mintiss rewards. Highly recommended!"</p>
          <div class="user">— Anjali K.</div>
        </div>
      </div>
    </section>
    -->

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
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "HomeView",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      mintiss1,
      mintiss2,
      mintiss3,
      mintiss4,
      animatedValue: 0,
      targetValue: 0,
      isLoading: true,
      userBalance: null,
      isLoggedIn: false,
      // Chart data
      chartSeries: [{ name: 'Mintiss Value', data: [] }],
      chartOptions: {
        chart: {
          type: 'area',
          toolbar: { show: false },
          zoom: { enabled: false },
          background: 'transparent',
          width: '100%',
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
          type: 'category',
          labels: { rotate: -45, style: { colors: '#fff', fontSize: '14px', fontWeight: 600 } },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tooltip: { enabled: true },
        },
        yaxis: {
          labels: { style: { colors: '#fff', fontSize: '14px', fontWeight: 600 } },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        grid: { borderColor: 'rgba(255,255,255,0.15)', strokeDashArray: 4 },
        tooltip: { x: { format: 'dd-MM-yyyy' } },
        colors: ['#ffd700'],
        background: 'transparent',
      },
      isChartLoading: true,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refreshData();
    });
  },
  mounted() {
    // Check if this is a fresh page load
    if (!sessionStorage.getItem('pageRefreshed')) {
      sessionStorage.setItem('pageRefreshed', 'true');
      window.location.reload();
    }
    this.fetchMintissChartData();
  },
  activated() {
    // This will be called every time the component is re-visited
    this.fetchMintissValue();
    this.calculateUserBalance();
  },
  methods: {
    checkLoginStatus() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.isLoggedIn = !!user;
    },
    async refreshData() {
      this.isLoading = true;
      await this.fetchMintissValue();
      this.calculateUserBalance();
      this.checkLoginStatus();
      this.isLoading = false;
    },
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
    },
    async fetchMintissChartData() {
      this.isChartLoading = true;
      try {
        const response = await axios.get('/mintiss-values');
        // Group by date and get the last value for each date
        const grouped = {};
        response.data.forEach(item => {
          grouped[item.date] = item.value;
        });
        const chartData = Object.entries(grouped).map(([date, value]) => ({ x: date, y: value }));
        this.chartSeries = [{ name: 'Mintiss Value', data: chartData }];
      } catch (error) {
        console.error('Error fetching mintiss values for chart:', error);
      } finally {
        this.isChartLoading = false;
      }
    },
  }
};
</script>

<style scoped>
.mintiss-home {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', Arial, sans-serif;
  background: #f8fbff;
}

.welcome-section {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 3rem;
  background: #1177bf;
  box-shadow: 0 4px 24px rgba(135, 206, 235, 0.15);
  padding: 6rem 2rem;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 2rem 2rem;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/hero-bg.png');
  background-size: cover;
  background-position: center;
  z-index: 1;
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.welcome-section:hover::before {
  transform: scale(1);
}

.welcome-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem;
  border-radius: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.welcome-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.main-title {
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  overflow-x: auto;
}

.mintiss-btn {
  min-width: 0;
  max-width: 100%;
  padding: 0.3rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(135, 206, 235, 0.10);
  border: none;
}

.mintiss-btn.primary {
  background: #fff;
  color: #1177bf;
  border: 2px solid #fff;
}

.mintiss-btn.secondary {
  background: #fff;
  color: #1177bf;
  border: 2px solid #fff;
}

.mintiss-btn.primary:hover {
  background: #1177bf;
  color: #fff;
}

.mintiss-btn.secondary:hover {
  background: #1177bf;
  color: #fff;
}

.gallery-section {
  margin: 3rem 0;
  width: 100%;
  padding: 0 1rem;
}

.gallery-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.gallery-img-wrapper {
  position: relative;
  transition: transform 0.3s;
  width: 45%;
  max-width: 500px;
  aspect-ratio: 16/9;
}

.gallery-img-wrapper:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 8px 32px rgba(135, 206, 235, 0.18);
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 2px 16px rgba(135, 206, 235, 0.10);
  background: #fff;
  border-radius: 1rem;
}

.gallery-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  background: rgba(135, 206, 235, 0.92);
  color: #fff;
  font-size: 1.05rem;
  padding: 0.75rem 1rem;
  text-align: center;
  opacity: 0.98;
  border-radius: 0 0 1rem 1rem;
}

.how-works-section {
  padding: 3rem 1rem;
  margin: 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(17, 119, 191, 0.2);
  width: 100%;
}

.how-works-section h2 {
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 2rem;
  font-weight: 700;
}

.how-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.how-step {
  background: #1177bf;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 250px;
  text-align: center;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.how-step:hover {
  transform: translateY(-5px);
  background: #1177bf;
}

.how-step h3 {
  color: #fff;
  margin: 1rem 0;
  font-size: 1.5rem;
}

.how-step p {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
}

.how-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.benefits-section {
  padding: 3rem 1rem;
  margin: 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(17, 119, 191, 0.2);
  width: 100%;
}

.benefits-section h2 {
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 2rem;
  font-weight: 700;
}

.benefits-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit {
  background: #1177bf;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 250px;
  text-align: center;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.benefit:hover {
  transform: translateY(-5px);
  background: #1177bf;
}

.benefit h4 {
  color: #fff;
  margin: 1rem 0;
  font-size: 1.5rem;
}

.benefit p {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
}

.benefit-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.testimonials-section {
  padding: 3rem 1rem;
  margin: 0;
  text-align: center;
  box-shadow: 0 2px 12px rgba(17, 119, 191, 0.2);
  width: 100%;
}

.testimonials-section h2 {
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 2rem;
  font-weight: 700;
}

.testimonials-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial {
  background: #1177bf;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 350px;
  text-align: left;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.testimonial:hover {
  transform: translateY(-5px);
  background: #1177bf;
}

.quote {
  font-style: italic;
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  line-height: 1.6;
}

.user {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

.footer-cta-section {
  padding: 3rem 1rem;
  text-align: center;
  margin: 0;
  box-shadow: 0 2px 16px rgba(17, 119, 191, 0.2);
  width: 100%;
}

.footer-cta-section h2 {
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 2rem;
}

.mintiss-value-section {
  background: #1177bf;
  margin: 2rem 0;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 16px rgba(135, 206, 235, 0.10);
  width: 100%;
}

.value-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value-label {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.value-counter {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
  transition: color 0.3s;
}

.value-explanation {
  font-size: 1.1rem;
  color: #fff;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.value-explanation i {
  font-size: 1.5rem;
  color: #fff;
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
  margin: 1rem auto;
  max-width: 400px;
}

.current-value,
.user-balance {
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

.mintiss-area-chart {
  background: transparent;
  border-radius: 0.5rem;
  margin: 1.5rem 0 0.5rem 0;
  padding: 0;
  width: 100%;
  min-width: 0;
  display: block;
  box-shadow: none;
}

@media (max-width: 900px) {
  .gallery-row {
    flex-direction: column;
    align-items: center;
  }

  .gallery-img-wrapper {
    width: 100%;
    max-width: 600px;
  }

  .how-steps,
  .benefits-grid,
  .testimonials-grid {
    flex-direction: column;
    align-items: center;
  }

  .how-step,
  .benefit,
  .testimonial {
    width: 90%;
    max-width: 400px;
  }

  .mintiss-area-chart {
    max-width: 100vw;
    padding: 0;
  }
}

@media (max-width: 600px) {
  .mintiss-area-chart {
    max-width: 100vw;
    padding: 0;
    border-radius: 0.3rem;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 4rem 1rem;
  }

  .welcome-content {
    padding: 2rem;
  }

  .main-title {
    font-size: 1rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  footer .row {
    text-align: center;
    justify-content: center !important;
  }
  footer .col-md-4 {
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>
