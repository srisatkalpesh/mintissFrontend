<template>
    <div class="modern-login-page" :class="{ 'dashboard-mode': dashboardMode, 'ultra-compact': ultraCompact, 'micro-mode': microMode }">
        <div class="login-container">

            <!-- Login Card -->
            <div class="login-card">
            <!-- Header -->
                <div class="login-header">
                    <div class="logo-section">
                        <h1 class="logo-text">Mintiss</h1>
                    </div>
                    <h2 class="welcome-title">Welcome Back!</h2>
                    <p class="welcome-subtitle">Sign in to your account to continue</p>
            </div>

                <!-- Form Section -->
                <div class="login-form-section">
                    <form @submit.prevent="handleLogin" class="login-form">
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
                                    placeholder="Enter your password"
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

                        <!-- Remember Me & Forgot Password -->
                        <div class="form-options">
                            <label class="remember-me">
                                <input type="checkbox" v-model="rememberMe">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-password">Forgot password?</a>
                        </div>

                        <!-- Login Button -->
                        <button type="submit" class="login-btn" :disabled="loading">
                            <span v-if="loading" class="spinner"></span>
                            <i v-else class="bi bi-box-arrow-in-right"></i>
                            {{ loading ? 'Signing in...' : 'Sign In' }}
                    </button>
                </form>

                <!-- Divider -->
                    <div class="divider">
                        <span class="divider-text">or continue with</span>
                </div>

                    <!-- Google Login -->
                    <button @click="handleGoogleLogin" class="google-btn" :disabled="googleLoading">
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="google-icon">
                        <span v-if="googleLoading" class="spinner"></span>
                        {{ googleLoading ? 'Connecting...' : 'Continue with Google' }}
                </button>

                    <!-- Error Message -->
                    <div v-if="errors.general" class="error-alert">
                        <i class="bi bi-exclamation-triangle"></i>
                        {{ errors.general }}
                    </div>

                    <!-- Signup Link -->
                    <div class="signup-link">
                        <p>Don't have an account? 
                            <router-link to="/signup" class="signup-text">Create one now</router-link>
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
    name: "Login",
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
            phone: '',
            password: '',
            errors: {},
            loading: false,
            googleLoading: false,
            showPassword: false,
            rememberMe: false
        };
    },
    mounted() {
        // Check for error in URL query parameters (from Google callback)
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        if (error) {
            this.errors.general = error;
            // Clear the URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
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
        async handleLogin() {
            this.errors = {};
            this.loading = true;
            try {
                // Clean phone number by removing all spaces
                const cleanPhone = this.phone.replace(/\s/g, '');
                
                console.log('Original phone:', this.phone);
                console.log('Clean phone:', cleanPhone);
                
                const baseURL = process.env.VUE_APP_API_BASE_URL;
                const response = await axios.post(`${baseURL}/login`, {
                    phone: cleanPhone,
                    password: this.password
                });

                const { user, token } = response.data;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                console.log('User object:', user);
                console.log('User role:', user.role);
                console.log('User type:', user.type);
                
                // Redirect based on user type
                if (user.role === 'admin' || user.type === 'admin' || user.role === 'Admin' || user.type === 'Admin') {
                    console.log('Redirecting to admin');
                    this.$router.push('/admin');
                } else if (user.role === 'Seller' || user.type === 'Seller' || user.role === 'seller' || user.type === 'seller') {
                    console.log('Seller called');
                    this.$router.push('/seller/dashboard');
                } else {
                    console.log('Redirecting to home');
                    window.location.href = '/';
                }

            } catch (error) {
                this.loading = false;
                if (error.response && error.response.data) {
                    const responseErrors = error.response.data.errors || {};
                    this.errors = { ...responseErrors };

                    if (error.response.data.message && !Object.keys(responseErrors).length) {
                        this.errors.general = error.response.data.message;
                    }
                } else {
                    this.errors.general = 'Login failed. Please check your credentials.';
                }
            }
        },

        async handleGoogleLogin() {
            this.errors = {};
            this.googleLoading = true;
            
            try {
                // Set up error handler
                window.googleAuthError = (error) => {
                    this.googleLoading = false;
                    this.errors.general = 'Google login failed. Please try again.';
                    console.error('Google auth error:', error);
                };

                // Use redirect flow for better compatibility
                googleAuthService.redirectToGoogle();
                
            } catch (error) {
                this.googleLoading = false;
                this.errors.general = 'Google login failed. Please try again.';
                console.error('Google login error:', error);
            }
        }
    }
};
</script>

<style scoped>
/* ===== MODERN LOGIN PAGE STYLES ===== */
.modern-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.login-container {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
}


/* Login Card */
.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}


/* Header */
.login-header {
  text-align: center;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, #1177bf, #0d5a9a);
  color: white;
  position: relative;
}

.login-header::after {
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
.login-form-section {
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.login-form {
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
  color: #1177bf;
}

.password-toggle.active {
  color: #1177bf;
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

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6c757d;
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #e8eaed;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.remember-me input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.remember-me input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #5a6fd8;
}

/* Login Button */
.login-btn {
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

.login-btn:hover {
  background: #0d5a9a;
}

.login-btn:disabled {
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

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: 1.5rem;
}

.signup-link p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.signup-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.signup-text:hover {
  color: #5a6fd8;
}

/* ===== DASHBOARD COMPACT MODE ===== */
.modern-login-page.dashboard-mode {
  min-height: auto;
  padding: 0.5rem;
}

.modern-login-page.dashboard-mode .login-container {
  max-width: 350px;
}

.modern-login-page.dashboard-mode .login-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modern-login-page.dashboard-mode .login-header {
  padding: 1rem 0.75rem 0.75rem;
}

.modern-login-page.dashboard-mode .login-form-section {
  padding: 0.75rem;
}

.modern-login-page.dashboard-mode .welcome-title {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.modern-login-page.dashboard-mode .welcome-subtitle {
  font-size: 0.8rem;
}

.modern-login-page.dashboard-mode .form-group {
  margin-bottom: 0.75rem;
}

.modern-login-page.dashboard-mode .form-label {
  font-size: 0.8rem;
  margin-bottom: 0.375rem;
}

.modern-login-page.dashboard-mode .modern-input {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-login-page.dashboard-mode .modern-phone-input :deep(.vti__input) {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-login-page.dashboard-mode .login-btn,
.modern-login-page.dashboard-mode .google-btn {
  padding: 0.5rem;
  font-size: 0.85rem;
  border-radius: 6px;
}

.modern-login-page.dashboard-mode .divider {
  margin: 0.75rem 0;
}

.modern-login-page.dashboard-mode .divider-text {
  font-size: 0.75rem;
}

.modern-login-page.dashboard-mode .signup-link {
  margin-top: 0.75rem;
}

/* ===== ULTRA COMPACT MODE ===== */
.modern-login-page.ultra-compact {
  min-height: auto;
  padding: 0.125rem;
}

.modern-login-page.ultra-compact .login-container {
  max-width: 280px;
}

.modern-login-page.ultra-compact .login-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.modern-login-page.ultra-compact .login-header {
  padding: 0.5rem 0.375rem 0.375rem;
}

.modern-login-page.ultra-compact .login-form-section {
  padding: 0.375rem;
}

.modern-login-page.ultra-compact .logo-section {
  margin-bottom: 0.5rem;
}

.modern-login-page.ultra-compact .logo-text {
  font-size: 0.9rem;
}

.modern-login-page.ultra-compact .welcome-title {
  font-size: 0.9rem;
  margin-bottom: 0.125rem;
}

.modern-login-page.ultra-compact .welcome-subtitle {
  font-size: 0.65rem;
}

.modern-login-page.ultra-compact .form-group {
  margin-bottom: 0.375rem;
}

.modern-login-page.ultra-compact .form-label {
  font-size: 0.65rem;
  margin-bottom: 0.125rem;
}

.modern-login-page.ultra-compact .modern-input {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
  border: 1px solid #e8eaed;
}

.modern-login-page.ultra-compact .modern-phone-input :deep(.vti__input) {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
  border: 1px solid #e8eaed;
}

.modern-login-page.ultra-compact .password-toggle {
  width: 20px;
  height: 20px;
  font-size: 0.6rem;
  right: 0.25rem;
  padding: 0.125rem;
}

.modern-login-page.ultra-compact .form-options {
  margin-bottom: 0.375rem;
  gap: 0.5rem;
}

.modern-login-page.ultra-compact .remember-me {
  font-size: 0.65rem;
}

.modern-login-page.ultra-compact .forgot-password {
  font-size: 0.65rem;
}

.modern-login-page.ultra-compact .login-btn,
.modern-login-page.ultra-compact .google-btn {
  padding: 0.25rem;
  font-size: 0.7rem;
  border-radius: 3px;
}

.modern-login-page.ultra-compact .divider {
  margin: 0.375rem 0;
}

.modern-login-page.ultra-compact .divider-text {
  font-size: 0.6rem;
}

.modern-login-page.ultra-compact .google-icon {
  width: 12px;
  height: 12px;
}

.modern-login-page.ultra-compact .signup-link {
  margin-top: 0.375rem;
}

.modern-login-page.ultra-compact .signup-link p {
  font-size: 0.65rem;
}

.modern-login-page.ultra-compact .signup-text {
  font-size: 0.65rem;
}

/* ===== MICRO MODE - ABSOLUTE MINIMUM ===== */
.modern-login-page.micro-mode {
  min-height: auto;
  padding: 0.0625rem;
}

.modern-login-page.micro-mode .login-container {
  max-width: 260px;
}

.modern-login-page.micro-mode .login-card {
  box-shadow: none;
  border: 1px solid #e8eaed;
  border-radius: 6px;
}

.modern-login-page.micro-mode .login-header {
  padding: 0.375rem 0.25rem 0.25rem;
  background: #f8f9fa;
}

.modern-login-page.micro-mode .login-form-section {
  padding: 0.25rem;
}

.modern-login-page.micro-mode .logo-section {
  margin-bottom: 0.25rem;
}

.modern-login-page.micro-mode .logo-text {
  font-size: 0.8rem;
}

.modern-login-page.micro-mode .welcome-title {
  font-size: 0.8rem;
  margin-bottom: 0.0625rem;
}

.modern-login-page.micro-mode .welcome-subtitle {
  font-size: 0.6rem;
}

.modern-login-page.micro-mode .form-group {
  margin-bottom: 0.25rem;
}

.modern-login-page.micro-mode .form-label {
  font-size: 0.6rem;
  margin-bottom: 0.0625rem;
}

.modern-login-page.micro-mode .modern-input {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.modern-login-page.micro-mode .modern-phone-input :deep(.vti__input) {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.modern-login-page.micro-mode .password-toggle {
  width: 16px;
  height: 16px;
  font-size: 0.5rem;
  right: 0.1875rem;
  padding: 0.0625rem;
}

.modern-login-page.micro-mode .form-options {
  margin-bottom: 0.25rem;
  gap: 0.25rem;
}

.modern-login-page.micro-mode .remember-me {
  font-size: 0.6rem;
}

.modern-login-page.micro-mode .forgot-password {
  font-size: 0.6rem;
}

.modern-login-page.micro-mode .login-btn,
.modern-login-page.micro-mode .google-btn {
  padding: 0.1875rem;
  font-size: 0.65rem;
  border-radius: 2px;
}

.modern-login-page.micro-mode .divider {
  margin: 0.25rem 0;
}

.modern-login-page.micro-mode .divider-text {
  font-size: 0.55rem;
}

.modern-login-page.micro-mode .google-icon {
  width: 10px;
  height: 10px;
}

.modern-login-page.micro-mode .signup-link {
  margin-top: 0.25rem;
}

.modern-login-page.micro-mode .signup-link p {
  font-size: 0.6rem;
}

.modern-login-page.micro-mode .signup-text {
  font-size: 0.6rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .modern-login-page {
    padding: 0.5rem;
  }
  
  .login-container {
    max-width: 400px;
  }
  
  .login-card {
    border-radius: 16px;
  }
  
  .login-header {
    padding: 1.5rem 1.25rem 1.25rem;
  }
  
  .login-form-section {
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
  
  .login-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .google-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .modern-login-page {
    padding: 0.25rem;
  }
  
  .login-container {
    max-width: 350px;
  }
  
  .login-header {
    padding: 1.25rem 1rem 1rem;
  }
  
  .login-form-section {
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
  
  .form-options {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }
  
  .remember-me {
    font-size: 0.85rem;
  }
  
  .forgot-password {
    font-size: 0.85rem;
  }
  
  .login-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
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
  
  .signup-link p {
    font-size: 0.85rem;
  }
  
  .signup-text {
    font-size: 0.85rem;
  }
}

/* ===== ACCESSIBILITY ===== */
.modern-input:focus,
.password-toggle:focus,
.login-btn:focus,
.google-btn:focus {
  outline: 2px solid rgba(17, 119, 191, 0.5);
  outline-offset: 2px;
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
  .login-card {
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
  
  .remember-me {
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
  
  .signup-link p {
    color: #bdc3c7;
  }
}

/* Mobile-First Responsive Design */
/* Base styles are mobile-first */

/* Small mobile devices (320px and up) */
@media (min-width: 320px) {
  .modern-login-page {
    padding: 0.5rem 0;
    min-height: 100vh;
  }
  
  .login-container {
    padding: 0 0.25rem;
    max-width: 320px;
  }
  
  .login-card {
    border-radius: 12px;
    margin: 0.5rem 0;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 1rem;
    padding: 1rem 0.75rem 0.75rem;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
  
  .welcome-title {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .welcome-subtitle {
    font-size: 0.8rem;
  }
  
  .login-form-section {
    padding: 0.75rem;
  }
  
  .form-group {
    margin-bottom: 0.875rem;
  }
  
  .form-label {
    font-size: 0.8rem;
    margin-bottom: 0.375rem;
  }
  
  .modern-input {
    padding: 0.625rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
  
  .password-toggle {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
    right: 0.625rem;
    padding: 0.25rem;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.625rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 0.625rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .remember-me {
    font-size: 0.8rem;
  }
  
  .forgot-password {
    font-size: 0.8rem;
  }
  
  .login-btn {
    padding: 0.625rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
  
  .divider {
    margin: 1rem 0;
  }
  
  .divider-text {
    font-size: 0.75rem;
  }
  
  .google-btn {
    padding: 0.625rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
  
  .google-icon {
    width: 18px;
    height: 18px;
  }
  
  .signup-link {
    font-size: 0.8rem;
  }
  
  .signup-text {
    font-size: 0.8rem;
  }
}

/* Mobile devices (480px and up) */
@media (min-width: 480px) {
  .login-container {
    max-width: 380px;
  }
  
  .login-header {
    padding: 1.25rem 1rem 1rem;
  }
  
  .login-form-section {
    padding: 1rem;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .welcome-title {
    font-size: 1.3rem;
  }
  
  .welcome-subtitle {
    font-size: 0.9rem;
  }
  
  .modern-input {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .password-toggle {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .form-options {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .remember-me {
    font-size: 0.85rem;
  }
  
  .forgot-password {
    font-size: 0.85rem;
  }
  
  .login-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .google-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .google-icon {
    width: 20px;
    height: 20px;
  }
}

/* Tablet devices (768px and up) */
@media (min-width: 768px) {
  .modern-login-page {
    padding: 1rem 0;
  }
  
  .login-container {
    padding: 0 1rem;
    max-width: 420px;
  }
  
  .login-header {
    padding: 1.5rem 1.25rem 1.25rem;
  }
  
  .login-form-section {
    padding: 1.25rem;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .welcome-title {
    font-size: 1.4rem;
  }
  
  .welcome-subtitle {
    font-size: 0.95rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-label {
    font-size: 0.9rem;
  }
  
  .modern-input {
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  .password-toggle {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  .form-options {
    margin-bottom: 1.5rem;
  }
  
  .remember-me {
    font-size: 0.9rem;
  }
  
  .forgot-password {
    font-size: 0.9rem;
  }
  
  .login-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  .divider {
    margin: 1.5rem 0;
  }
  
  .divider-text {
    font-size: 0.85rem;
  }
  
  .google-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  .google-icon {
    width: 22px;
    height: 22px;
  }
  
  .signup-link {
    font-size: 0.9rem;
  }
  
  .signup-link a {
    font-size: 0.9rem;
  }
}

/* Desktop devices (1024px and up) */
@media (min-width: 1024px) {
  .modern-login-page {
    padding: 1.5rem 0;
  }
  
  .login-container {
    padding: 0 1rem;
    max-width: 450px;
  }
  
  .login-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .login-form-section {
    padding: 1.5rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    font-size: 1rem;
  }
  
  .modern-input {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .password-toggle {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
  
  .modern-phone-input :deep(.vti__input) {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .form-options {
    margin-bottom: 2rem;
  }
  
  .remember-me {
    font-size: 1rem;
  }
  
  .forgot-password {
    font-size: 1rem;
  }
  
  .login-btn {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .divider {
    margin: 2rem 0;
  }
  
  .divider-text {
    font-size: 0.9rem;
  }
  
  .google-btn {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .google-icon {
    width: 24px;
    height: 24px;
  }
  
  .signup-link {
    font-size: 1rem;
  }
  
  .signup-link a {
    font-size: 1rem;
  }
}

/* Mobile-specific improvements */
@media (max-width: 767px) {
  .form-options {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .remember-me input {
    width: 16px;
    height: 16px;
  }
  
  .login-btn,
  .google-btn {
    width: 100%;
    justify-content: center;
  }
  
  .divider {
    margin: 1.25rem 0;
  }
  
  .signup-link {
    text-align: center;
  }
}

/* Touch-friendly improvements */
@media (max-width: 767px) {
  .modern-input,
  .login-btn,
  .google-btn,
  .remember-me,
  .forgot-password {
    min-height: 40px;
  }
  
  .password-toggle {
    min-width: 40px;
    min-height: 40px;
  }
  
  .login-btn:active,
  .google-btn:active {
    transform: scale(0.98);
  }
}

/* Ultra-compact mobile (320px and below) */
@media (max-width: 320px) {
  .modern-login-page {
    padding: 0.125rem;
  }
  
  .login-container {
    max-width: 300px;
  }
  
  .login-header {
    padding: 0.75rem 0.5rem 0.5rem;
  }
  
  .login-form-section {
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
  
  .login-btn,
  .google-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  
  .google-icon {
    width: 16px;
    height: 16px;
  }
  
  .divider {
    margin: 0.75rem 0;
  }
  
  .divider-text {
    font-size: 0.7rem;
  }
  
  .signup-link p {
    font-size: 0.75rem;
  }
  
  .signup-text {
    font-size: 0.75rem;
  }
}
</style>
