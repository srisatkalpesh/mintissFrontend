<template>
  <div class="container py-4">
    <div class="card shadow-lg border-0 mx-auto add-product-card">
      <div class="card-header text-white text-center"
        style="background: linear-gradient(90deg, #28a745 0%, #1177bf 100%); border-radius: 1rem 1rem 0 0;">
        <h3 class="mb-0">Add Product</h3>
        <p class="mb-0 small">Showcase your best products to Mintiss buyers!</p>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="mb-3">
            <label class="form-label fw-semibold">Name</label>
            <input v-model="form.name" type="text" class="form-control" required placeholder="Product Name" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Description</label>
            <textarea v-model="form.description" class="form-control" required
              placeholder="Describe your product"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Category</label>
            <select v-model="form.category_id" class="form-select" required>
              <option value="" disabled>Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Price <span class="text-muted">(optional)</span></label>
            <input v-model="form.price" type="number" step="0.01" class="form-control" placeholder="e.g. 499.00" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Canceled Price <span class="text-muted">(optional)</span></label>
            <input v-model="form.canceled_price" type="number" step="0.01" class="form-control"
              placeholder="e.g. 799.00" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Unique Code</label>
            <input v-model="form.unique_code" type="text" class="form-control" required
              placeholder="Unique product code" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Mintiss <span class="text-muted">(optional)</span></label>
            <input v-model="form.mintiss" type="number" class="form-control" placeholder="Enter mintiss point" />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Images</label>
            <input ref="imageInput" type="file" class="form-control" multiple @change="handleImageChange"
              accept="image/*" />
            <div class="mt-2 d-flex flex-wrap">
              <img v-for="(img, i) in previewImages" :key="i" :src="img" class="preview-img" />
            </div>
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div class="d-flex justify-content-between align-items-center mt-4">
            <button type="submit" class="btn btn-success fw-bold px-4" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Add Product
            </button>
            <router-link to="/seller/products" class="btn btn-outline-secondary ms-2"
              :disabled="loading">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
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
        category_id: '',
        price: '',
        canceled_price: '',
        unique_code: '',
        mintiss: '',
        images: []
      },
      categories: [],
      previewImages: [],
      error: '',
      loading: false
    };
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await axios.get('/categories');
        this.categories = res.data.data || res.data || [];
      } catch (e) {
        console.error('Failed to fetch categories.');
      }
    },
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

<style scoped>
.add-product-card {
  max-width: 600px;
  border-radius: 1rem;
  overflow: hidden;
  animation: fadeInUp 0.7s;
  background: #f8fbff;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  border-bottom: none;
}

.form-label {
  color: #1177bf;
  font-weight: 600;
}

.preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 8px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.15);
  border: 2px solid #28a745;
}

.btn-success {
  background: linear-gradient(90deg, #28a745 0%, #1177bf 100%);
  border: none;
}

.btn-success:focus,
.btn-success:hover {
  background: linear-gradient(90deg, #1177bf 0%, #28a745 100%);
}
</style>
