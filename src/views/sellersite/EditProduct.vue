<template>
  <div class="container py-4">
    <div class="seller-card">
      <div class="seller-header">
        <h3 class="seller-title"><i class="bi bi-pencil-square"></i> Edit Product</h3>
        <p class="seller-subtitle">Update your product details to attract more buyers!</p>
      </div>
      <div class="card-body p-4">
        <form v-if="loaded" @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="mb-3">
            <label class="seller-form-label">Name</label>
            <input v-model="form.name" type="text" class="form-control" required placeholder="Product Name" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Description</label>
            <textarea v-model="form.description" class="form-control" required placeholder="Describe your product"></textarea>
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Price <span class="text-muted">(optional)</span></label>
            <input v-model="form.price" type="number" step="0.01" class="form-control" placeholder="e.g. 499.00" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Canceled Price <span class="text-muted">(optional)</span></label>
            <input v-model="form.canceled_price" type="number" step="0.01" class="form-control" placeholder="e.g. 799.00" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Purchase URL</label>
            <input v-model="form.purchase_url" type="url" class="form-control" required placeholder="https://yourstore.com/product" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">CTA Label</label>
            <input v-model="form.cta_label" type="text" class="form-control" required placeholder="e.g. Buy Now, Shop Now" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Unique Code</label>
            <input v-model="form.unique_code" type="text" class="form-control" required placeholder="Unique product code" />
          </div>
          <div class="mb-3">
            <label class="seller-form-label">Images</label>
            <input ref="imageInput" type="file" class="form-control" multiple @change="handleImageChange" accept="image/*" />
            <!-- <div class="form-text">Recommended image size: <span class="text-success">650x450px</span> for best appearance.</div> -->
            <div class="mt-2 d-flex flex-wrap">
              <img v-for="(img, i) in previewImages" :key="i" :src="img" class="seller-preview-img" />
            </div>
            <div v-if="existingImages.length" class="mt-2">
              <span class="seller-form-label">Existing Images:</span>
              <div class="d-flex flex-wrap">
                <img v-for="(img, i) in existingImages" :key="i" :src="img" class="seller-preview-img" />
              </div>
            </div>
          </div>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div class="d-flex justify-content-between align-items-center mt-4">
            <button type="submit" class="seller-btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Update Product
            </button>
            <router-link to="/seller/products" class="btn seller-btn-secondary ms-2" :disabled="loading">Cancel</router-link>
          </div>
        </form>
        <div v-else class="text-center py-5">
          <div class="spinner-border text-success"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
export default {
  name: 'EditProduct',
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
      existingImages: [],
      error: '',
      loaded: false,
      loading: false
    };
  },
  async mounted() {
    await this.fetchProduct();
  },
  methods: {
    async fetchProduct() {
      this.loaded = false;
      try {
        const token = localStorage.getItem('token');
        const id = this.$route.params.id;
        const res = await axios.get(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const p = res.data.data || res.data;
        this.form = {
          name: p.name,
          description: p.description,
          price: p.price,
          canceled_price: p.canceled_price,
          purchase_url: p.purchase_url,
          cta_label: p.cta_label,
          unique_code: p.unique_code,
          images: []
        };
        this.existingImages = Array.isArray(p.images) ? p.images : (p.images ? p.images.split(',') : []);
        this.previewImages = [];
        this.loaded = true;
      } catch (e) {
        this.error = 'Failed to load product.';
      }
    },
    handleImageChange(e) {
      this.form.images = Array.from(e.target.files);
      this.previewImages = this.form.images.map(file => URL.createObjectURL(file));
    },
    async submitForm() {
      this.error = '';
      this.loading = true;

      // Ensure price and canceled_price are 0 if empty or null
      if (!this.form.price) this.form.price = 0;
      if (!this.form.canceled_price) this.form.canceled_price = 0;

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
        const id = this.$route.params.id;
        await axios.post(`/products/${id}?_method=PUT`, formData, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        this.$router.push('/seller/products');
      } catch (e) {
        this.error = e.response?.data?.message || 'Failed to update product.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.seller-card {
  max-width: 650px;
  margin: 2rem auto;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(40, 167, 69, 0.08);
  background: #f8fbff;
  overflow: hidden;
  animation: fadeInUp 0.7s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.seller-header {
  background: linear-gradient(90deg, #28a745 0%, #1177bf 100%);
  color: #fff;
  text-align: center;
  padding: 2rem 1rem 1rem 1rem;
  border-radius: 1rem 1rem 0 0;
}
.seller-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.seller-subtitle {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.85;
}
.seller-form-label {
  color: #1177bf;
  font-weight: 600;
}
.seller-btn-primary {
  background: linear-gradient(90deg, #28a745 0%, #1177bf 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  padding: 0.75rem 2rem;
  transition: background 0.3s;
}
.seller-btn-primary:hover, .seller-btn-primary:focus {
  background: linear-gradient(90deg, #1177bf 0%, #28a745 100%);
  color: #fff;
}
.seller-btn-secondary {
  border-radius: 0.5rem;
  font-weight: 600;
}
.seller-preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 8px;
  border-radius: 0.5rem;
  border: 2px solid #28a745;
}
</style>