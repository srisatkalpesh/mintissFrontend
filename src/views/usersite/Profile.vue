<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Profile Information Card -->
        <div class="card shadow-lg border-0 rounded-4 mb-4">
          <div class="card-header bg-primary text-white rounded-top-4 p-4 d-flex align-items-center justify-content-between">
            <h2 class="mb-0 fs-3">Profile Information</h2>
            <button v-if="!editMode" class="btn btn-light btn-sm fw-bold" @click="editMode = true">
              <i class="bi bi-pencil me-1"></i> Edit
            </button>
          </div>
          <div class="card-body p-4">
            <form v-if="editMode" @submit.prevent="saveProfile">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Name</label>
                    <input v-model="editUser.name" type="text" class="form-control" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <input v-model="editUser.email" type="email" class="form-control" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Phone</label>
                    <input v-model="editUser.phone" type="text" class="form-control" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Role</label>
                    <input v-model="editUser.role" type="text" class="form-control" disabled />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Mintiss Balance</label>
                    <input v-model="editUser.mintiss" type="text" class="form-control" disabled />
                  </div>
                </div>
              </div>
              <div class="text-center mt-4">
                <button type="submit" class="btn btn-success px-4 py-2 me-2">
                  <i class="bi bi-save me-2"></i>Save
                </button>
                <button type="button" class="btn btn-secondary px-4 py-2" @click="cancelEdit">
                  <i class="bi bi-x-lg me-2"></i>Cancel
                </button>
              </div>
            </form>
            <div v-else>
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Name</label>
                    <p class="form-control bg-light">{{ user.name }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <p class="form-control bg-light">{{ user.email }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Phone</label>
                    <p class="form-control bg-light">{{ user.phone }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Role</label>
                    <p class="form-control bg-light">{{ user.role }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Mintiss Balance</label>
                    <p class="form-control bg-light">{{ user.mintiss }}</p>
                  </div>
                </div>
              </div>
              <div class="text-center mt-4">
                <button class="btn btn-danger px-4 py-2" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Referral System Card -->
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">
            <!-- Referral Code Section -->
            <div class="row mb-4">
              <div class="col-lg-8">
                <div class="card border-0 bg-light">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3">
                      <i class="bi bi-share me-2 text-primary"></i>
                      Your Referral Code
                    </h5>
                    <div class="input-group mb-3">
                      <input 
                        type="text" 
                        class="form-control form-control-lg fw-bold text-center" 
                        :value="referralCode" 
                        readonly
                        id="referralCodeInput"
                      >
                      <button 
                        class="btn btn-primary btn-lg" 
                        type="button"
                        @click="copyReferralCode"
                        :class="{ 'btn-success': copySuccess }"
                      >
                        <i :class="copySuccess ? 'bi bi-check-lg' : 'bi bi-clipboard'" class="me-2"></i>
                        {{ copySuccess ? 'Copied!' : 'Copy' }}
                      </button>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        @click="shareOnWhatsApp"
                      >
                        <i class="bi bi-whatsapp me-1"></i> WhatsApp
                      </button>
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        @click="shareOnTelegram"
                      >
                        <i class="bi bi-telegram me-1"></i> Telegram
                      </button>
                      <button 
                        class="btn btn-outline-primary btn-sm"
                        @click="shareOnEmail"
                      >
                        <i class="bi bi-envelope me-1"></i> Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- How It Works -->
            <div class="mt-4">
              <h5 class="fw-bold mb-3">
                <i class="bi bi-question-circle me-2 text-primary"></i>
                How It Works
              </h5>
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="card border-0 bg-light h-100">
                    <div class="card-body text-center p-3">
                      <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                        <span class="fw-bold">1</span>
                      </div>
                      <h6 class="fw-bold">Share Your Code</h6>
                      <p class="small text-muted mb-0">Share your unique referral code with friends and family</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card border-0 bg-light h-100">
                    <div class="card-body text-center p-3">
                      <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                        <span class="fw-bold">2</span>
                      </div>
                      <h6 class="fw-bold">They Join</h6>
                      <p class="small text-muted mb-0">Your friends sign up using your referral code</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card border-0 bg-light h-100">
                    <div class="card-body text-center p-3">
                      <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                        <span class="fw-bold">3</span>
                      </div>
                      <h6 class="fw-bold">Earn Rewards</h6>
                      <p class="small text-muted mb-0">Both you and your friend get rewards when they make their first purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';
import referralService from '@/services/referralService';

export default {
  name: 'Profile',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
      editMode: false,
      editUser: {},
      loading: false,
      referralCode: '',
      copySuccess: false,
      referralStats: {
        totalReferrals: 0,
        activeReferrals: 0,
        pendingReferrals: 0,
        thisMonth: 0,
        totalEarnings: 0
      },
      referralHistory: []
    }
  },
  async mounted() {
    this.editUser = { ...this.user };
    await this.fetchReferralData();
  },
  methods: {
    async handleLogout() {
      try {
        await axios.get('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toastService.success('Logged out successfully');
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        toastService.error('Failed to logout');
      }
    },
    editProfile() {
      this.editUser = { ...this.user };
      this.editMode = true;
    },
    cancelEdit() {
      this.editMode = false;
      this.editUser = { ...this.user };
    },
    async saveProfile() {
      this.loading = true;
      try {
        const payload = {
          name: this.editUser.name,
          email: this.editUser.email,
          phone: this.editUser.phone
        };
        const res = await axios.put('/user/profile', payload);
        this.user = { ...this.user, ...payload };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.editMode = false;
        toastService.success('Profile updated successfully');
      } catch (e) {
        toastService.error(e.response?.data?.message || 'Failed to update profile');
      } finally {
        this.loading = false;
      }
    },
    async fetchReferralData() {
      try {
        // Fetch referral code
        const codeResponse = await referralService.getReferralCode();
        
        // Check if the response has referral_code (with underscore) or referralCode (camelCase)
        this.referralCode = codeResponse.referral_code || codeResponse.referralCode || referralService.generateReferralCode();
        
        // Fetch referral statistics
        // const statsResponse = await referralService.getReferralStats();
        // this.referralStats = statsResponse || this.referralStats;
        
        // Fetch referral history
        // const historyResponse = await referralService.getReferralHistory();
        // this.referralHistory = historyResponse || [];
      } catch (error) {
        console.error('Error fetching referral data:', error);
        // Fallback to demo data
        const demoData = referralService.getDemoReferralData();
        this.referralCode = demoData.referralCode;
        this.referralStats = demoData.stats;
        this.referralHistory = demoData.history;
      }
    },
    async copyReferralCode() {
      try {
        await referralService.copyToClipboard(this.referralCode);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (error) {
        console.error('Error copying referral code:', error);
        toastService.error('Failed to copy referral code');
      }
    },
    shareOnWhatsApp() {
      referralService.shareOnWhatsApp(this.referralCode);
    },
    shareOnTelegram() {
      referralService.shareOnTelegram(this.referralCode);
    },
    shareOnEmail() {
      referralService.shareOnEmail(this.referralCode);
    },
    formatDate(dateString) {
      return referralService.formatDate(dateString);
    }
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #1177bf 0%, #0056b3 100%);
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #6c757d;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
  padding: 0.5em 0.75em;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
}
</style> 