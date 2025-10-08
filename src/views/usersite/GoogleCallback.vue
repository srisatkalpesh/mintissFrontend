<template>
  <div class="modern-callback-page">
    <div class="callback-container">
      <div class="callback-card">
        <!-- Header -->
        <div class="callback-header">
          <div class="logo-section">
            <h1 class="logo-text">Mintiss</h1>
          </div>
          <h2 class="callback-title">Authenticating with Google</h2>
          <p class="callback-subtitle">Please wait while we complete your secure login</p>
        </div>

        <!-- Loading Section -->
        <div class="callback-content">
          <div class="loading-container">
            <div class="modern-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <div class="loading-message">
              <h3 class="loading-title">Processing Authentication</h3>
              <p class="loading-subtitle">We're securely connecting your Google account</p>
            </div>
          </div>

          <!-- Progress Steps -->
          <div class="progress-steps">
            <div class="step completed">
              <div class="step-icon">
                <i class="bi bi-check"></i>
              </div>
              <div class="step-content">
                <h4 class="step-title">Redirected from Google</h4>
                <p class="step-description">Successfully received authorization code</p>
              </div>
            </div>
            
            <div class="step active">
              <div class="step-icon">
                <div class="step-spinner"></div>
              </div>
              <div class="step-content">
                <h4 class="step-title">Verifying Credentials</h4>
                <p class="step-description">Validating your Google account information</p>
              </div>
            </div>
            
            <div class="step pending">
              <div class="step-icon">
                <i class="bi bi-person-check"></i>
              </div>
              <div class="step-content">
                <h4 class="step-title">Completing Login</h4>
                <p class="step-description">Setting up your Mintiss account</p>
              </div>
            </div>
          </div>

          <!-- Security Notice -->
          <div class="security-notice">
            <div class="notice-content">
              <h4 class="notice-title">Secure Authentication</h4>
              <p class="notice-text">Your data is protected with industry-standard encryption</p>
            </div>
          </div>
        </div>
      </div>
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
/* ===== MODERN CALLBACK PAGE STYLES ===== */
.modern-callback-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.callback-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.callback-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.callback-header {
  text-align: center;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  position: relative;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.callback-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.callback-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.95rem;
}

/* Content */
.callback-content {
  padding: 2rem;
}

.loading-container {
  text-align: center;
  margin-bottom: 2rem;
}

.modern-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  width: 80px;
  height: 80px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #1177bf;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #1177bf;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.loading-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.loading-subtitle {
  color: #6c757d;
  margin: 0;
  font-size: 0.95rem;
}

/* Progress Steps */
.progress-steps {
  margin-bottom: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.step:last-child {
  border-bottom: none;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.step.completed .step-icon {
  background: #10b981;
  color: white;
}

.step.active .step-icon {
  background: #1177bf;
  color: white;
  position: relative;
}

.step.pending .step-icon {
  background: #f3f4f6;
  color: #9ca3af;
}

.step-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.step-description {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.step.completed .step-title {
  color: #10b981;
}

.step.active .step-title {
  color: #1177bf;
}

.step.pending .step-title {
  color: #9ca3af;
}

/* Security Notice */
.security-notice {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notice-icon {
  width: 48px;
  height: 48px;
  background: #1177bf;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.notice-text {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .callback-container {
    max-width: 100%;
  }
  
  .callback-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .callback-content {
    padding: 1.5rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .callback-title {
    font-size: 1.3rem;
  }
  
  .modern-spinner {
    width: 60px;
    height: 60px;
  }
  
  .spinner-ring {
    width: 60px;
    height: 60px;
  }
  
  .security-notice {
    flex-direction: column;
    text-align: center;
  }
}
</style> 