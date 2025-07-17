<template>
  <footer class="bg-light text-dark py-3 border-top shadow-sm">
    <div class="container">
      <div class="row gy-4 align-items-center justify-content-between">
        <!-- Quick Links - CENTER -->
        <div class="col-md-4 order-2 order-md-2 d-flex flex-column align-items-center">
          <h5 class="fw-semibold mb-3 text-center">Quick Links</h5>
          <ul class="list-unstyled text-center">
            <router-link to="/about-us" class="mx-2">About Us</router-link> |
            <router-link to="/contact-us" class="mx-2">Contact Us</router-link> |
            <router-link to="/terms" class="mx-2">Terms & Conditions</router-link> |
            <router-link to="/privacy" class="mx-2">Privacy Policy</router-link>
          </ul>
        </div>
        <!-- Support -->
        <div class="col-md-4 order-1 order-md-1 text-md-start text-center">
          <h5 class="fw-semibold mb-3">Support</h5>
          <p class="mb-2">
            <i class="bi bi-envelope-fill text-primary me-2"></i>
            <a href="mailto:support@mintiss.com" class="footer-link text-primary">support@mintiss.com</a>
          </p>

        </div>



        <!-- Copyright -->
        <div class="col-md-4 order-3 order-md-3 text-md-end text-center">
          <p class="mb-1">&copy; 2025 <strong>Mintiss</strong>. All rights reserved.</p>
          <p class="small text-muted">Crafted with 💙 by Axit Patel & team</p>
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
footer {
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(to right, #e0f7ff, #ffffff);
  transition: background 0.3s ease;
}

.footer-link {
  display: inline-block;
  color: #343a40;
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #0d6efd;
  text-decoration: underline;
}

@media (min-width: 768px) {
  footer .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  footer .col-md-4:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
