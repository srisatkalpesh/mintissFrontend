<template>
  <div class="container-fluid min-vh-86 d-flex justify-content-center align-items-center bg-light">
    <div class="card shadow-lg rounded-4 border-0 w-100" style="max-width: 500px;">
      <!-- Header -->
      <div class="bg-primary text-white rounded-top-4 p-4 text-center">
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
            <input type="tel" v-model="phone" class="form-control" placeholder="Phone Number" required />
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
      loading: false
    };
  },
  methods: {
    async handleSignup() {
      this.errors = {};
      
      // Validate password confirmation
      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = ['Passwords do not match'];
        return;
      }

      this.loading = true;
      try {
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        const response = await axios.post(`${baseURL}/signup`, {
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password
        });

        const { user, token } = response.data;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        console.log("Signup successful:", user);

        // Redirect to dashboard or other protected route after signup
        this.$router.push('/');

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
</style>
