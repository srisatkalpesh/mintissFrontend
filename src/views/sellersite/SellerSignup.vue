<template>
  <div class="container-fluid min-vh-86 d-flex justify-content-center align-items-center bg-light">
    <div class="card shadow-lg border-0 w-100 my-5" style="max-width: 500px;">
      <!-- Header -->
      <div class="text-white p-4 text-center" style="background-color: #1177bf;">
        <h2 class="mb-1 fs-3">Create Seller Account</h2>
        <p class="mb-0 small">Please sign up to continue as a seller</p>
      </div>

      <!-- Stepper -->
      <div class="d-flex justify-content-center my-4">
        <div class="stepper">
          <span :class="['step', step === 1 ? 'active' : '', step > 1 ? 'done' : '']">1</span>
          <span class="line"></span>
          <span :class="['step', step === 2 ? 'active' : '', step > 2 ? 'done' : '']">2</span>
        </div>
      </div>

      <!-- Body -->
      <div class="card-body p-4">
        <!-- Step 1: Personal Info -->
        <form v-if="step === 1" @submit.prevent="goToNextStep">
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
              :inputOptions="{ placeholder: 'Phone Number', required: true }"
              :dropdownOptions="{ showDialCodeInSelection: true, showDialCodeInList: true }"
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
            Next
          </button>
        </form>

        <!-- Step 2: Store Details -->
        <form v-else @submit.prevent="handleSignup">
          <div class="mb-3">
            <input type="text" v-model="store_name" class="form-control" placeholder="Store Name" required />
            <div v-if="errors.store_name" class="text-danger small mt-1">{{ errors.store_name[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_category" class="form-control" placeholder="Store Category" required />
            <div v-if="errors.store_category" class="text-danger small mt-1">{{ errors.store_category[0] }}</div>
          </div>
          <div class="mb-3">
            <textarea v-model="store_description" class="form-control" placeholder="Store Description" required></textarea>
            <div v-if="errors.store_description" class="text-danger small mt-1">{{ errors.store_description[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_address" class="form-control" placeholder="Store Address" required />
            <div v-if="errors.store_address" class="text-danger small mt-1">{{ errors.store_address[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_city" class="form-control" placeholder="Store City" required />
            <div v-if="errors.store_city" class="text-danger small mt-1">{{ errors.store_city[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_state" class="form-control" placeholder="Store State" required />
            <div v-if="errors.store_state" class="text-danger small mt-1">{{ errors.store_state[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_zip_code" class="form-control" placeholder="Store Zip Code" required />
            <div v-if="errors.store_zip_code" class="text-danger small mt-1">{{ errors.store_zip_code[0] }}</div>
          </div>
          <div class="mb-3">
            <input type="text" v-model="store_gst_number" class="form-control" placeholder="GST Number (Optional)" />
            <div v-if="errors.store_gst_number" class="text-danger small mt-1">{{ errors.store_gst_number[0] }}</div>
            <small class="text-muted">Format: 22ABCDE1234F1Z5</small>
          </div>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="step = 1">Back</button>
            <button type="submit" class="btn btn-primary fw-bold" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span v-if="!loading">Sign Up</span>
              <span v-else>Signing Up...</span>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="text-center my-3">
          <span class="bg-white px-3 text-muted">or</span>
          <hr class="mt-n3">
        </div>

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
  name: "SellerSignup",
  data() {
    return {
      step: 1,
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      store_name: '',
      store_category: '',
      store_description: '',
      store_address: '',
      store_city: '',
      store_state: '',
      store_zip_code: '',
      store_gst_number: '',
      errors: {},
      loading: false,
      googleLoading: false,
      referralCode: ''
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
        this.phone = phoneObject.number.replace(/\s/g, '');
      }
    },
    goToNextStep() {
      this.errors = {};
      if (!this.name) this.errors.name = ['Full name is required.'];
      if (!this.email) this.errors.email = ['Email is required.'];
      if (!this.phone) this.errors.phone = ['Phone number is required.'];
      if (!this.password) this.errors.password = ['Password is required.'];
      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = ['Passwords do not match'];
      }
      if (Object.keys(this.errors).length === 0) {
        this.step = 2;
      }
    },
    async handleSignup() {
      this.errors = {};
      // Validate required store fields
      if (!this.store_name) this.errors.store_name = ['The store name field is required.'];
      if (!this.store_category) this.errors.store_category = ['The store category field is required.'];
      if (!this.store_description) this.errors.store_description = ['The store description field is required.'];
      if (!this.store_address) this.errors.store_address = ['The store address field is required.'];
      if (!this.store_city) this.errors.store_city = ['The store city field is required.'];
      if (!this.store_state) this.errors.store_state = ['The store state field is required.'];
      if (!this.store_zip_code) this.errors.store_zip_code = ['The store zip code field is required.'];
      if (Object.keys(this.errors).length > 0) return;

      this.loading = true;
      try {
        const cleanPhone = this.phone.replace(/\s/g, '');
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        const signupData = {
          name: this.name,
          email: this.email,
          phone: cleanPhone,
          password: this.password,
          password_confirmation: this.confirmPassword,
          store_name: this.store_name,
          store_category: this.store_category,
          store_description: this.store_description,
          store_address: this.store_address,
          store_city: this.store_city,
          store_state: this.store_state,
          store_zip_code: this.store_zip_code,
          store_gst_number: this.store_gst_number
        };

        // Add referral code if present
        if (this.referralCode) {
          signupData.referral_code = this.referralCode;
        }

        const response = await axios.post(`${baseURL}/seller/signup`, signupData);

        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        this.$router.push('/seller/dashboard');
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
        window.googleAuthError = (error) => {
          this.googleLoading = false;
          this.errors.general = 'Google signup failed. Please try again.';
          console.error('Google auth error:', error);
        };
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
.card {
  border-radius: 1rem;
  overflow: hidden;
  animation: fadeInUp 0.7s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.card-body {
  background: #f8fbff;
}
.btn-primary {
  background: linear-gradient(90deg, #1177bf 0%, #0d6efd 100%);
  border: none;
}
.btn-outline-secondary {
  border-radius: 0.5rem;
}
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
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.step {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #495057;
  font-weight: 500;
  position: relative;
  z-index: 1;
}
.step.active {
  background-color: #1177bf;
  color: #fff;
}
.step.done {
  background-color: #28a745;
  color: #fff;
}
.line {
  flex: 1;
  height: 2px;
  background-color: #e9ecef;
  position: relative;
  top: 0.5rem;
  z-index: 0;
}

/* GST Number field styling */
input[placeholder*="GST Number"] {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input[placeholder*="GST Number"]:focus {
  border-color: #1177bf;
  box-shadow: 0 0 0 0.25rem rgba(17, 119, 191, 0.25);
}
</style>
