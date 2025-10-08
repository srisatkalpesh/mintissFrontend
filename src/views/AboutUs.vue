<template>
  <div class="modern-about-page">
    <!-- Hero Section -->
    <div class="about-hero">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">About Mintiss</h1>
            <p class="hero-subtitle">Where Every Purchase is a Rewarding Experience</p>
            <div class="hero-badge">
              <span>Loyalty that Pays Off</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="about-content">
      <div class="container">
        <!-- Introduction Section -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">Our Story</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <p class="lead-text">
      At <strong>Mintiss</strong>, we believe loyalty should be a two-way street. That's why we've built more than just a shopping platform – we've created a rewards ecosystem that gives back to our customers in real value, every single day.
    </p>
          </div>
        </section>

        <!-- What Makes Us Different -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">What Makes Us Different?</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="feature-content">
                <h3 class="feature-title">Growing Rewards</h3>
                <p class="feature-description">
                  Mintiss is home to a one-of-a-kind loyalty program where your rewards grow with time. Every purchase earns you <strong>Mintiss Points</strong>, and thanks to our unique redemption system, those points become more valuable the longer you hold onto them.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Our Promise -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">Our Promise</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <div class="promise-grid">
              <div class="promise-card">
                <div class="promise-icon">
                </div>
                <h3 class="promise-title">Fair and Transparent</h3>
                <p class="promise-description">
                  Our redemption formula is simple – the price of redemption multiplied by your points. No hidden terms. No confusing tiers.
                </p>
              </div>
              
              <div class="promise-card">
                <div class="promise-icon">
                  <i class="bi bi-arrow-up-circle"></i>
                </div>
                <h3 class="promise-title">Always Growing</h3>
                <p class="promise-description">
                  Your Mintiss Points never lose value. In fact, their worth grows every day.
                </p>
              </div>
              
              <div class="promise-card">
                <div class="promise-icon">
                  <i class="bi bi-heart"></i>
                </div>
                <h3 class="promise-title">Customer-First</h3>
                <p class="promise-description">
                  We're here to build trust and long-term relationships. Our loyalty program is designed to thank you for being a part of our journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Why We Exist -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">Why We Exist</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <div class="mission-card">
              <div class="mission-content">
                <h3 class="mission-title">Reinventing Loyalty</h3>
                <p class="mission-description">
      Mintiss was founded with a mission to reinvent loyalty. Traditional programs treat rewards as a cost. We see them as a shared asset – something we build together with our customers. Our goal is to create a smarter, fairer way to shop and save.
    </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Join the Movement -->
        <section class="content-section">
          <div class="section-header">
            <h2 class="section-title">Join the Movement</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <div class="cta-card">
              <div class="cta-content">
                <h3 class="cta-title">Be Part of Something Bigger</h3>
                <p class="cta-description">
      Thousands are already part of the Mintiss community – earning, growing, and redeeming smarter. Whether you're here to shop or to grow your Mintiss Points, you're always in good company.
    </p>
                <div class="cta-badge">
                  <i class="bi bi-people"></i>
                  <span>Join thousands of satisfied customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== MODERN ABOUT PAGE STYLES ===== */
.modern-about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%);
}

/* Hero Section */
.about-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-text {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 400;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  font-size: 1rem;
}

.hero-badge i {
  font-size: 1.2rem;
}

/* About Content */
.about-content {
  padding: 4rem 0;
}

.content-section {
  margin-bottom: 4rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  position: relative;
}

.section-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  margin: 0 auto;
  border-radius: 2px;
}

.section-content {
  max-width: 1000px;
  margin: 0 auto;
}

.lead-text {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #4a5568;
  text-align: center;
  font-weight: 400;
}

/* Feature Card */
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a5568;
}

/* Promise Grid */
.promise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.promise-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(17, 119, 191, 0.1);
}

.promise-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(17, 119, 191, 0.3);
}

.promise-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
}

.promise-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.promise-description {
  color: #4a5568;
  line-height: 1.6;
}

/* Mission Card */
.mission-card {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border-radius: 20px;
  padding: 3rem;
  color: white;
  text-align: center;
  box-shadow: 0 15px 35px rgba(17, 119, 191, 0.3);
}

.mission-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.mission-description {
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

/* CTA Card */
.cta-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(17, 119, 191, 0.1);
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.cta-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(17, 119, 191, 0.3);
}

.cta-badge i {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .promise-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .mission-card,
  .cta-card {
    padding: 2rem;
  }
  
  .mission-title,
  .cta-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .feature-card,
  .promise-card,
  .mission-card,
  .cta-card {
    padding: 1.5rem;
  }
  
  .about-content {
    padding: 2rem 0;
  }
  
  .content-section {
    margin-bottom: 2.5rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-section {
  animation: fadeInUp 0.6s ease-out;
}

.content-section:nth-child(1) { animation-delay: 0.1s; }
.content-section:nth-child(2) { animation-delay: 0.2s; }
.content-section:nth-child(3) { animation-delay: 0.3s; }
.content-section:nth-child(4) { animation-delay: 0.4s; }
.content-section:nth-child(5) { animation-delay: 0.5s; }

/* Accessibility */
.hero-badge:focus,
.cta-badge:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modern-about-page {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .section-title {
    color: #ecf0f1;
  }
  
  .lead-text,
  .feature-description,
  .promise-description,
  .cta-description {
    color: #bdc3c7;
  }
  
  .feature-card,
  .promise-card,
  .cta-card {
    background: #2c3e50;
    border-color: #34495e;
  }
  
  .feature-title,
  .promise-title,
  .cta-title {
    color: #ecf0f1;
  }
}
</style>