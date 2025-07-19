<template>
  <div class="sellers-page">
    <div class="header-section">
      <h1>Sellers</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Sellers:</span>
          <span class="stat-value">{{ totalSellers }}</span>
        </div>
      </div>
    </div>

    <div class="sellers-section">
      <CrudTable
        title=""
        :columns="columns"
        :items="sellers"
        :loading="loading"
        :pagination="pagination"
        @delete="handleDelete"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import CrudTable from '@/components/CrudTable.vue';
import toastService from '@/services/toastService';

export default {
  name: 'Sellers',
  components: { CrudTable },
  setup() {
    const sellers = ref([]);
    const loading = ref(false);
    const totalSellers = ref(0);
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    });

    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'store_name', label: 'Store Name' },
      { key: 'store_category', label: 'Category' },
      { key: 'mintiss', label: 'Mintiss' },
      { key: 'actions', label: 'Actions' }
    ];

    const fetchSellers = async () => {
      loading.value = true;
      try {
        const response = await axios.get('/admin/sellers', {
          params: { page: pagination.value.currentPage }
        });
        if (response.data.status) {
          sellers.value = response.data.data;
          totalSellers.value = response.data.total_sellers || response.data.data.length;
          if (response.data.meta) {
            pagination.value = {
              currentPage: response.data.meta.current_page || 1,
              totalPages: response.data.meta.last_page || 1,
              totalItems: response.data.meta.total || response.data.data.length
            };
          } else {
            pagination.value = {
              currentPage: 1,
              totalPages: 1,
              totalItems: response.data.data.length
            };
          }
        } else {
          toastService.error(response.data.message || 'Failed to fetch sellers');
        }
      } catch (error) {
        toastService.error('Failed to fetch sellers');
        console.error('Error fetching sellers:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleDelete = async (seller) => {
      if (!confirm(`Are you sure you want to delete seller ${seller.name}?`)) return;
      try {
        await axios.delete(`/admin/sellers/${seller.id}`);
        toastService.success('Seller deleted successfully');
        fetchSellers();
      } catch (error) {
        toastService.error('Failed to delete seller');
        console.error('Error deleting seller:', error);
      }
    };

    const handlePageChange = (page) => {
      pagination.value.currentPage = page;
      fetchSellers();
    };

    onMounted(fetchSellers);

    return {
      sellers,
      columns,
      loading,
      pagination,
      totalSellers,
      handleDelete,
      handlePageChange
    };
  }
};
</script>

<style scoped>
.sellers-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.header-section {
  margin-bottom: 2rem;
}

.header-section h1 {
  margin-bottom: 1rem;
  color: #333;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-label {
  font-weight: 600;
  color: #6c757d;
}

.stat-value {
  font-weight: 700;
  color: #495057;
  font-size: 1.1rem;
}

.sellers-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-item {
    width: 100%;
    justify-content: space-between;
  }
}
</style>