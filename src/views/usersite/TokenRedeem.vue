<template>
  <div class="min-vh-100 bg-light">
    <!-- Header Section -->
    <div class="bg-primary text-white py-5 rounded-bottom-4 shadow">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4 fw-bold mb-2">
              <i class="bi bi-coin me-3"></i>
              Gunrate Tokens
            </h1>
            <p class="lead opacity-75 mb-0">Generate and redeem your Gunrate tokens</p>
          </div>
          <div class="col-md-6">
            <div class="row g-3">
              <div class="col-6">
                <div class="bg-white bg-opacity-10 backdrop-blur rounded-4 p-3 border border-white border-opacity-20 text-center">
                  <div class="small opacity-75 mb-1">Active Tokens</div>
                  <div class="fs-2 fw-bold">{{ activeTokensCount }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-white bg-opacity-10 backdrop-blur rounded-4 p-3 border border-white border-opacity-20 text-center">
                  <div class="small opacity-75 mb-1">Used Tokens</div>
                  <div class="fs-2 fw-bold">{{ usedTokensCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mt-4">
      <!-- Generate Token Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="bg-white rounded-4 p-4 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="text-primary fw-semibold mb-0">
                <i class="bi bi-plus-circle me-2"></i>Generate New Token
              </h3>
            </div>
            
            <form @submit.prevent="generateToken" class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Token Value (Mintiss)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  v-model="generateForm.value"
                  placeholder="Enter token value"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Description (Optional)</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="generateForm.description"
                  placeholder="Token description"
                />
              </div>
              <div class="col-md-4 d-flex align-items-end">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="generating"
                >
                  <span v-if="generating">
                    <i class="bi bi-arrow-clockwise spin me-1"></i>
                    Generating...
                  </span>
                  <span v-else>
                    <i class="bi bi-plus-circle me-1"></i>
                    Generate Token
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Token List Section -->
        <div class="col-lg-8">
          <div class="bg-white rounded-4 p-4 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="text-primary fw-semibold mb-0">
                <i class="bi bi-list-ul me-2"></i>Token History
              </h3>
              <div class="d-flex gap-2">
                <button 
                  @click="setActiveTab('all')" 
                  class="btn btn-sm"
                  :class="activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                >
                  All
                </button>
                <button 
                  @click="setActiveTab('active')" 
                  class="btn btn-sm"
                  :class="activeTab === 'active' ? 'btn-primary' : 'btn-outline-primary'"
                >
                  Active
                </button>
                <button 
                  @click="setActiveTab('used')" 
                  class="btn btn-sm"
                  :class="activeTab === 'used' ? 'btn-primary' : 'btn-outline-primary'"
                >
                  Used
                </button>
                <button @click="refreshTokens" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-arrow-clockwise me-1"></i>Refresh
                </button>
              </div>
            </div>
            
            <div v-if="loading" class="text-center py-5 text-muted">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading your tokens...</p>
            </div>

            <div v-else-if="userTokens.length === 0" class="text-center py-5 text-muted">
              <div class="display-1 text-muted mb-3">
                <i class="bi bi-coin"></i>
              </div>
              <h4>No Tokens Available</h4>
              <p>You don't have any Gunrate tokens to redeem at the moment.</p>
            </div>

            <div v-else class="row g-3">
              <div 
                v-for="token in filteredTokens" 
                :key="token.id" 
                class="col-md-6 col-lg-4"
              >
                <div 
                  class="card h-100 border-2"
                  :class="{ 
                    'border-primary bg-light': selectedToken?.id === token.id,
                    'border-light': selectedToken?.id !== token.id
                  }"
                >
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="fw-bold text-primary fs-5">#{{ token.token }}</div>
                      <span 
                        class="badge rounded-pill px-3 py-2"
                        :class="getStatusClass(token.status)"
                      >
                        {{ token.status }}
                      </span>
                    </div>
                    
                    <div class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted small">Value:</span>
                        <span class="fw-bold text-primary fs-6">₹{{ (token.value * mintissValue).toFixed(2) }}</span>
                      </div>
                      <div class="text-muted small mb-1">
                        <i class="bi bi-calendar3 me-1"></i>
                        Created: {{ formatDate(token.created_at) }}
                      </div>
                      <div v-if="token.used_at" class="text-muted small">
                        <i class="bi bi-check-circle me-1"></i>
                        Used: {{ formatDate(token.used_at) }}
                      </div>
                      <div v-if="token.description" class="text-muted small mt-1">
                        <i class="bi bi-info-circle me-1"></i>
                        {{ token.description }}
                      </div>
                    </div>
                    

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Redeem Form Section -->
        <div class="col-lg-4">
          <div class="position-sticky" style="top: 2rem;">
            <div class="bg-white rounded-4 p-4 shadow-sm mb-3">
              <h4 class="text-primary fw-semibold mb-4">
                <i class="bi bi-gift me-2"></i>Redeem Token
              </h4>
              <div class="text-center py-4 text-muted">
                <div class="display-4 text-muted mb-3">
                  <i class="bi bi-info-circle"></i>
                </div>
                <p>View your token history and statistics</p>
              </div>
            </div>

            <!-- Stats Section -->
            <div class="bg-white rounded-4 p-4 shadow-sm">
              <h5 class="text-primary fw-semibold mb-3">
                <i class="bi bi-graph-up me-2"></i>Token Statistics
              </h5>
              <div class="row g-3">
                <div class="col-6">
                  <div class="bg-light rounded-3 p-3 text-center">
                    <div class="fs-3 fw-bold text-primary mb-1">₹{{ totalTokensValueInRs }}</div>
                    <div class="small text-muted fw-medium">Total Value</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="bg-light rounded-3 p-3 text-center">
                    <div class="fs-3 fw-bold text-primary mb-1">₹{{ totalRedeemedValueInRs }}</div>
                    <div class="small text-muted fw-medium">Redeemed Value</div>
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
import gunrateTokenService from "@/services/gunrateTokenService";
import toastService from "@/services/toastService";
import axios from "@/axios";
import emitter from '@/eventBus';

export default {
  name: "TokenRedeem",
  data() {
    return {
      userTokens: [],
      selectedToken: null,
      tokenStats: {},
      loading: false,
      redeeming: false,
      generating: false,
      activeTab: 'all',
      mintissValue: 0,
      generateForm: {
        value: "",
        description: ""
      }
    };
  },
  computed: {
    
    activeTokensCount() {
      return this.userTokens.filter(token => token.status === 'generated').length;
    },
    
    usedTokensCount() {
      return this.userTokens.filter(token => token.status === 'used').length;
    },
    
    filteredTokens() {
      switch (this.activeTab) {
        case 'active':
          return this.userTokens.filter(token => token.status === 'generated');
        case 'used':
          return this.userTokens.filter(token => token.status === 'used');
        default:
          return this.userTokens;
      }
    },
    
    totalTokensValue() {
      return this.userTokens.reduce((total, token) => total + parseFloat(token.value || 0), 0).toFixed(2);
    },
    
    totalRedeemedValue() {
      return this.userTokens
        .filter(token => token.status === 'used')
        .reduce((total, token) => total + parseFloat(token.value || 0), 0)
        .toFixed(2);
    },
    
    totalTokensValueInRs() {
      return (this.totalTokensValue * this.mintissValue).toFixed(2);
    },
    
    totalRedeemedValueInRs() {
      return (this.totalRedeemedValue * this.mintissValue).toFixed(2);
    }
  },
  async mounted() {
    await this.fetchMintissValue();
    await this.loadUserTokens();
    await this.loadTokenStats();
  },
  methods: {
    async loadUserTokens() {
      this.loading = true;
      try {
        this.userTokens = await gunrateTokenService.getUserTokens();
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadTokenStats() {
      try {
        this.tokenStats = await gunrateTokenService.getTokenStats();
      } catch (error) {
        console.error("Error loading token stats:", error);
      }
    },
    
    async fetchMintissValue() {
      try {
        const response = await axios.get("/mintiss-value/latest");
        this.mintissValue = parseFloat(response.data.data.value);
      } catch (error) {
        console.error("Error fetching mintiss value:", error);
        this.mintissValue = 1; // Default value
      }
    },
    

    
    async confirmRedeem() {
      if (!this.selectedToken) {
        toastService.error("Please select a token to redeem");
        return;
      }
      
      this.redeeming = true;
      try {
        const result = await gunrateTokenService.useToken(this.selectedToken.token);
        
        // Refresh data
        await this.loadUserTokens();
        await this.loadTokenStats();
        
        // Reset selection
        this.selectedToken = null;
        
        // Update user balance in localStorage
        this.updateUserBalance(result?.mintiss_added || 0);
        
      } catch (error) {
        console.error("Error redeeming token:", error);
      } finally {
        this.redeeming = false;
      }
    },
    
    async refreshTokens() {
      await this.loadUserTokens();
      await this.loadTokenStats();
    },
    
    async generateToken() {
      this.generating = true;
      try {
        const result = await gunrateTokenService.generateToken({
          value: this.generateForm.value,
          description: this.generateForm.description
        });
        
        // Show generated token code
        if (result && result.token) {
          toastService.success(`Token generated successfully! Code: ${result.token}`);
        }
        
        // Reset form
        this.generateForm = {
          value: "",
          description: ""
        };
        
        // Refresh tokens
        await this.loadUserTokens();
        
      } catch (error) {
        console.error("Error generating token:", error);
      } finally {
        this.generating = false;
      }
    },
    
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'generated': return 'bg-success text-white';
        case 'used': return 'bg-danger text-white';
        case 'expired': return 'bg-warning text-dark';
        default: return 'bg-secondary text-white';
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    updateUserBalance(mintissAdded) {
      const updatedUser = gunrateTokenService.updateUserBalance(mintissAdded);
      if (updatedUser) {
        // Emit event to update navbar balance
        emitter.emit('balance-updated');
      }
    }
  }
};
</script>

<style scoped>
/* Custom theme color override for Bootstrap */
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

/* Custom cursor for clickable cards */
.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 55, 191, 0.15) !important;
}

/* Spinning animation for loading */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Backdrop blur for glass effect */
.backdrop-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style> 