<template>
    <div class="container-fluid p-4">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">Profile</h2>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body text-center">
                        <div class="mb-3">
                            <img :src="profile.avatar || 'https://via.placeholder.com/150'" 
                                 alt="Profile" 
                                 class="rounded-circle" 
                                 style="width: 150px; height: 150px; object-fit: cover;">
                        </div>
                        <h5>{{ profile.name }}</h5>
                        <p class="text-muted">{{ profile.email }}</p>
                        <p class="text-muted">{{ profile.phone }}</p>
                        <button class="btn btn-outline-primary btn-sm" @click="showEditModal = true">
                            <i class="bi bi-pencil"></i> Edit Profile
                        </button>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <h6 class="mb-0">Account Statistics</h6>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Member Since</span>
                            <strong>{{ formatDate(profile.created_at) }}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Total Products</span>
                            <strong>{{ profile.totalProducts }}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Total Sales</span>
                            <strong>${{ profile.totalSales }}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Rating</span>
                            <strong>{{ profile.rating }}/5</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Store Information</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Store Name</label>
                                <input type="text" v-model="profile.storeName" class="form-control" readonly>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Store Category</label>
                                <input type="text" v-model="profile.storeCategory" class="form-control" readonly>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Store Description</label>
                            <textarea v-model="profile.storeDescription" class="form-control" rows="3" readonly></textarea>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Address</label>
                                <input type="text" v-model="profile.address" class="form-control" readonly>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">City</label>
                                <input type="text" v-model="profile.city" class="form-control" readonly>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">State</label>
                                <input type="text" v-model="profile.state" class="form-control" readonly>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">ZIP Code</label>
                                <input type="text" v-model="profile.zipCode" class="form-control" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <h6 class="mb-0">Security Settings</h6>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-outline-warning me-2" @click="showPasswordModal = true">
                            <i class="bi bi-key"></i> Change Password
                        </button>
                        <button class="btn btn-outline-info">
                            <i class="bi bi-shield"></i> Two-Factor Authentication
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Edit Profile Modal -->
        <div class="modal fade" :class="{ 'show d-block': showEditModal }" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Profile</h5>
                        <button type="button" class="btn-close" @click="closeEditModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveProfile">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" v-model="editForm.name" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" v-model="editForm.email" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" v-model="editForm.phone" class="form-control" required>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Store Name</label>
                                        <input type="text" v-model="editForm.storeName" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Store Category</label>
                                        <select v-model="editForm.storeCategory" class="form-select" required>
                                            <option value="">Select Category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Home">Home & Garden</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Books">Books</option>
                                            <option value="Beauty">Beauty</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Store Description</label>
                                <textarea v-model="editForm.storeDescription" class="form-control" rows="3"></textarea>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="mb-3">
                                        <label class="form-label">Address</label>
                                        <input type="text" v-model="editForm.address" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">City</label>
                                        <input type="text" v-model="editForm.city" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">State</label>
                                        <input type="text" v-model="editForm.state" class="form-control" required>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">ZIP Code</label>
                                        <input type="text" v-model="editForm.zipCode" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="saveProfile">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Change Password Modal -->
        <div class="modal fade" :class="{ 'show d-block': showPasswordModal }" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Change Password</h5>
                        <button type="button" class="btn-close" @click="closePasswordModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="changePassword">
                            <div class="mb-3">
                                <label class="form-label">Current Password</label>
                                <input type="password" v-model="passwordForm.currentPassword" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">New Password</label>
                                <input type="password" v-model="passwordForm.newPassword" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm New Password</label>
                                <input type="password" v-model="passwordForm.confirmPassword" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closePasswordModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="changePassword">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Backdrops -->
        <div v-if="showEditModal" class="modal-backdrop fade show"></div>
        <div v-if="showPasswordModal" class="modal-backdrop fade show"></div>
    </div>
</template>

<script>
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
                totalProducts: 0,
                totalSales: 0,
                rating: 0,
                storeName: '',
                storeCategory: '',
                storeDescription: '',
                address: '',
                city: '',
                state: '',
                zipCode: ''
            },
            showEditModal: false,
            showPasswordModal: false,
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
                zipCode: ''
            },
            passwordForm: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        }
    },
    mounted() {
        this.loadProfile();
    },
    methods: {
        async loadProfile() {
            try {
                // TODO: Replace with actual API call
                this.profile = {
                    name: 'John Seller',
                    email: 'john.seller@example.com',
                    phone: '+1234567890',
                    avatar: 'https://via.placeholder.com/150',
                    created_at: '2024-01-01T00:00:00Z',
                    totalProducts: 12,
                    totalSales: 1250.50,
                    rating: 4.8,
                    storeName: 'John\'s Electronics Store',
                    storeCategory: 'Electronics',
                    storeDescription: 'Quality electronics and gadgets for all your needs.',
                    address: '123 Main Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001'
                };
                
                this.editForm = { ...this.profile };
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        
        async saveProfile() {
            try {
                // TODO: Replace with actual API call
                this.profile = { ...this.profile, ...this.editForm };
                this.closeEditModal();
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        },
        
        async changePassword() {
            try {
                if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                }
                
                // TODO: Replace with actual API call
                console.log('Password changed successfully');
                this.closePasswordModal();
            } catch (error) {
                console.error('Error changing password:', error);
            }
        },
        
        closeEditModal() {
            this.showEditModal = false;
            this.editForm = { ...this.profile };
        },
        
        closePasswordModal() {
            this.showPasswordModal = false;
            this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        }
    }
}
</script> 