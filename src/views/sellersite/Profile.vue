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
                        <h5>{{ profile.name }}</h5>
                        <p class="text-muted">{{ profile.email }}</p>
                        <p class="text-muted">{{ profile.phone }}</p>
                        <button class="btn btn-outline-primary btn-sm" @click="showEditModal = true">
                            <i class="bi bi-pencil"></i> Edit Profile
                        </button>
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
                                        <input type="text" v-model="editForm.storeCategory" class="form-control" required>
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
        
        <!-- Modal Backdrops -->
        <div v-if="showEditModal" class="modal-backdrop fade show"></div>
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
                zipCode: ''
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
                zipCode: ''
            }
        }
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
                const { user, store } = response.data;
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
                  zipCode: store?.zip_code || ''
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
                // TODO: Implement save profile API call if needed
                this.profile = { ...this.profile, ...this.editForm };
                this.closeEditModal();
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editForm = { ...this.profile };
        }
    }
}
</script> 