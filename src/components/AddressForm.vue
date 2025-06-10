<template>
    <div class="address-form">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">{{ isEditing ? 'Edit Address' : 'Add New Address' }}</h5>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Address Title</label>
                        <input type="text" 
                               class="form-control" 
                               v-model="formData.title" 
                               placeholder="e.g., Home, Work"
                               required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Address Line</label>
                        <textarea class="form-control" 
                                  v-model="formData.address_line" 
                                  rows="2"
                                  required></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">City</label>
                            <input type="text" 
                                   class="form-control" 
                                   v-model="formData.city"
                                   required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">State</label>
                            <input type="text" 
                                   class="form-control" 
                                   v-model="formData.state"
                                   required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Country</label>
                            <input type="text" 
                                   class="form-control" 
                                   v-model="formData.country"
                                   required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Postal Code</label>
                            <input type="text" 
                                   class="form-control" 
                                   v-model="formData.postal_code"
                                   required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Landmark (Optional)</label>
                        <input type="text" 
                               class="form-control" 
                               v-model="formData.landmark"
                               placeholder="e.g., Near City Mall">
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" 
                                class="btn btn-secondary" 
                                @click="$emit('cancel')">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="btn btn-primary">
                            {{ isEditing ? 'Update Address' : 'Save Address' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddressForm',
    props: {
        address: {
            type: Object,
            default: () => ({})
        },
        isEditing: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                title: '',
                address_line: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
                landmark: ''
            }
        }
    },
    watch: {
        address: {
            immediate: true,
            handler(newVal) {
                if (newVal && Object.keys(newVal).length > 0) {
                    this.formData = { ...newVal };
                }
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$emit('submit', this.formData);
        }
    }
}
</script>

<style scoped>
.address-form {
    max-width: 800px;
    margin: 0 auto;
}
</style> 