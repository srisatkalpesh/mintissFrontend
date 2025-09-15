<template>
  <div class="mintiss-values-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-currency-dollar-fill me-3"></i>
            Mintiss Values Management
          </h1>
          <p class="page-subtitle">Manage mintiss currency values and rates</p>
        </div>
      </div>
    </div>

    <div class="content-section">
    
      <!-- Add/Edit Form -->
      <div class="form-card">
        <div class="form-header">
          <h2 class="form-title">
            <i class="bi bi-plus-circle me-2"></i>
            {{ isEditing ? 'Edit' : 'Add' }} Mintiss Value
          </h2>
        </div>
        <div class="form-body">
          <form @submit.prevent="handleSubmit" class="modern-form">
            <div class="form-group">
              <label for="value" class="form-label">
                <i class="bi bi-123 me-1"></i>
                Value
              </label>
              <input
                v-model="formData.value"
                type="number"
                step="any"
                class="form-input"
                id="value"
                required
                :disabled="isSubmitting"
                placeholder="Enter mintiss value"
              />
            </div>
            <div class="form-actions">
              <button
                type="button"
                @click="resetForm"
                class="btn-secondary"
                :disabled="isSubmitting"
              >
                <i class="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSubmitting"
              >
                <i class="bi bi-check-circle me-2"></i>
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Values List -->
      <div class="values-card">
        <div class="values-header">
          <h2 class="values-title">
            <i class="bi bi-list-ul me-2"></i>
            Current Value
          </h2>
        </div>
        <div class="values-body">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>
          <div v-else class="value-display">
            <div v-if="mintissValue" class="value-item">
              <div class="value-info">
                <div class="value-label">Current Mintiss Value</div>
                <div class="value-amount">{{ parseFloat(mintissValue.value).toFixed(8) }}</div>
                <div class="value-date">{{ formatDate(mintissValue.created_at) }}</div>
              </div>
              <div class="value-icon">
                <i class="bi bi-currency-dollar"></i>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="bi bi-inbox"></i>
              <p>No value available</p>
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
  name: 'MintissValues',
  data() {
    return {
      mintissValue: null,
      formData: {
        value: ''
      },
      isEditing: false,
      editingId: null,
      isLoading: false,
      isSubmitting: false
    };
  },
  created() {
    this.fetchValue();
  },
  methods: {
    async fetchValue() {
      try {
        const response = await loaderService.withLoader(
          () => axios.get(`/mintiss-value/latest`),
          'Loading mintiss value...'
        );
        this.mintissValue = response.data.data;
      } catch (error) {
        console.error('Error fetching mintiss value:', error);
        toastService.error('Failed to fetch mintiss value');
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await loaderService.withLoader(
            () => axios.put(`/admin/mintiss-value`, this.formData),
            'Updating mintiss value...'
          );
        } else {
          await loaderService.withLoader(
            () => axios.post(`/admin/mintiss-value`, this.formData),
            'Creating mintiss value...'
          );
        }
        toastService.success('Mintiss value saved successfully');
        this.resetForm();
        this.fetchValue();
      } catch (error) {
        console.error('Error saving mintiss value:', error);
        toastService.error('Failed to save mintiss value');
      }
    },
    resetForm() {
      this.isEditing = false;
      this.editingId = null;
      this.formData = {
        value: ''
      };
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.mintiss-values-page {
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

/* Content Section */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.form-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.form-body {
  padding: 2rem;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.form-input {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Values Card */
.values-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.values-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.values-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.values-body {
  padding: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.value-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.value-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.value-info {
  flex: 1;
}

.value-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.value-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.25rem;
}

.value-date {
  font-size: 0.85rem;
  color: #9ca3af;
}

.value-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #9ca3af;
}

.empty-state i {
  font-size: 3rem;
  opacity: 0.5;
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
  
  .content-section {
    padding: 0 1rem 2rem;
  }
  
  .form-body,
  .values-body {
    padding: 1.5rem;
  }
  
  .form-header,
  .values-header {
    padding: 1rem 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .value-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .value-amount {
    font-size: 1.5rem;
  }
}
</style> 