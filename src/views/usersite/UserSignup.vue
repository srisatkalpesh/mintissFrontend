<template>
  <div class="modern-signup-page" :class="{ 'dashboard-mode': dashboardMode, 'ultra-compact': ultraCompact, 'micro-mode': microMode }">
    <div class="signup-container">

      <!-- Signup Card -->
      <div class="signup-card">
      <!-- Header -->
        <div class="signup-header">
          <div class="logo-section">
            <h1 class="logo-text">Mintiss</h1>
          </div>
          <h2 class="welcome-title">Join Mintiss!</h2>
          <p class="welcome-subtitle">Create your account and start earning rewards</p>
      </div>

        <!-- Form Section -->
        <div class="signup-form-section">
          <form @submit.prevent="handleSignup" class="signup-form">
            <!-- Name Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-person-fill"></i>
                Full Name
              </label>
              <input 
                type="text" 
                v-model="name" 
                class="modern-input" 
                placeholder="Enter your full name" 
                required 
              />
              <div v-if="errors.name" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.name[0] }}
              </div>
          </div>

            <!-- Email Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-envelope-fill"></i>
                Email Address
              </label>
              <input 
                type="email" 
                v-model="email" 
                class="modern-input" 
                placeholder="Enter your email address" 
                required 
              />
              <div v-if="errors.email" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.email[0] }}
              </div>
          </div>

            <!-- Phone Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-telephone-fill"></i>
                Phone Number
              </label>
            <vue-tel-input
                v-model="phone"
                :inputOptions="{
                    placeholder: 'Enter your phone number',
                    required: true
                }"
                :dropdownOptions="{
                    showDialCodeInSelection: true,
                    showDialCodeInList: true
                }"
                :enabledCountryCode="true"
                :enabledFlags="true"
                :preferredCountries="['US', 'GB', 'IN', 'CA', 'AU']"
                :validCharactersOnly="true"
                @input="onPhoneInput"
                class="modern-phone-input"
              />
              <div v-if="errors.phone" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.phone[0] }}
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock-fill"></i>
                Password
              </label>
              <div class="password-input-container">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  class="modern-input" 
                  placeholder="Create a strong password"
                  required 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                  :class="{ active: showPassword }"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.password" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.password[0] }}
              </div>
          </div>

            <!-- Confirm Password Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock-fill"></i>
                Confirm Password
              </label>
              <div class="password-input-container">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="confirmPassword" 
                  class="modern-input" 
                  placeholder="Confirm your password"
                  required 
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                  :class="{ active: showConfirmPassword }"
                >
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.confirmPassword[0] }}
              </div>
          </div>

            <!-- Terms and Conditions -->
            <div class="form-group">
              <label class="terms-checkbox">
                <input type="checkbox" v-model="agreeTerms" required>
                <span class="checkmark"></span>
                I agree to the <a href="/terms" target="_blank" class="terms-link">Terms & Conditions</a> and <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>
              </label>
          </div>

            <!-- Signup Button -->
            <button type="submit" class="signup-btn" :disabled="loading || !agreeTerms">
              <span v-if="loading" class="spinner"></span>
              <i v-else class="bi bi-person-plus"></i>
              {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Divider -->
          <div class="divider">
            <span class="divider-text">or continue with</span>
        </div>

          <!-- Google Signup -->
          <button @click="handleGoogleSignup" class="google-btn" :disabled="googleLoading">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="google-icon">
            <span v-if="googleLoading" class="spinner"></span>
            {{ googleLoading ? 'Connecting...' : 'Sign up with Google' }}
        </button>

          <!-- Error Message -->
          <div v-if="errors.general" class="error-alert">
            <i class="bi bi-exclamation-triangle"></i>
            {{ errors.general }}
          </div>

          <!-- Login Link -->
          <div class="login-link">
            <p>Already have an account? 
              <router-link to="/login" class="login-text">Sign in here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import googleAuthService from '@/services/googleAuthService';

export default {
  name: "UserSignup",
  props: {
    dashboardMode: {
      type: Boolean,
      default: false
    },
    ultraCompact: {
      type: Boolean,
      default: false
    },
    microMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      errors: {},
      loading: false,
      googleLoading: false,
      referralCode: '',
      showPassword: false,
      showConfirmPassword: false,
      agreeTerms: false
    };
  },
  mounted() {
    // Get referral code from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    this.referralCode = urlParams.get('ref') || '';
    console.log('Referral code from URL:', this.referralCode);
  },
  watch: {
    phone: {
      handler(newValue) {
        // Ensure phone number is always cleaned of spaces
        if (newValue && newValue !== newValue.replace(/\s/g, '')) {
          this.phone = newValue.replace(/\s/g, '');
        }
      },
      immediate: true
    }
  },
  methods: {
    onPhoneInput(formattedNumber, phoneObject) {
      if (phoneObject) {
        // Remove all spaces from the phone number
        this.phone = phoneObject.number.replace(/\s/g, '');
      }
    },
    async handleSignup() {
      this.errors = {};
      
      // Validate password confirmation
      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = ['Passwords do not match'];
        return;
      }

      this.loading = true;
      try {
        // Clean phone number by removing all spaces
        const cleanPhone = this.phone.replace(/\s/g, '');
        
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        const signupData = {
          name: this.name,
          email: this.email,
          phone: cleanPhone,
          password: this.password,
          password_confirmation: this.confirmPassword
        };

        // Add referral code if present
        if (this.referralCode) {
          signupData.referral_code = this.referralCode;
        }

        const response = await axios.post(`${baseURL}/signup`, signupData);

        const { user, token } = response.data;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        console.log("Signup successful:", user);

        // Redirect based on user type
        if (user.role === 'admin' || user.type === 'admin' || user.role === 'Admin' || user.type === 'Admin') {
            this.$router.push('/admin');
        } else if (user.role === 'Seller' || user.type === 'Seller' || user.role === 'seller' || user.type === 'seller') {
            this.$router.push('/seller/dashboard');
        } else {
            // Redirect to dashboard or other protected route after signup
            window.location.href = '/';
        }

      } catch (error) {
        if (error.response && error.response.data) {
          const responseErrors = error.response.data.errors || {};
          this.errors = { ...responseErrors };

          if (error.response.data.message && !Object.keys(responseErrors).length) {
            this.errors.general = error.response.data.message;
          }
        } else {
          this.errors.general = 'Signup failed. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },

    async handleGoogleSignup() {
      this.errors = {};
      this.googleLoading = true;
      
      try {
        // Set up error handler
        window.googleAuthError = (error) => {
          this.googleLoading = false;
          this.errors.general = 'Google signup failed. Please try again.';
          console.error('Google auth error:', error);
        };

        // Use redirect flow for better compatibility
        googleAuthService.redirectToGoogle();
        
      } catch (error) {
        this.googleLoading = false;
        this.errors.general = 'Google signup failed. Please try again.';
        console.error('Google signup error:', error);
      }
    }
  }
};
</script>

<style scoped>
/* ===== MODERN SIGNUP PAGE STYLES ===== */
.modern-signup-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.signup-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 2;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Signup Card */
.signup-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}


/* Header */
.signup-header {
  text-align: center;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  position: relative;
}

.signup-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
  backdrop-filter: blur(10px);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.95rem;
}

/* Form Section */
.signup-form-section {
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.signup-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.form-label i {
  color: #1177bf;
  font-size: 0.9rem;
}

.modern-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e8eaed;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
}

.modern-input:focus {
  outline: none;
  border-color: #1177bf;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.modern-phone-input {
  width: 100%;
}

.modern-phone-input :deep(.vti__input) {
  padding: 1rem;
  border: 2px solid #e8eaed;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
}

.modern-phone-input :deep(.vti__input):focus {
  outline: none;
  border-color: #1177bf;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.modern-phone-input :deep(.vti__dropdown) {
  border: 2px solid #e8eaed;
  border-radius: 12px;
  background: white;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  background: rgba(17, 119, 191, 0.1);
  color: #667eea;
}

.password-toggle.active {
  color: #667eea;
}

.modern-phone-input {
  width: 100%;
}

.modern-phone-input :deep(.vti__input) {
  padding: 1rem;
  border: 2px solid #e8eaed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.modern-phone-input :deep(.vti__input):focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.modern-phone-input :deep(.vti__dropdown) {
  border: 2px solid #e8eaed;
  border-radius: 12px;
  background: #fafbfc;
}

/* Terms Checkbox */
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
}

.terms-checkbox input {
  display: none;
}

.terms-checkbox .checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e8eaed;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.terms-checkbox input:checked + .checkmark {
  background: #1177bf;
  border-color: #1177bf;
}

.terms-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.terms-link {
  color: #1177bf;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #0d5a9a;
  text-decoration: underline;
}

/* Signup Button */
.signup-btn {
  width: 100%;
  padding: 1rem;
  background: #1177bf;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.signup-btn:hover {
  background: #0d5a9a;
}

.signup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Divider */
.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e8eaed;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #6c757d;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

/* Google Button */
.google-btn {
  width: 100%;
  padding: 1rem;
  background: white;
  color: #333;
  border: 2px solid #e8eaed;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.google-btn:hover {
  border-color: #dadce0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.error-alert {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
}

.login-link p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.login-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-text:hover {
  color: #5a6fd8;
}

/* ===== DASHBOARD COMPACT MODE ===== */
.modern-signup-page.dashboard-mode {
  min-height: auto;
  padding: 0.5rem;
}

.modern-signup-page.dashboard-mode .signup-container {
  max-width: 400px;
}

.modern-signup-page.dashboard-mode .signup-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modern-signup-page.dashboard-mode .signup-header {
  padding: 1rem 0.75rem 0.75rem;
}

.modern-signup-page.dashboard-mode .signup-form-section {
  padding: 0.75rem;
}

.modern-signup-page.dashboard-mode .welcome-title {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.modern-signup-page.dashboard-mode .welcome-subtitle {
  font-size: 0.8rem;
}

.modern-signup-page.dashboard-mode .form-group {
  margin-bottom: 0.75rem;
}

.modern-signup-page.dashboard-mode .form-label {
  font-size: 0.8rem;
  margin-bottom: 0.375rem;
}

.modern-signup-page.dashboard-mode .modern-input {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-signup-page.dashboard-mode .modern-phone-input :deep(.vti__input) {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-signup-page.dashboard-mode .signup-btn,
.modern-signup-page.dashboard-mode .google-btn {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-signup-page.dashboard-mode .divider {
  margin: 0.75rem 0;
}

.modern-signup-page.dashboard-mode .divider-text {
  font-size: 0.75rem;
}

.modern-signup-page.dashboard-mode .login-link {
  margin-top: 0.75rem;
}

/* ===== ULTRA COMPACT MODE ===== */
.modern-signup-page.ultra-compact {
  min-height: auto;
  padding: 0.125rem;
}

.modern-signup-page.ultra-compact .signup-container {
  max-width: 300px;
}

.modern-signup-page.ultra-compact .signup-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.modern-signup-page.ultra-compact .signup-header {
  padding: 0.5rem 0.375rem 0.375rem;
}

.modern-signup-page.ultra-compact .signup-form-section {
  padding: 0.375rem;
}

.modern-signup-page.ultra-compact .logo-section {
  margin-bottom: 0.5rem;
}

.modern-signup-page.ultra-compact .logo-text {
  font-size: 0.9rem;
}

.modern-signup-page.ultra-compact .welcome-title {
  font-size: 0.9rem;
  margin-bottom: 0.125rem;
}

.modern-signup-page.ultra-compact .welcome-subtitle {
  font-size: 0.65rem;
}

.modern-signup-page.ultra-compact .form-group {
  margin-bottom: 0.375rem;
}

.modern-signup-page.ultra-compact .form-label {
  font-size: 0.65rem;
  margin-bottom: 0.125rem;
}

.modern-signup-page.ultra-compact .modern-input {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
  border: 1px solid #e8eaed;
}

.modern-signup-page.ultra-compact .modern-phone-input :deep(.vti__input) {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
  border: 1px solid #e8eaed;
}

.modern-signup-page.ultra-compact .password-toggle {
  width: 20px;
  height: 20px;
  font-size: 0.6rem;
  right: 0.25rem;
  padding: 0.125rem;
}

.modern-signup-page.ultra-compact .terms-checkbox {
  font-size: 0.6rem;
  gap: 0.375rem;
}

.modern-signup-page.ultra-compact .terms-checkbox .checkmark {
  width: 14px;
  height: 14px;
}

.modern-signup-page.ultra-compact .signup-btn,
.modern-signup-page.ultra-compact .google-btn {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
}

.modern-signup-page.ultra-compact .divider {
  margin: 0.375rem 0;
}

.modern-signup-page.ultra-compact .divider-text {
  font-size: 0.6rem;
}

.modern-signup-page.ultra-compact .google-icon {
  width: 12px;
  height: 12px;
}

.modern-signup-page.ultra-compact .login-link {
  margin-top: 0.375rem;
}

.modern-signup-page.ultra-compact .login-link p {
  font-size: 0.65rem;
}

.modern-signup-page.ultra-compact .login-text {
  font-size: 0.65rem;
}

/* ===== MICRO MODE - ABSOLUTE MINIMUM ===== */
.modern-signup-page.micro-mode {
  min-height: auto;
  padding: 0.0625rem;
}

.modern-signup-page.micro-mode .signup-container {
  max-width: 280px;
}

.modern-signup-page.micro-mode .signup-card {
  box-shadow: none;
  border: 1px solid #e8eaed;
  border-radius: 6px;
}

.modern-signup-page.micro-mode .signup-header {
  padding: 0.375rem 0.25rem 0.25rem;
  background: #f8f9fa;
}

.modern-signup-page.micro-mode .signup-form-section {
  padding: 0.25rem;
}

.modern-signup-page.micro-mode .logo-section {
  margin-bottom: 0.25rem;
}

.modern-signup-page.micro-mode .logo-text {
  font-size: 0.8rem;
}

.modern-signup-page.micro-mode .welcome-title {
  font-size: 0.8rem;
  margin-bottom: 0.0625rem;
}

.modern-signup-page.micro-mode .welcome-subtitle {
  font-size: 0.6rem;
}

.modern-signup-page.micro-mode .form-group {
  margin-bottom: 0.25rem;
}

.modern-signup-page.micro-mode .form-label {
  font-size: 0.6rem;
  margin-bottom: 0.0625rem;
}

.modern-signup-page.micro-mode .modern-input {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.modern-signup-page.micro-mode .modern-phone-input :deep(.vti__input) {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.modern-signup-page.micro-mode .password-toggle {
  width: 16px;
  height: 16px;
  font-size: 0.5rem;
  right: 0.1875rem;
  padding: 0.0625rem;
}

.modern-signup-page.micro-mode .terms-checkbox {
  font-size: 0.55rem;
  gap: 0.25rem;
}

.modern-signup-page.micro-mode .terms-checkbox .checkmark {
  width: 12px;
  height: 12px;
}

.modern-signup-page.micro-mode .signup-btn,
.modern-signup-page.micro-mode .google-btn {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
}

.modern-signup-page.micro-mode .divider {
  margin: 0.25rem 0;
}

.modern-signup-page.micro-mode .divider-text {
  font-size: 0.55rem;
}

.modern-signup-page.micro-mode .google-icon {
  width: 10px;
  height: 10px;
}

.modern-signup-page.micro-mode .login-link {
  margin-top: 0.25rem;
}

.modern-signup-page.micro-mode .login-link p {
  font-size: 0.6rem;
}

.modern-signup-page.micro-mode .login-text {
  font-size: 0.6rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .modern-signup-page {
    padding: 0.5rem;
  }
  
  .signup-container {
    max-width: 400px;
  }
  
  .signup-card {
    border-radius: 16px;
  }
  
  .signup-header {
    padding: 1.5rem 1.25rem 1.25rem;
  }
  
  .signup-form-section {
    padding: 1.25rem;
  }
  
  .welcome-title {
    font-size: 1.4rem;
  }
  
  .welcome-subtitle {
    font-size: 0.9rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .modern-input {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .signup-btn,
  .google-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .modern-signup-page {
    padding: 0.25rem;
  }
  
  .signup-container {
    max-width: 350px;
  }
  
  .signup-header {
    padding: 1.25rem 1rem 1rem;
  }
  
  .signup-form-section {
    padding: 1rem;
  }
  
  .logo-section {
    margin-bottom: 0.75rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .welcome-title {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }
  
  .welcome-subtitle {
    font-size: 0.85rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-label {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  .modern-input {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .password-toggle {
    right: 0.75rem;
    padding: 0.25rem;
  }
  
  .terms-checkbox {
    font-size: 0.8rem;
  }
  
  .signup-btn,
  .google-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .divider {
    margin: 1.25rem 0;
  }
  
  .divider-text {
    font-size: 0.8rem;
  }
  
  .login-link {
    margin-top: 1.25rem;
  }
  
  .login-link p {
    font-size: 0.85rem;
  }
  
  .login-text {
    font-size: 0.85rem;
  }
}

/* Ultra-compact mobile (320px and below) */
@media (max-width: 320px) {
  .modern-signup-page {
    padding: 0.125rem;
  }
  
  .signup-container {
    max-width: 300px;
  }
  
  .signup-header {
    padding: 0.75rem 0.5rem 0.5rem;
  }
  
  .signup-form-section {
    padding: 0.5rem;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .welcome-title {
    font-size: 1rem;
  }
  
  .welcome-subtitle {
    font-size: 0.75rem;
  }
  
  .form-group {
    margin-bottom: 0.75rem;
  }
  
  .form-label {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  
  .modern-input {
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  
  .password-toggle {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
    right: 0.5rem;
    padding: 0.125rem;
  }
  
  .terms-checkbox {
    font-size: 0.7rem;
    gap: 0.5rem;
  }
  
  .terms-checkbox .checkmark {
    width: 16px;
    height: 16px;
  }
  
  .signup-btn,
  .google-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  
  .divider {
    margin: 0.75rem 0;
  }
  
  .divider-text {
    font-size: 0.7rem;
  }
  
  .google-icon {
    width: 16px;
    height: 16px;
  }
  
  .login-link {
    margin-top: 0.75rem;
  }
  
  .login-link p {
    font-size: 0.75rem;
  }
  
  .login-text {
    font-size: 0.75rem;
  }
}

/* ===== ACCESSIBILITY ===== */
.modern-input:focus,
.password-toggle:focus,
.signup-btn:focus,
.google-btn:focus {
  outline: 2px solid rgba(17, 119, 191, 0.5);
  outline-offset: 2px;
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .signup-card {
    background: rgba(44, 62, 80, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .form-label {
    color: #ecf0f1;
  }
  
  .modern-input {
    background: #34495e;
    border-color: #4a5f7a;
    color: #ecf0f1;
  }
  
  .modern-input:focus {
    background: #2c3e50;
    border-color: #667eea;
  }
  
  .terms-checkbox {
    color: #bdc3c7;
  }
  
  .divider-text {
    background: #2c3e50;
    color: #bdc3c7;
  }
  
  .google-btn {
    background: #34495e;
    color: #ecf0f1;
    border-color: #4a5f7a;
  }
  
  .google-btn:hover {
    border-color: #5a6f7a;
  }
  
  .login-link p {
    color: #bdc3c7;
  }
}
</style>
