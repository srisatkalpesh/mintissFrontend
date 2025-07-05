<template>
  <div class="container py-4">
    <h3>Add Product</h3>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="form.name" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea v-model="form.description" class="form-control" required></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Price</label>
        <input v-model="form.price" type="number" step="0.01" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Canceled Price</label>
        <input v-model="form.canceled_price" type="number" step="0.01" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Purchase URL</label>
        <input v-model="form.purchase_url" type="url" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">CTA Label</label>
        <input v-model="form.cta_label" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Unique Code</label>
        <input v-model="form.unique_code" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Images</label>
        <input ref="imageInput" type="file" class="form-control" multiple @change="handleImageChange" accept="image/*" />
        <div class="mt-2 d-flex flex-wrap">
          <img v-for="(img, i) in previewImages" :key="i" :src="img" style="width:60px;height:60px;object-fit:cover;margin-right:5px;" />
        </div>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Add Product
      </button>
      <router-link to="/seller/products" class="btn btn-secondary ms-2" :disabled="loading">Cancel</router-link>
    </form>
  </div>
</template>

<script>
import axios from '@/axios';
export default {
  name: 'AddProduct',
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: '',
        canceled_price: '',
        purchase_url: '',
        cta_label: '',
        unique_code: '',
        images: []
      },
      previewImages: [],
      error: '',
      loading: false
    };
  },
  methods: {
    handleImageChange(e) {
      this.form.images = Array.from(e.target.files);
      this.previewImages = this.form.images.map(file => URL.createObjectURL(file));
    },
    async submitForm() {
      this.error = '';
      this.loading = true;
      const formData = new FormData();
      for (const key in this.form) {
        if (key === 'images') {
          this.form.images.forEach((img, i) => formData.append('images[]', img));
        } else {
          formData.append(key, this.form[key]);
        }
      }
      try {
        const token = localStorage.getItem('token');
        await axios.post('/products', formData, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        this.$router.push('/seller/products');
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to add product.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script> 