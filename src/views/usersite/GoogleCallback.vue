<template>
  <div class="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h4 class="text-muted">Processing Google authentication...</h4>
      <p class="text-muted small">Please wait while we complete your login.</p>
    </div>
  </div>
</template>

<script>
import googleAuthService from '@/services/googleAuthService';

export default {
  name: "GoogleCallback",
  async mounted() {
    try {
      console.log("GoogleCallback mounted");
      await googleAuthService.handleRedirectCallback();
    } catch (error) {
      console.error('Google callback error:', error);
      // Redirect to login with error
      this.$router.push({
        path: '/login',
        query: { error: 'Google authentication failed. Please try again.' }
      });
    }
  }
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style> 