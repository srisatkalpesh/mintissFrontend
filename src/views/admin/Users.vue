<template>
  <div class="users-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="bi bi-people-fill me-3"></i>
            Users Management
          </h1>
          <p class="page-subtitle">Manage user accounts and mintiss balances</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalUsers }}</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon mintiss">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalMintissBalance }}</div>
              <div class="stat-label">Total Mintiss</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mintiss Management Section -->
    <div class="management-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="bi bi-currency-dollar me-2"></i>
          Mintiss Management
        </h2>
        <p class="section-subtitle">Update user mintiss balances and track changes</p>
      </div>
      
      <!-- Update Form -->
      <div class="form-card">
        <div class="form-header">
          <h3 class="form-title">
            <i class="bi bi-plus-circle me-2"></i>
            Update User Mintiss
          </h3>
        </div>
        <form @submit.prevent="handleMintissUpdate" class="modern-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="userId" class="form-label">
                <i class="bi bi-person me-1"></i>
                Select User
              </label>
              <select id="userId" v-model="mintissForm.user_id" required class="form-select">
                <option value="">Choose a user</option>
                <option v-for="user in allUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }}) - Current: {{ user.mintiss }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="type" class="form-label">
                <i class="bi bi-arrow-up-down me-1"></i>
                Type
              </label>
              <select id="type" v-model="mintissForm.type" required class="form-select">
                <option value="increase">Increase</option>
                <option value="decrease">Decrease</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="points" class="form-label">
                <i class="bi bi-123 me-1"></i>
                Points
              </label>
              <input 
                id="points" 
                type="number" 
                v-model="mintissForm.points" 
                min="0.000000001" 
                step="0.000000001" 
                required
                placeholder="e.g. 1.123456789"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="reason" class="form-label">
                <i class="bi bi-chat-text me-1"></i>
                Reason
              </label>
              <input 
                id="reason" 
                type="text" 
                v-model="mintissForm.reason" 
                required
                placeholder="Enter reason for update"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="updating">
              <i class="bi bi-check-circle me-2"></i>
              {{ updating ? 'Updating...' : 'Update Mintiss' }}
            </button>
          </div>
        </form>
      </div>

      <!-- History Table -->
      <div class="history-card">
        <div class="history-header">
          <h3 class="history-title">
            <i class="bi bi-clock-history me-2"></i>
            Mintiss Update History
          </h3>
        </div>
        <div class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th><i class="bi bi-person me-1"></i>User</th>
                <th><i class="bi bi-arrow-up-down me-1"></i>Type</th>
                <th><i class="bi bi-123 me-1"></i>Points</th>
                <th><i class="bi bi-chat-text me-1"></i>Reason</th>
                <th><i class="bi bi-calendar me-1"></i>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="update in mintissUpdates" :key="update.id">
                <td class="user-cell">
                  <div class="user-info">
                    <div class="user-name">{{ update.user.name }}</div>
                    <div class="user-email">{{ update.user.email }}</div>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', update.type === 'increase' ? 'success' : 'danger']">
                    <i :class="update.type === 'increase' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="me-1"></i>
                    {{ update.type }}
                  </span>
                </td>
                <td class="points-cell">{{ update.points }}</td>
                <td class="reason-cell">{{ update.reason }}</td>
                <td class="date-cell">{{ formatDate(update.created_at) }}</td>
              </tr>
              <tr v-if="mintissUpdates.length === 0">
                <td colspan="5" class="no-data">
                  <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No mintiss updates found</p>
                  </div>
                </td>
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
import loaderService from '@/services/loaderService';

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
      { 
        key: 'referred_by', 
        label: 'Referred By',
        render: (item) => {
          if (item.referred_by) {
            return `
              <div class="referral-info">
                <div class="referral-name">
                  <i class="bi bi-person-check me-1"></i>
                  ${item.referred_by.name}
                </div>
                <div class="referral-email text-muted small">
                  ${item.referred_by.email}
                </div>
              </div>
            `;
          } else {
            return `
              <div class="no-referral">
                <i class="bi bi-person-x me-1 text-muted"></i>
                <span class="text-muted">Not referred</span>
              </div>
            `;
          }
        }
      },
      { key: 'actions', label: 'Actions' }
    ];

    const fetchUsers = async () => {
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/admin/users', {
            params: { page: pagination.value.currentPage }
          }),
          'Loading users...'
        );
        
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
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/admin/users'),
          'Loading user data...'
        );
        if (response.data.status) {
          allUsers.value = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    const fetchMintissUpdates = async () => {
      try {
        const response = await loaderService.withLoader(
          () => axios.get('/admin/mintiss/updates'),
          'Loading mintiss history...'
        );
        if (response.data.updates) {
          mintissUpdates.value = response.data.updates;
        }
      } catch (error) {
        console.error('Error fetching mintiss updates:', error);
      }
    };

    const handleMintissUpdate = async () => {
      try {
        await loaderService.withLoader(
          () => axios.post('/admin/mintiss/update', mintissForm.value),
          'Updating mintiss...'
        );
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
        await loaderService.withLoader(
          () => axios.delete(`/admin/users/${user.id}`),
          'Deleting user...'
        );
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.stat-icon.mintiss {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

/* Management Section */
.management-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.section-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.form-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.modern-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.form-select,
.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* History Card */
.history-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.history-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.history-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
}

.table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modern-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.modern-table tr:hover {
  background: #f8fafc;
}

.user-cell {
  min-width: 200px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
}

.user-email {
  font-size: 0.85rem;
  color: #64748b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.success {
  background: #dcfce7;
  color: #166534;
}

.status-badge.danger {
  background: #fef2f2;
  color: #dc2626;
}

.points-cell {
  font-weight: 600;
  color: #1e293b;
  font-family: 'Courier New', monospace;
}

.reason-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-cell {
  color: #64748b;
  font-size: 0.9rem;
}

.no-data {
  text-align: center;
  padding: 3rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
}

.empty-state i {
  font-size: 3rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
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
  
  .management-section {
    padding: 0 1rem 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modern-form {
    padding: 1.5rem;
  }
  
  .form-header,
  .history-header {
    padding: 1rem 1.5rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.75rem 1rem;
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

/* Referral Information Styles */
.referral-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.referral-name {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.referral-email {
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 1.25rem;
}

.no-referral {
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.referral-name i {
  color: #10b981;
}

.no-referral i {
  color: #9ca3af;
}
</style>