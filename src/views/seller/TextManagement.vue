<template>
  <div class="text-management-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-type-fill me-3"></i>
            Text Management
          </h1>
          <p class="page-subtitle">Manage text pricing and customization options for your products</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-percent"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ textSettings.percentage || 0 }}%</div>
              <div class="stat-label">Text Percentage</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-toggle-on" v-if="textSettings.include_in_price"></i>
              <i class="bi bi-toggle-off" v-else></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ textSettings.include_in_price ? 'Yes' : 'No' }}</div>
              <div class="stat-label">Include in Price</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <!-- Text Settings Form -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="bi bi-gear-fill me-2"></i>
            Text Pricing Settings
          </h2>
          <p class="card-subtitle">Configure how text customization affects product pricing</p>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleSaveSettings" class="settings-form">
            <div class="form-grid">
              <!-- Percentage Setting -->
              <div class="form-group">
                <label for="percentage" class="form-label">
                  <i class="bi bi-percent me-1"></i>
                  Text Percentage (%)
                </label>
                <div class="input-group">
                  <input
                    id="percentage"
                    v-model="formData.percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="form-input"
                    placeholder="Enter percentage"
                    required
                  />
                  <span class="input-suffix">%</span>
                </div>
                <div class="form-help">
                  This percentage will be added to the base product price when text is included
                </div>
              </div>

              <!-- Include in Price Toggle -->
              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-calculator me-1"></i>
                  Include Text in Price Calculation
                </label>
                <div class="toggle-container">
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      v-model="formData.include_in_price"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <div class="toggle-info">
                    <div class="toggle-label">
                      {{ formData.include_in_price ? 'Text will be included in price' : 'Text will be excluded from price' }}
                    </div>
                    <div class="toggle-description">
                      When enabled, the text percentage will be automatically added to product prices
                    </div>
                  </div>
                </div>
              </div>

              <!-- Price Preview -->
              <div class="form-group preview-group">
                <label class="form-label">
                  <i class="bi bi-eye me-1"></i>
                  Price Preview
                </label>
                <div class="price-preview">
                  <div class="preview-item">
                    <span class="preview-label">Base Product Price:</span>
                    <span class="preview-value">₹{{ previewData.basePrice }}</span>
                  </div>
                  <div class="preview-item" v-if="formData.include_in_price">
                    <span class="preview-label">Text Addition ({{ formData.percentage }}%):</span>
                    <span class="preview-value">₹{{ previewData.textAddition }}</span>
                  </div>
                  <div class="preview-divider"></div>
                  <div class="preview-item total">
                    <span class="preview-label">Final Price:</span>
                    <span class="preview-value">₹{{ previewData.finalPrice }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn-secondary">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Reset
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <i class="bi bi-check-circle me-2"></i>
                {{ saving ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Text Examples -->
      <div class="examples-card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="bi bi-lightbulb me-2"></i>
            Text Customization Examples
          </h2>
          <p class="card-subtitle">See how text pricing works with different scenarios</p>
        </div>
        <div class="card-body">
          <div class="examples-grid">
            <div class="example-item">
              <div class="example-header">
                <h4>Personalized Mug</h4>
                <span class="example-price">₹{{ calculateExamplePrice(299) }}</span>
              </div>
              <div class="example-details">
                <p><strong>Base Price:</strong> ₹299</p>
                <p><strong>Text:</strong> "Happy Birthday John!"</p>
                <p><strong>Calculation:</strong> ₹299 + {{ formData.percentage }}% = ₹{{ calculateExamplePrice(299) }}</p>
              </div>
            </div>

            <div class="example-item">
              <div class="example-header">
                <h4>Custom T-Shirt</h4>
                <span class="example-price">₹{{ calculateExamplePrice(599) }}</span>
              </div>
              <div class="example-details">
                <p><strong>Base Price:</strong> ₹599</p>
                <p><strong>Text:</strong> "Team Awesome"</p>
                <p><strong>Calculation:</strong> ₹599 + {{ formData.percentage }}% = ₹{{ calculateExamplePrice(599) }}</p>
              </div>
            </div>

            <div class="example-item">
              <div class="example-header">
                <h4>Engraved Keychain</h4>
                <span class="example-price">₹{{ calculateExamplePrice(149) }}</span>
              </div>
              <div class="example-details">
                <p><strong>Base Price:</strong> ₹149</p>
                <p><strong>Text:</strong> "Love Always"</p>
                <p><strong>Calculation:</strong> ₹149 + {{ formData.percentage }}% = ₹{{ calculateExamplePrice(149) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings History -->
      <div class="history-card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="bi bi-clock-history me-2"></i>
            Settings History
          </h2>
          <p class="card-subtitle">Track changes to your text pricing settings</p>
        </div>
        <div class="card-body">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading history...</p>
          </div>
          <div v-else-if="settingsHistory.length === 0" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>No settings history found</p>
          </div>
          <div v-else class="history-list">
            <div
              v-for="history in settingsHistory"
              :key="history.id"
              class="history-item"
            >
              <div class="history-main">
                <div class="history-info">
                  <div class="history-percentage">{{ history.percentage }}%</div>
                  <div class="history-include">
                    <i :class="history.include_in_price ? 'bi bi-toggle-on text-success' : 'bi bi-toggle-off text-muted'"></i>
                    {{ history.include_in_price ? 'Included' : 'Excluded' }}
                  </div>
                </div>
                <div class="history-date">{{ formatDate(history.created_at) }}</div>
              </div>
              <div class="history-actions">
                <button
                  v-if="history.id !== textSettings.id"
                  @click="restoreSettings(history)"
                  class="btn-restore"
                  title="Restore this setting"
                >
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
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
import loaderService from '@/services/loaderService';
import toastService from '@/services/toastService';

export default {
  name: 'TextManagement',
  data() {
    return {
      textSettings: {
        percentage: 0,
        include_in_price: false
      },
      formData: {
        percentage: 0,
        include_in_price: false
      },
      settingsHistory: [],
      loading: false,
      saving: false,
      previewData: {
        basePrice: 500,
        textAddition: 0,
        finalPrice: 500
      }
    };
  },
  watch: {
    'formData.percentage': {
      handler() {
        this.updatePreview();
      },
      immediate: true
    },
    'formData.include_in_price': {
      handler() {
        this.updatePreview();
      },
      immediate: true
    }
  },
  async mounted() {
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/seller/text-settings'),
          'Loading text settings...'
        );
        
        if (response.data.status) {
          this.textSettings = response.data.data;
          this.formData = { ...response.data.data };
          this.updatePreview();
        }
      } catch (error) {
        console.error('Error loading text settings:', error);
        toastService.error('Failed to load text settings');
      }
    },

    async loadSettingsHistory() {
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/seller/text-settings/history'),
          'Loading settings history...'
        );
        
        if (response.data.status) {
          this.settingsHistory = response.data.data;
        }
      } catch (error) {
        console.error('Error loading settings history:', error);
      }
    },

    async handleSaveSettings() {
      try {
        this.saving = true;
        
        const response = await loaderService.withLoader(
          () => axios.post('/seller/text-settings', this.formData),
          'Saving text settings...'
        );
        
        if (response.data.status) {
          this.textSettings = { ...this.formData };
          toastService.success('Text settings saved successfully');
          await this.loadSettingsHistory();
        } else {
          toastService.error(response.data.message || 'Failed to save settings');
        }
      } catch (error) {
        console.error('Error saving text settings:', error);
        toastService.error('Failed to save text settings');
      } finally {
        this.saving = false;
      }
    },

    async restoreSettings(history) {
      if (!confirm('Are you sure you want to restore these settings?')) return;
      
      try {
        this.formData = {
          percentage: history.percentage,
          include_in_price: history.include_in_price
        };
        
        await this.handleSaveSettings();
        toastService.success('Settings restored successfully');
      } catch (error) {
        console.error('Error restoring settings:', error);
        toastService.error('Failed to restore settings');
      }
    },

    resetForm() {
      this.formData = { ...this.textSettings };
      this.updatePreview();
    },

    updatePreview() {
      const basePrice = this.previewData.basePrice;
      const percentage = parseFloat(this.formData.percentage) || 0;
      
      this.previewData.textAddition = this.formData.include_in_price 
        ? Math.round((basePrice * percentage) / 100)
        : 0;
      
      this.previewData.finalPrice = basePrice + this.previewData.textAddition;
    },

    calculateExamplePrice(basePrice) {
      const percentage = parseFloat(this.formData.percentage) || 0;
      const textAddition = this.formData.include_in_price 
        ? Math.round((basePrice * percentage) / 100)
        : 0;
      return basePrice + textAddition;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.text-management-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Cards */
.settings-card,
.examples-card,
.history-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.card-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.card-body {
  padding: 2rem;
}

/* Form Styles */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-group {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-suffix {
  position: absolute;
  right: 1rem;
  color: #6b7280;
  font-weight: 500;
  pointer-events: none;
}

.form-help {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Toggle Switch */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-info {
  flex: 1;
}

.toggle-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.toggle-description {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Price Preview */
.price-preview {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.preview-item.total {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.preview-label {
  color: #374151;
}

.preview-value {
  font-weight: 600;
  color: #1e293b;
}

.preview-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Examples Grid */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.example-item {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: transform 0.3s ease;
}

.example-item:hover {
  transform: translateY(-2px);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.example-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.example-price {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.2rem;
}

.example-details p {
  margin: 0.5rem 0;
  color: #64748b;
  font-size: 0.9rem;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: transform 0.3s ease;
}

.history-item:hover {
  transform: translateY(-1px);
}

.history-main {
  flex: 1;
}

.history-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.history-percentage {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.1rem;
}

.history-include {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.history-date {
  color: #9ca3af;
  font-size: 0.85rem;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-restore {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-restore:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state i {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-section {
    padding: 0 1rem 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .toggle-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .history-actions {
    align-self: flex-end;
  }
}
</style>
