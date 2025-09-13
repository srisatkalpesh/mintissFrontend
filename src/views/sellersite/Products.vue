<template>
  <div class="container py-4">
    <CrudTable
      title="My Products"
      :columns="columns"
      :items="products"
      :loading="loading"
      @add="goToAdd"
      @edit="goToEdit"
      @delete="deleteProduct"
    />
  </div>
</template>

<script>
import CrudTable from '@/components/CrudTable.vue';
import axios from '@/axios';

export default {
  name: 'SellerProducts',
  components: { CrudTable },
  data() {
    return {
      products: [],
      loading: false,
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'canceled_price', label: 'Canceled Price' },
        { key: 'unique_code', label: 'Unique Code' },
        { key: 'mintiss', label: 'Mintiss' }, 
        { key: 'images', label: 'Images', render: item => (item.images ? item.images.map(img => `<img src='${img}' style='width:40px;height:40px;object-fit:cover;margin-right:2px;'/>`).join('') : '') },
        { key: 'actions', label: 'Actions', class: 'text-end' }
      ]
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/products', { headers: { Authorization: `Bearer ${token}` } });
        let products = res.data.products || [];
        this.products = products.map(p => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : (p.images ? p.images.split(',') : []),
          mintiss: p.mintiss || ''
        }));
      } catch (e) {
        console.error('Failed to fetch products.', e);
      } finally {
        this.loading = false;
      }
    },
    goToAdd() {
      this.$router.push('/seller/products/add');
    },
    goToEdit(product) {
      this.$router.push(`/seller/products/${product.id}/edit`);
    },
    async deleteProduct(product) {
      if (!confirm('Are you sure you want to delete this product?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/products/${product.id}`, { headers: { Authorization: `Bearer ${token}` } });
        this.fetchProducts();
      } catch (e) {
        console.error('Failed to delete product.', e);
      }
    }
  }
};
</script>

<style scoped>
.modal.show.d-block {
  display: block;
  background: rgba(0,0,0,0.3);
}
</style>
