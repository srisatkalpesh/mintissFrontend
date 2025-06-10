<template>
    <div class="address-list">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">Your Addresses</h5>
            <button class="btn btn-primary" @click="showAddForm">
                <i class="bi bi-plus-lg"></i> Add New Address
            </button>
        </div>

        <!-- Address Form -->
        <div v-if="showForm" class="mb-4">
            <AddressForm 
                :address="selectedAddress"
                :is-editing="!!selectedAddress"
                @submit="handleAddressSubmit"
                @cancel="closeForm"
            />
        </div>

        <!-- Address Cards -->
        <div class="row g-4">
            <div v-for="address in addresses" :key="address.id" class="col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">{{ address.title }}</h6>
                            <div class="dropdown">
                                <button class="btn btn-link text-dark p-0" 
                                        data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button class="dropdown-item" 
                                                @click="editAddress(address)">
                                            <i class="bi bi-pencil me-2"></i> Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button class="dropdown-item text-danger" 
                                                @click="deleteAddress(address.id)">
                                            <i class="bi bi-trash me-2"></i> Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p class="card-text mb-1">{{ address.address_line }}</p>
                        <p class="card-text mb-1">
                            {{ address.city }}, {{ address.state }}, {{ address.country }}
                        </p>
                        <p class="card-text mb-1">Postal Code: {{ address.postal_code }}</p>
                        <p v-if="address.landmark" class="card-text mb-0">
                            Landmark: {{ address.landmark }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Addresses Message -->
        <div v-if="!showForm && addresses.length === 0" class="text-center py-5">
            <i class="bi bi-geo-alt text-primary" style="font-size: 3rem;"></i>
            <h5 class="mt-3 text-muted">No addresses found</h5>
            <p class="text-muted">Add your first address to get started</p>
        </div>
    </div>
</template>

<script>
import AddressForm from './AddressForm.vue';
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
    name: 'AddressList',
    components: {
        AddressForm
    },
    data() {
        return {
            addresses: [],
            showForm: false,
            selectedAddress: null
        }
    },
    methods: {
        async fetchAddresses() {
            try {
                const response = await axios.get('/addresses');
                this.addresses = response.data.data;
            } catch (error) {
                toastService.error('Failed to fetch addresses');
                console.error('Error fetching addresses:', error);
            }
        },
        showAddForm() {
            this.selectedAddress = null;
            this.showForm = true;
        },
        editAddress(address) {
            this.selectedAddress = { ...address };
            this.showForm = true;
        },
        closeForm() {
            this.showForm = false;
            this.selectedAddress = null;
        },
        async handleAddressSubmit(formData) {
            try {
                if (this.selectedAddress) {
                    // Update existing address
                    await axios.put(`/addresses/${this.selectedAddress.id}`, formData);
                    toastService.success('Address updated successfully');
                } else {
                    // Add new address
                    await axios.post('/addresses', formData);
                    toastService.success('Address added successfully');
                }
                this.closeForm();
                this.fetchAddresses();
            } catch (error) {
                toastService.error('Failed to save address');
                console.error('Error saving address:', error);
            }
        },
        async deleteAddress(id) {
            if (!confirm('Are you sure you want to delete this address?')) return;
            
            try {
                await axios.delete(`/addresses/${id}`);
                toastService.success('Address deleted successfully');
                this.fetchAddresses();
            } catch (error) {
                toastService.error('Failed to delete address');
                console.error('Error deleting address:', error);
            }
        }
    },
    mounted() {
        this.fetchAddresses();
    }
}
</script>

<style scoped>
.address-list {
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
}

.dropdown-item {
    cursor: pointer;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}
</style> 