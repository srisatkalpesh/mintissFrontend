<template>
    <div class="container-fluid min-vh-86 d-flex justify-content-center align-items-center bg-light">
        <div class="card shadow-lg rounded-4 border-0 w-100" style="max-width: 500px;">
            <!-- Header -->
            <div class="bg-primary text-white rounded-top-4 p-4 text-center">
                <h2 class="mb-1 fs-3">Welcome Back</h2>
                <p class="mb-0 small">Please login to your account</p>
            </div>

            <!-- Body -->
            <div class="card-body p-4">
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <input type="tel" v-model="phone" class="form-control" placeholder="Phone Number" required />
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
    methods: {
        async handleLogin() {
            this.errors = {};
            this.loading = true;
            try {
                const baseURL = process.env.VUE_APP_API_BASE_URL;
                const response = await axios.post(`${baseURL}/login`, {
                    phone: this.phone,
                    password: this.password
                });

                const { user, token } = response.data;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // Redirect based on user type
                if (user.role === 'admin' || user.type === 'admin') {
                    this.$router.push('/admin/categories');
                } else {
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
@media (max-width: 400px) {
    .card-body {
        padding: 1rem !important;
    }
}

.min-vh-86 {
    min-height: 86vh;
}
</style>
