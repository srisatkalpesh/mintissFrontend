<template>
  <div class="container mt-4">
    <h1 class="mb-4">Signup Bonus</h1>
    
    <!-- Add/Edit Form -->
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="h4 mb-0">{{ isEditing ? 'Edit' : 'Add' }} Signup Bonus</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="value" class="form-label">Value</label>
            <input
              v-model="formData.value"
              type="number"
              step="any"
              class="form-control"
              id="value"
              required
              :disabled="isSubmitting"
            />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button
              type="button"
              @click="resetForm"
              class="btn btn-secondary"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Values List -->
    <div class="card">
      <div class="card-header">
        <h2 class="h4 mb-0">Current Value</h2>
      </div>
      <div class="card-body">
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Value</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="signupBonus">
                <td>{{ parseFloat(signupBonus.value).toFixed(8) }}</td>
                <td>{{ formatDate(signupBonus.created_at) }}</td>
              </tr>
              <tr v-else>
                <td colspan="2" class="text-center">No value available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'SignupBonus',
  data() {
    return {
      signupBonus: null,
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
      this.isLoading = true;
      try {
        const response = await axios.get(`/admin/signup-Referral`);
        this.signupBonus = response.data.data;
      } catch (error) {
        console.error('Error fetching signup bonus:', error);
        // Add error handling/notification here
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;
      try {
        if (this.isEditing) {
          await axios.put(`/admin/signup-Referral`, this.formData);
        } else {
          await axios.post(`/admin/signup-Referral`, this.formData);
        }
        this.resetForm();
        this.fetchValue();
      } catch (error) {
        console.error('Error saving signup bonus:', error);
        // Add error handling/notification here
      } finally {
        this.isSubmitting = false;
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

