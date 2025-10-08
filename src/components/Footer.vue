<template>
  <footer class="modern-footer">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <div class="row g-4">
          <!-- Brand Section -->
          <div class="col-lg-4 col-md-6">
            <div class="footer-brand">
              <div class="brand-logo">
                <span class="logo-text">Mintiss</span>
        </div>
              <p class="brand-description">
                Your trusted marketplace for quality products with mintiss rewards. 
                Shop smart, earn rewards, and discover amazing deals.
              </p>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook">
                  <i class="bi bi-facebook"></i>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <i class="bi bi-twitter"></i>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <i class="bi bi-instagram"></i>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <i class="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section">
              <h5 class="footer-title">Quick Links</h5>
              <ul class="footer-links">
                <li><router-link to="/" class="footer-link">Home</router-link></li>
                <li><router-link to="/categories" class="footer-link">Categories</router-link></li>
                <li><router-link to="/about-us" class="footer-link">About Us</router-link></li>
                <li><router-link to="/contact-us" class="footer-link">Contact Us</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Customer Service -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section">
              <h5 class="footer-title">Customer Service</h5>
              <ul class="footer-links">
                <li><router-link to="/terms" class="footer-link">Terms & Conditions</router-link></li>
                <li><router-link to="/privacy" class="footer-link">Privacy Policy</router-link></li>
                <li><a href="#" class="footer-link">Help Center</a></li>
                <li><a href="#" class="footer-link">Shipping Info</a></li>
              </ul>
            </div>
          </div>

          <!-- Business -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section">
              <h5 class="footer-title">Business</h5>
              <ul class="footer-links">
                <li><router-link to="/seller/signup" class="footer-link">Become a Seller</router-link></li>
                <li><a href="#" class="footer-link">Seller Dashboard</a></li>
                <li><a href="#" class="footer-link">Partnership</a></li>
                <li><a href="#" class="footer-link">Careers</a></li>
              </ul>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section">
              <h5 class="footer-title">Contact</h5>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="bi bi-envelope-fill"></i>
                  <a href="mailto:srisatkalpesh@gmail.com" class="contact-link">srisatkalpesh@gmail.com</a>
                </div>
                <div class="contact-item">
                  <i class="bi bi-whatsapp"></i>
                  <a href="https://wa.me/919909347479" class="contact-link">+91 9909347479</a>
                </div>
                <div class="contact-item">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span class="contact-text">Mangal Murti Apartment, Katargam Surat, Gujarat 395004</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="copyright">
              &copy; 2025 <strong>Mintiss</strong>. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="credits">
              Crafted with <i class="bi bi-heart-fill text-danger"></i> by 
              <strong>Axit Patel</strong> & team
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
/* ===== MODERN FOOTER STYLES ===== */
.modern-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
  position: relative;
  overflow: hidden;
}

.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* Footer Main Content */
.footer-main {
  margin-bottom: 2rem;
}

/* Brand Section */
.footer-brand {
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.brand-logo .logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.brand-logo .logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.brand-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(17, 119, 191, 0.4);
}

/* Mobile-First Responsive Design */
/* Base styles are mobile-first */

/* Small mobile devices (320px and up) */
@media (min-width: 320px) {
  .modern-footer {
    padding: 2rem 0 1rem;
  }
  
  .footer-container {
    padding: 0 0.5rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-brand {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .footer-logo {
    font-size: 1.5rem;
  }
  
  .footer-logo-icon {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .footer-description {
    font-size: 0.85rem;
    margin: 1rem 0;
  }
  
  .social-links {
    justify-content: center;
    gap: 0.75rem;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .footer-section {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .footer-title {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .footer-links li {
    margin-bottom: 0.5rem;
  }
  
  .footer-link {
    font-size: 0.85rem;
    padding: 0.25rem 0;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding-top: 1.5rem;
  }
  
  .footer-copyright {
    font-size: 0.8rem;
  }
  
  .footer-legal {
    font-size: 0.8rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .footer-brand {
    text-align: left;
  }
  
  .footer-logo {
    font-size: 1.75rem;
  }
  
  .footer-logo-icon {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
  
  .footer-description {
    font-size: 0.9rem;
  }
  
  .social-links {
    justify-content: flex-start;
  }
  
  .social-link {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .footer-section {
    text-align: left;
  }
  
  .footer-title {
    font-size: 1.1rem;
  }
  
  .footer-link {
    font-size: 0.9rem;
  }
  
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-copyright {
    font-size: 0.85rem;
  }
  
  .footer-legal {
    font-size: 0.85rem;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-footer {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-container {
    padding: 0 1rem;
  }
  
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 2.5rem;
  }
  
  .footer-brand {
    margin-bottom: 0;
  }
  
  .footer-logo {
    font-size: 2rem;
  }
  
  .footer-logo-icon {
    width: 45px;
    height: 45px;
    font-size: 1.6rem;
  }
  
  .footer-description {
    font-size: 1rem;
    margin: 1.25rem 0;
  }
  
  .social-links {
    gap: 1rem;
  }
  
  .social-link {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .footer-section {
    margin-bottom: 0;
  }
  
  .footer-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .footer-links li {
    margin-bottom: 0.75rem;
  }
  
  .footer-link {
    font-size: 0.95rem;
  }
  
  .footer-bottom {
    padding-top: 2rem;
  }
  
  .footer-copyright {
    font-size: 0.9rem;
  }
  
  .footer-legal {
    font-size: 0.9rem;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-footer {
    padding: 4rem 0 2rem;
  }
  
  .footer-container {
    padding: 0 1rem;
  }
  
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }
  
  .footer-logo {
    font-size: 2.25rem;
  }
  
  .footer-logo-icon {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
  
  .footer-description {
    font-size: 1.1rem;
    margin: 1.5rem 0;
  }
  
  .social-links {
    gap: 1.25rem;
  }
  
  .social-link {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }
  
  .footer-title {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }
  
  .footer-links li {
    margin-bottom: 1rem;
  }
  
  .footer-link {
    font-size: 1rem;
  }
  
  .footer-bottom {
    padding-top: 2.5rem;
  }
  
  .footer-copyright {
    font-size: 1rem;
  }
  
  .footer-legal {
    font-size: 1rem;
  }
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-brand {
    order: 1;
    text-align: center;
  }
  
  .footer-section {
    order: 2;
    text-align: center;
  }
  
  .footer-section:nth-child(2) {
    order: 3;
  }
  
  .footer-section:nth-child(3) {
    order: 4;
  }
  
  .footer-section:nth-child(4) {
    order: 5;
  }
  
  .footer-bottom {
    order: 6;
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .footer-links li {
    margin-bottom: 0;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {
  .social-link,
  .footer-link {
    min-height: 44px;
    min-width: 44px;
  }
  
  .social-link:active,
  .footer-link:active {
    transform: scale(0.98);
  }
}

/* Footer Sections */
.footer-section {
  margin-bottom: 2rem;
}

.footer-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  border-radius: 1px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  padding-left: 0;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 1px;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: white;
  padding-left: 15px;
}

.footer-link:hover::before {
  width: 10px;
}

/* Contact Info */
.contact-info {
    display: flex;
    flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
    align-items: center;
  gap: 0.75rem;
  color: #bdc3c7;
  font-size: 0.9rem;
}

.contact-item i {
  color: #ff6b6b;
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

.contact-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: white;
}

.contact-text {
  color: #bdc3c7;
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  margin-top: 2rem;
}

.copyright {
  color: #bdc3c7;
  font-size: 0.9rem;
  margin: 0;
}

.copyright strong {
  color: white;
  font-weight: 600;
}

.credits {
  color: #bdc3c7;
  font-size: 0.9rem;
  margin: 0;
}

.credits strong {
  color: white;
  font-weight: 600;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .modern-footer {
    padding: 2rem 0 1rem;
  }
  
  .footer-main {
    margin-bottom: 1.5rem;
  }
  
  .footer-section {
    margin-bottom: 1.5rem;
  }
  
  .social-links {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .footer-bottom {
    text-align: center;
  }
  
  .footer-bottom .col-md-6:last-child {
    text-align: center !important;
    margin-top: 1rem;
  }
}

@media (max-width: 576px) {
  .brand-logo {
    justify-content: center;
    text-align: center;
  }
  
  .brand-description {
    text-align: center;
  }
  
  .footer-title {
    text-align: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links {
    text-align: center;
  }
  
  .contact-info {
    align-items: center;
  }
}

/* ===== ANIMATIONS ===== */
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

.footer-section {
  animation: fadeInUp 0.6s ease-out;
}

.footer-section:nth-child(1) { animation-delay: 0.1s; }
.footer-section:nth-child(2) { animation-delay: 0.2s; }
.footer-section:nth-child(3) { animation-delay: 0.3s; }
.footer-section:nth-child(4) { animation-delay: 0.4s; }
.footer-section:nth-child(5) { animation-delay: 0.5s; }

/* ===== HOVER EFFECTS ===== */
.footer-link {
  position: relative;
  overflow: hidden;
}

.footer-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.footer-link:hover::after {
  left: 100%;
}

/* ===== ACCESSIBILITY ===== */
.footer-link:focus,
.social-link:focus,
.contact-link:focus {
  outline: 2px solid rgba(255, 107, 107, 0.5);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .modern-footer {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
}
</style>
