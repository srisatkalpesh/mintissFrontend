<template>
  <div class="modern-contact-page">
    <div class="contact-container">
      <!-- Contact Header -->
      <div class="contact-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="bi bi-headset"></i>
          </div>
          <div class="header-text">
            <h1 class="contact-title">Contact Us</h1>
            <p class="contact-subtitle">We're here to help! Get in touch with our team for any questions or support.</p>
          </div>
        </div>
      </div>

      <!-- Contact Content -->
      <div class="contact-content">
        <div class="contact-grid">
          <!-- Email Section -->
          <div class="contact-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="bi bi-envelope-fill"></i>
              </div>
              <h3 class="card-title">Email Us</h3>
            </div>
            <div class="card-body">
              <div class="contact-item">
                <div class="item-label">General Inquiries & Support</div>
                <a href="mailto:srisatkalpesh@gmail.com" class="item-value">srisatkalpesh@gmail.com</a>
              </div>
              <div class="contact-item">
                <div class="item-label">Business & Partnership</div>
                <a href="mailto:maagsar@gmail.com" class="item-value">maagsar@gmail.com</a>
              </div>
            </div>
          </div>

          <!-- WhatsApp Section -->
          <div class="contact-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="bi bi-whatsapp"></i>
              </div>
              <h3 class="card-title">WhatsApp Support</h3>
            </div>
            <div class="card-body">
              <div class="contact-item">
                <div class="item-label">Quick Help Available</div>
                <a href="https://wa.me/919909347479" target="_blank" class="item-value whatsapp">+91 9909347479</a>
                <div class="availability">Available Monday-Friday, 10 AM - 6 PM IST</div>
              </div>
            </div>
          </div>

          <!-- Office Section -->
          <div class="contact-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="bi bi-geo-alt-fill"></i>
              </div>
              <h3 class="card-title">Our Office</h3>
            </div>
            <div class="card-body">
              <div class="contact-item">
                <div class="item-label">Mintiss HQ</div>
                <div class="item-value">
                  Mangal Murti Apartment, Katargam Surat<br>
                  Surat - 395004 Gujarat<br>
                  <small>Visits by appointment only</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Support Hours -->
          <div class="contact-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="bi bi-clock-fill"></i>
              </div>
              <h3 class="card-title">Support Hours</h3>
            </div>
            <div class="card-body">
              <div class="contact-item">
                <div class="item-label">Monday - Friday</div>
                <div class="item-value">10 AM - 6 PM IST</div>
              </div>
              <div class="contact-item">
                <div class="item-label">Saturday & Sunday</div>
                <div class="item-value">Closed</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media Section -->
        <div class="social-section">
          <h3 class="social-title">Stay Connected</h3>
          <p class="social-subtitle">Follow us for the latest updates, rewards tips, and more</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="bi bi-facebook"></i>
              <span>Facebook</span>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="bi bi-instagram"></i>
              <span>Instagram</span>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="bi bi-linkedin"></i>
              <span>LinkedIn</span>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="bi bi-twitter"></i>
              <span>Twitter</span>
            </a>
          </div>
        </div>

        <!-- Feedback Section -->
        <div class="feedback-section">
          <div class="feedback-card">
            <div class="feedback-icon">
              <i class="bi bi-chat-heart"></i>
            </div>
            <div class="feedback-content">
              <h4 class="feedback-title">Have feedback or suggestions?</h4>
              <p class="feedback-message">We'd love to hear from you. Thank you for being a part of the Mintiss community!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== MODERN CONTACT PAGE STYLES ===== */
.modern-contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 2rem 0;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Contact Header */
.contact-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px rgba(17, 119, 191, 0.3);
  color: white;
  text-align: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  backdrop-filter: blur(10px);
}

.header-text {
  max-width: 600px;
}

.contact-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.contact-subtitle {
  font-size: 1.2rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* Contact Content */
.contact-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Contact Cards */
.contact-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.1);
  border: 1px solid rgba(17, 119, 191, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.card-body {
  padding: 1.5rem;
}

.contact-item {
  margin-bottom: 1rem;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-value {
  color: #1177bf;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: block;
  transition: color 0.3s ease;
}

.item-value:hover {
  color: #0d5a9a;
}

.item-value.whatsapp {
  color: #25d366;
}

.availability {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

/* Social Section */
.social-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.1);
  border: 1px solid rgba(17, 119, 191, 0.1);
  text-align: center;
}

.social-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1177bf;
  margin: 0 0 0.5rem 0;
}

.social-subtitle {
  color: #6c757d;
  margin: 0 0 2rem 0;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid rgba(17, 119, 191, 0.1);
  border-radius: 12px;
  color: #1177bf;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(17, 119, 191, 0.3);
}

.social-link i {
  font-size: 1.2rem;
}

/* Feedback Section */
.feedback-section {
  display: flex;
  justify-content: center;
}

.feedback-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid rgba(17, 119, 191, 0.2);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(17, 119, 191, 0.1);
}

.feedback-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.feedback-content {
  flex: 1;
}

.feedback-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1177bf;
  margin: 0 0 0.5rem 0;
}

.feedback-message {
  color: #1976d2;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-header {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .contact-title {
    font-size: 2rem;
  }

  .contact-subtitle {
    font-size: 1rem;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .social-links {
    flex-direction: column;
    align-items: center;
  }

  .social-link {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .feedback-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .feedback-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .modern-contact-page {
    padding: 1rem 0;
  }

  .contact-container {
    padding: 0 0.5rem;
  }

  .contact-header {
    padding: 1.5rem 1rem;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .contact-title {
    font-size: 1.75rem;
  }

  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .social-section {
    padding: 1.5rem;
  }
}
</style>

<script>
export default {
  name: 'ContactUs',
  mounted() {
    // Add any initialization logic here if needed
    document.title = 'Contact Us - Mintiss';
  }
}
</script>