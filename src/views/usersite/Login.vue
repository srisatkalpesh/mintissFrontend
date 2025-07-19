<template>
    <div class="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div class="card shadow-lg border-0 w-100 my-5" style="max-width: 500px;">
            <!-- Header -->
            <div class="text-white p-4 text-center bg-primary">
                <h2 class="mb-1 fs-3">Welcome Back</h2>
                <p class="mb-0 small">Please login to your account</p>
            </div>

            <!-- Body -->
            <div class="card-body p-4">
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <vue-tel-input
                            v-model="phone"
                            :inputOptions="{
                                placeholder: 'Phone Number',
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
                        />
                        <div v-if="errors.phone" class="text-danger small mt-1">
                            {{ errors.phone[0] }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <input type="password" v-model="password" class="form-control" placeholder="Password"
                            required />
                        <div v-if="errors.password" class="text-danger small mt-1">
                            {{ errors.password[0] }}
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                </form>

                <!-- Divider -->
                <div class="text-center my-3">
                    <span class="bg-white px-3 text-muted">or</span>
                    <hr class="mt-n3">
                </div>

                <!-- Google Login Button -->
                <button @click="handleGoogleLogin" class="btn btn-outline-secondary w-100 fw-bold" :disabled="googleLoading">
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="me-2" style="width: 18px; height: 18px;">
                    <span v-if="googleLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ googleLoading ? 'Connecting to Google...' : 'Continue with Google' }}
                </button>

                <p v-if="errors.general" class="text-danger text-center mt-3">{{ errors.general }}</p>

                <!-- Signup Redirect -->
                <p class="text-center mt-3">
                    Don't have an account?
                    <router-link to="/signup" class="text-primary fw-semibold">Sign up</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';
import googleAuthService from '@/services/googleAuthService';

export default {
    name: "Login",
    data() {
        return {
            phone: '',
            password: '',
            errors: {},
            loading: false,
            googleLoading: false
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
.bg-primary {
  background: linear-gradient(135deg, #1177bf 0%, #0d6efd 100%) !important;
}
.text-primary {
  color: #1177bf !important;
}
.btn-primary {
  background-color: #1177bf !important;
  border-color: #1177bf !important;
}
.btn-primary:hover {
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
}
.btn-outline-primary {
  color: #1177bf !important;
  border-color: #1177bf !important;
}
.btn-outline-primary:hover {
  background-color: #1177bf !important;
  border-color: #1177bf !important;
}
</style>
