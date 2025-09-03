<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow-lg border-0 rounded-4 mb-4">
          <div
            class="card-header bg-primary text-white rounded-top-4 p-4 d-flex align-items-center justify-content-between">
            <h2 class="mb-0 fs-3">Profile Information</h2>
            <button v-if="!editMode" class="btn btn-light btn-sm fw-bold" @click="editMode = true">
              <i class="bi bi-pencil me-1"></i> Edit
            </button>
          </div>

          <div class="card-body p-4">
            <!-- Edit Mode -->
            <form v-if="editMode" @submit.prevent="saveProfile">
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Name</label>
                  <input v-model="editUser.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email</label>
                  <input v-model="editUser.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Phone</label>
                  <input v-model="editUser.phone" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Role</label>
                  <input v-model="editUser.role" type="text" class="form-control" disabled />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Mintiss Balance</label>
                  <input v-model="editUser.mintiss" type="text" class="form-control" disabled />
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

            <!-- View Mode -->
            <div v-else>
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Name</label>
                  <p class="form-control bg-light">{{ user.name }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email</label>
                  <p class="form-control bg-light">{{ user.email }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Phone</label>
                  <p class="form-control bg-light">{{ user.phone }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Role</label>
                  <p class="form-control bg-light">{{ user.role }}</p>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Mintiss Balance</label>
                  <p class="form-control bg-light">{{ user.mintiss }}</p>
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
  name: 'Profile',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
      editMode: false,
      editUser: {},
      loading: false
    };
  },
  mounted() {
    this.editUser = { ...this.user };
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
        toastService.error('Failed to logout');
      }
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
        await axios.put('/user/profile', payload);
        this.user = { ...this.user, ...payload };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.editMode = false;
        toastService.success('Profile updated successfully');
      } catch (e) {
        toastService.error(e.response?.data?.message || 'Failed to update profile');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
