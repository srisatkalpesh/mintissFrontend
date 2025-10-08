<template>
    <div class="modern-seller-profile">
        <!-- Profile Header -->
        <div class="profile-header">
            <div class="container">
                <div class="header-content">
                    <div class="profile-avatar">
                        <div class="avatar-circle">
                            <i class="bi bi-person-fill"></i>
            </div>
        </div>
                    <div class="profile-info">
                        <h1 class="profile-name">{{ profile.name }}</h1>
                        <p class="profile-email">{{ profile.email }}</p>
                        <p class="profile-phone">{{ profile.phone }}</p>
                    </div>
                    <div class="profile-actions">
                        <button class="edit-profile-btn" @click="showEditModal = true">
                            <i class="bi bi-pencil-square"></i>
                            Edit Profile
                        </button>
                    </div>
                    </div>
                </div>
            </div>

        <!-- Profile Content -->
        <div class="profile-content">
            <div class="container">
                <div class="row">
                    <!-- Store Information Card -->
                    <div class="col-lg-8">
                        <div class="store-info-card">
                    <div class="card-header">
                                <div class="header-icon">
                                    <i class="bi bi-shop"></i>
                                </div>
                                <div class="header-text">
                                    <h3 class="card-title">Store Information</h3>
                                    <p class="card-subtitle">Manage your store details</p>
                    </div>
                    </div>
                    <div class="card-body">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <label class="info-label">Store Name</label>
                                        <div class="info-value">{{ profile.storeName || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item">
                                        <label class="info-label">Category</label>
                                        <div class="info-value">{{ profile.storeCategory || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <label class="info-label">Description</label>
                                        <div class="info-value description">{{ profile.storeDescription || 'No description provided' }}</div>
                                    </div>
                                    <div class="info-item full-width">
                                        <label class="info-label">Address</label>
                                        <div class="info-value">{{ profile.address || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item">
                                        <label class="info-label">City</label>
                                        <div class="info-value">{{ profile.city || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item">
                                        <label class="info-label">State</label>
                                        <div class="info-value">{{ profile.state || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item">
                                        <label class="info-label">ZIP Code</label>
                                        <div class="info-value">{{ profile.zipCode || 'Not provided' }}</div>
                                    </div>
                                    <div class="info-item">
                                        <label class="info-label">GST Number</label>
                                        <div class="info-value gst-number">{{ profile.gstNumber || 'Not provided' }}</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>

                    <!-- Quick Stats Card -->
                    <div class="col-lg-4">
                        <div class="stats-card">
                            <div class="card-header">
                                <div class="header-icon">
                                    <i class="bi bi-graph-up"></i>
                                </div>
                                <div class="header-text">
                                    <h3 class="card-title">Quick Stats</h3>
                                    <p class="card-subtitle">Your store overview</p>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="bi bi-box-seam"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">0</div>
                                        <div class="stat-label">Products</div>
                                    </div>
                        </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="bi bi-cart-check"></i>
                            </div>
                                    <div class="stat-content">
                                        <div class="stat-number">0</div>
                                        <div class="stat-label">Orders</div>
                            </div>
                        </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="bi bi-currency-rupee"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">₹0</div>
                                        <div class="stat-label">Revenue</div>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="header-content">
                            <div class="header-icon">
                                <i class="bi bi-pencil-square"></i>
                            </div>
                            <div class="header-text">
                                <h3 class="modal-title">Edit Profile</h3>
                                <p class="modal-subtitle">Update your personal and store information</p>
                            </div>
                        </div>
                        <button type="button" class="close-btn" @click="closeEditModal">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveProfile">
                            <div class="form-section">
                                <h4 class="section-title">Personal Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" v-model="editForm.name" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" v-model="editForm.email" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                <label class="form-label">Phone</label>
                                <input type="tel" v-model="editForm.phone" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4 class="section-title">Store Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Store Name</label>
                                        <input type="text" v-model="editForm.storeName" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Store Category</label>
                                        <input type="text" v-model="editForm.storeCategory" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                <label class="form-label">Store Description</label>
                                    <textarea v-model="editForm.storeDescription" class="form-control" rows="3" placeholder="Describe your store..."></textarea>
                            </div>
                                <div class="form-group">
                                        <label class="form-label">Address</label>
                                    <input type="text" v-model="editForm.address" class="form-control" required placeholder="Enter your store address">
                                    </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">City</label>
                                        <input type="text" v-model="editForm.city" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">State</label>
                                        <input type="text" v-model="editForm.state" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">ZIP Code</label>
                                        <input type="text" v-model="editForm.zipCode" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">GST Number</label>
                                    <input type="text" v-model="editForm.gstNumber" class="form-control" placeholder="GST Number (Optional)">
                                    <small class="form-help">Format: 22ABCDE1234F1Z5</small>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeEditModal" :disabled="isSaving">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="saveProfile" :disabled="isSaving">
                            <i v-if="isSaving" class="bi bi-arrow-clockwise spin me-2"></i>
                            <i v-else class="bi bi-check-lg me-2"></i>
                            {{ isSaving ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'SellerProfile',
    data() {
        return {
            profile: {
                name: '',
                email: '',
                phone: '',
                avatar: '',
                created_at: '',
                storeName: '',
                storeCategory: '',
                storeDescription: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                gstNumber: ''
            },
            showEditModal: false,
            editForm: {
                name: '',
                email: '',
                phone: '',
                storeName: '',
                storeCategory: '',
                storeDescription: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                gstNumber: ''
            },
            isSaving: false
        };
    },
    mounted() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/seller/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Profile response:', response.data); // Debug log
                const { user, store } = response.data;
                
                console.log('Store data:', store); // Debug log
                console.log('GST number from store:', store?.gst_number); // Debug log
                
                this.profile = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar || 'https://via.placeholder.com/150',
                    created_at: user.created_at,
                    storeName: store?.name || '',
                    storeCategory: store?.category || '',
                    storeDescription: store?.description || '',
                    address: store?.address || '',
                    city: store?.city || '',
                    state: store?.state || '',
                    zipCode: store?.zip_code || '',
                    gstNumber: store?.gst_number || ''
                };
                
                console.log('Profile loaded with GST:', this.profile.gstNumber); // Debug log
                this.editForm = { ...this.profile };
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        },
        async saveProfile() {
            if (this.isSaving) return; // Prevent multiple submissions
            
            this.isSaving = true;
            
            try {
                const token = localStorage.getItem('token');
                const payload = {
                    name: this.editForm.name,
                    email: this.editForm.email,
                    phone: this.editForm.phone,
                    store_name: this.editForm.storeName,
                    store_category: this.editForm.storeCategory,
                    store_description: this.editForm.storeDescription,
                    address: this.editForm.address,
                    city: this.editForm.city,
                    state: this.editForm.state,
                    zip_code: this.editForm.zipCode,
                    gst_number: this.editForm.gstNumber
                };

                console.log('Sending payload:', payload); // Debug log

                const response = await axios.put('/seller/edit', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Update response:', response.data); // Debug log

                // Show success message
                this.showSuccessMessage('Profile updated successfully!');

                // Update the profile data directly from response if available
                if (response.data.store) {
                    this.profile.gstNumber = response.data.store.gst_number || '';
                    console.log('GST number updated from response:', this.profile.gstNumber);
                }

                // Reload the profile after successful update
                await this.loadProfile();

                this.closeEditModal();
            } catch (error) {
                console.error('Error saving profile:', error);
                this.showErrorMessage('Failed to update profile. Please try again.');
            } finally {
                this.isSaving = false;
            }
        },
        showSuccessMessage(message) {
            // Create success toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification toast-success';
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="bi bi-check-circle me-2"></i>
                    ${message}
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },
        showErrorMessage(message) {
            // Create error toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification toast-error';
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    ${message}
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editForm = { ...this.profile };
        }
    }
};
</script>

<style scoped>
/* Modern Seller Profile Styles */
.modern-seller-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Profile Header */
.profile-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  padding: 3rem 0;
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-email,
.profile-phone {
  font-size: 1.1rem;
  margin: 0.25rem 0;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-actions {
  flex-shrink: 0;
}

.edit-profile-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Profile Content */
.profile-content {
  padding: 3rem 0;
}

/* Store Info Card */
.store-info-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.store-info-card .card-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.header-text {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.card-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1177bf;
}

.info-value.description {
  line-height: 1.6;
  min-height: 60px;
}

.info-value.gst-number {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #1177bf;
}

/* Stats Card */
.stats-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.stats-card .card-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-card .card-body {
  padding: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(5px);
}

.modal-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header .header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-header .header-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1177bf;
  display: inline-block;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #1177bf;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

.form-help {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0.25rem 0 0 0;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #1177bf 0%, #0d5a9a 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0d5a9a 0%, #1177bf 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(17, 119, 191, 0.3);
}

/* GST Number field styling */
input[placeholder*="GST Number"] {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input[placeholder*="GST Number"]:focus {
  border-color: #1177bf;
  box-shadow: 0 0 0 3px rgba(17, 119, 191, 0.1);
}

/* Loading spinner animation */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Toast Notifications */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  z-index: 9999;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid #1177bf;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-notification.toast-success {
  border-left-color: #28a745;
}

.toast-notification.toast-error {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.25rem;
  padding: 0;
  margin-left: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toast-close:hover {
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-name {
    font-size: 2rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }

  .toast-notification {
    min-width: 280px;
    right: 10px;
    top: 10px;
  }
}
</style>