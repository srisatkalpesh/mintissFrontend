<template>
  <div class="outer-view">
    <div class="container p-5">
      <h3 class="mb-4">Edit Category</h3>
      <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label for="name" class="form-label">Category Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            required
          />
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="status" class="form-label">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="form-select"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success">Update</button>
        <router-link to="/admin/categories" class="btn btn-secondary ms-2">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: 'active'
      },
      errors: {}
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const { data } = await axios.get(`/categories/${id}`);
      this.form = {
        name: data.name,
        description: data.description,
        status: data.status
      };
    } catch {
      toastService.error('Failed to load category');
      this.$router.push('/admin/categories');
    }
  },
  methods: {
    async handleSubmit() {
      this.errors = {};
      if (!this.form.name) {
        this.errors.name = 'Category name is required';
        return;
      }
      try {
        await axios.put(`/categories/${this.$route.params.id}`, this.form);
        toastService.success('Category updated successfully');
        this.$router.push('/admin/categories');
      } catch {
        toastService.error('Failed to update category');
      }
    }
  }
};
</script>

<style scoped>
.outer-view {
  padding: 32px;
  margin: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
</style>