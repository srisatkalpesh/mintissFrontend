<template>
  <div class="sellers-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-shop-fill me-3"></i>
            Sellers Management
          </h1>
          <p class="page-subtitle">Manage seller accounts and store information</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-shop"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalSellers }}</div>
              <div class="stat-label">Total Sellers</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
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
import loaderService from '@/services/loaderService';

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
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/admin/sellers', {
            params: { page: pagination.value.currentPage }
          }),
          'Loading sellers...'
        );
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
      }
    };

    const handleDelete = async (seller) => {
      if (!confirm(`Are you sure you want to delete seller ${seller.name}?`)) return;
      try {
        await loaderService.withLoader(
          () => axios.delete(`/admin/sellers/${seller.id}`),
          'Deleting seller...'
        );
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
}
</style>