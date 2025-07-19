<template>
  <div class="users-page">
    <div class="header-section">
      <h1>Users</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Users:</span>
          <span class="stat-value">{{ totalUsers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Mintiss Given:</span>
          <span class="stat-value">{{ totalMintissBalance }}</span>
        </div>
      </div>
    </div>

    <!-- Mintiss Management Section -->
    <div class="mintiss-section">
      <h2>Mintiss Management</h2>
      
      <!-- Update Form -->
      <div class="update-form">
        <h3>Update User Mintiss</h3>
        <form @submit.prevent="handleMintissUpdate" class="form">
          <div class="form-row">
            <div class="form-group">
              <label for="userId">Select User:</label>
              <select id="userId" v-model="mintissForm.user_id" required>
                <option value="">Choose a user</option>
                <option v-for="user in allUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }}) - Current: {{ user.mintiss }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="type">Type:</label>
              <select id="type" v-model="mintissForm.type" required>
                <option value="increase">Increase</option>
                <option value="decrease">Decrease</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="points">Points:</label>
              <input 
                id="points" 
                type="number" 
                v-model="mintissForm.points" 
                min="0.000000001" 
                step="0.000000001" 
                required
                placeholder="e.g. 1.123456789"
              />
            </div>
            
            <div class="form-group">
              <label for="reason">Reason:</label>
              <input 
                id="reason" 
                type="text" 
                v-model="mintissForm.reason" 
                required
                placeholder="Enter reason for update"
              />
            </div>
          </div>
          
          <button type="submit" class="btn-update" :disabled="updating">
            {{ updating ? 'Updating...' : 'Update Mintiss' }}
          </button>
        </form>
      </div>

      <!-- History Table -->
      <div class="history-section">
        <h3>Mintiss Update History</h3>
        <div class="table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Points</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="update in mintissUpdates" :key="update.id">
                <td>{{ update.user.name }}</td>
                <td>
                  <span :class="['badge', update.type === 'increase' ? 'badge-success' : 'badge-danger']">
                    {{ update.type }}
                  </span>
                </td>
                <td>{{ update.points }}</td>
                <td>{{ update.reason }}</td>
                <td>{{ formatDate(update.created_at) }}</td>
              </tr>
              <tr v-if="mintissUpdates.length === 0">
                <td colspan="5" class="no-data">No mintiss updates found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <CrudTable
      title=""
      :columns="columns"
      :items="users"
      :loading="loading"
      :pagination="pagination"
      @delete="handleDelete"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import CrudTable from '@/components/CrudTable.vue';
import toastService from '@/services/toastService';

export default {
  name: 'Users',
  components: { CrudTable },
  setup() {
    const users = ref([]);
    const allUsers = ref([]);
    const mintissUpdates = ref([]);
    const loading = ref(false);
    const updating = ref(false);
    const totalUsers = ref(0);
    const totalMintissBalance = ref(0);
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    });

    const mintissForm = ref({
      user_id: '',
      type: 'increase',
      points: 1,
      reason: ''
    });

    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'Role' },
      { key: 'mintiss', label: 'Mintiss' },
      { key: 'actions', label: 'Actions' }
    ];

    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await axios.get('/admin/users', {
          params: { page: pagination.value.currentPage }
        });
        
        // Handle the new response structure
        if (response.data.status) {
          users.value = response.data.data;
          totalUsers.value = response.data.total_users || 0;
          totalMintissBalance.value = response.data.total_mintiss_balance || 0;
          
          // Update pagination if it exists in the response
          if (response.data.meta) {
            pagination.value = {
              currentPage: response.data.meta.current_page || 1,
              totalPages: response.data.meta.last_page || 1,
              totalItems: response.data.meta.total || response.data.data.length
            };
          } else {
            // If no pagination meta, set to single page
            pagination.value = {
              currentPage: 1,
              totalPages: 1,
              totalItems: response.data.data.length
            };
          }
        } else {
          toastService.error(response.data.message || 'Failed to fetch users');
        }
      } catch (error) {
        toastService.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        if (response.data.status) {
          allUsers.value = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    const fetchMintissUpdates = async () => {
      try {
        const response = await axios.get('/admin/mintiss/updates');
        if (response.data.updates) {
          mintissUpdates.value = response.data.updates;
        }
      } catch (error) {
        console.error('Error fetching mintiss updates:', error);
      }
    };

    const handleMintissUpdate = async () => {
      updating.value = true;
      try {
        await axios.post('/admin/mintiss/update', mintissForm.value);
        toastService.success('Mintiss updated successfully');
        
        // Reset form
        mintissForm.value = {
          user_id: '',
          type: 'increase',
          points: 1,
          reason: ''
        };
        
        // Refresh data
        await Promise.all([fetchUsers(), fetchMintissUpdates()]);
      } catch (error) {
        toastService.error('Failed to update mintiss');
        console.error('Error updating mintiss:', error);
      } finally {
        updating.value = false;
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleDelete = async (user) => {
      if (!confirm(`Are you sure you want to delete user ${user.name}?`)) return;
      try {
        await axios.delete(`/admin/users/${user.id}`);
        toastService.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toastService.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    };

    const handlePageChange = (page) => {
      pagination.value.currentPage = page;
      fetchUsers();
    };

    onMounted(async () => {
      await Promise.all([fetchUsers(), fetchAllUsers(), fetchMintissUpdates()]);
    });

    return {
      users,
      allUsers,
      mintissUpdates,
      columns,
      loading,
      updating,
      pagination,
      totalUsers,
      totalMintissBalance,
      mintissForm,
      handleMintissUpdate,
      handleDelete,
      handlePageChange,
      formatDate
    };
  }
};
</script>

<style scoped>
.users-page {
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

.mintiss-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mintiss-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.update-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.update-form h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 1rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #495057;
}

.form-group select,
.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-update {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
}

.btn-update:hover:not(:disabled) {
  background: #0056b3;
}

.btn-update:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.history-section h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-table th,
.history-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.history-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.history-table tr:hover {
  background: #f8f9fa;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}

.no-data {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 992px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>