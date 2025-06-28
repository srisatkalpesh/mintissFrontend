<template>
  <div class="container-fluid min-vh-86 d-flex justify-content-center align-items-center bg-light">
    <div class="card shadow-lg border-0 w-100 my-5" style="max-width: 500px;">
      <!-- Header -->
      <div class="text-white p-4 text-center" style="background-color: #1177bf;">
        <h2 class="mb-1 fs-3">Create Account</h2>
        <p class="mb-0 small">Please sign up to continue</p>
      </div>

      <!-- Body -->
      <div class="card-body p-4">
        <form @submit.prevent="handleSignup">
          <div class="mb-3">
            <input type="text" v-model="name" class="form-control" placeholder="Full Name" required />
            <div v-if="errors.name" class="text-danger small mt-1">{{ errors.name[0] }}</div>
          </div>

          <div class="mb-3">
            <input type="email" v-model="email" class="form-control" placeholder="Email" required />
            <div v-if="errors.email" class="text-danger small mt-1">{{ errors.email[0] }}</div>
          </div>

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
            <div v-if="errors.phone" class="text-danger small mt-1">{{ errors.phone[0] }}</div>
          </div>

          <div class="mb-3">
            <input type="password" v-model="password" class="form-control" placeholder="Password" required />
            <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password[0] }}</div>
          </div>

          <div class="mb-3">
            <input type="password" v-model="confirmPassword" class="form-control" placeholder="Confirm Password" required />
            <div v-if="errors.confirmPassword" class="text-danger small mt-1">{{ errors.confirmPassword[0] }}</div>
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            <span v-if="!loading">Sign Up</span>
            <span v-else>Signing Up...</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="text-center my-3">
          <span class="bg-white px-3 text-muted">or</span>
          <hr class="mt-n3">
        </div>

        <!-- Google Signup Button -->
        <button @click="handleGoogleSignup" class="btn btn-outline-secondary w-100 fw-bold" :disabled="googleLoading">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="me-2" style="width: 18px; height: 18px;">
          <span v-if="googleLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ googleLoading ? 'Connecting to Google...' : 'Sign up with Google' }}
        </button>

        <p v-if="errors.general" class="text-danger text-center mt-3">{{ errors.general }}</p>

        <p class="text-center mt-3 small">
          Already have an account?
          <router-link to="/login" class="text-decoration-none">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import googleAuthService from '@/services/googleAuthService';

export default {
  name: "UserSignup",
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      errors: {},
      loading: false,
      googleLoading: false
    };
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
        const response = await axios.post(`${baseURL}/signup`, {
          name: this.name,
          email: this.email,
          phone: cleanPhone,
          password: this.password,
          password_confirmation: this.confirmPassword
        });

        const { user, token } = response.data;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        console.log("Signup successful:", user);

        // Redirect based on user type
        if (user.role === 'admin' || user.type === 'admin' || user.role === 'Admin' || user.type === 'Admin') {
            this.$router.push('/admin/categories');
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
.min-vh-86 {
  min-height: 86vh;
}

@media (max-width: 400px) {
  .card-body {
    padding: 1rem !important;
  }
}

/* Custom styles for vue-tel-input */
:deep(.vue-tel-input) {
  border-radius: 0.375rem;
  border: 1px solid #ced4da;
}

:deep(.vue-tel-input.vti--focus) {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.vti__dropdown) {
  border: none;
  background: transparent;
  padding: 0.375rem 0.75rem;
}

:deep(.vti__dropdown-list) {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

:deep(.vti__dropdown-item) {
  padding: 0.5rem 0.75rem;
}

:deep(.vti__dropdown-item:hover) {
  background-color: #f8f9fa;
}

:deep(.vti__dropdown-item.selected) {
  background-color: #e9ecef;
}

:deep(.vti__input) {
  border: none;
  outline: none;
  background: transparent;
  padding: 0.375rem 0.75rem;
  height: 36px;
  box-sizing: border-box;
}

:deep(.vti__flag) {
  margin-right: 0.5rem;
}

:deep(.vti__selection) {
  display: flex;
  align-items: center;
}
</style>
