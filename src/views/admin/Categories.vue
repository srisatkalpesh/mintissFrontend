<template>
    <div class="categories-page">
        <CrudTable
            title="Categories"
            :columns="columns"
            :items="categories"
            :loading="loading"
            :pagination="pagination"
            @add="showAddModal"
            @edit="showEditModal"
            @delete="handleDelete"
            @page-change="handlePageChange"
        />

        <!-- Add/Edit Modal -->
        <div class="modal fade" id="categoryModal" tabindex="-1" ref="categoryModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="formData.name"
                                    required
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="formData.description"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary ms-2">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import CrudTable from '@/components/CrudTable.vue'
import toastService from '@/services/toastService'
import { Modal } from 'bootstrap'

export default {
    name: 'Categories',
    components: {
        CrudTable
    },
    setup() {
        const categories = ref([])
        const loading = ref(false)
        const pagination = ref({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        })
        const isEditing = ref(false)
        const formData = ref({
            id: null,
            name: '',
            description: ''
        })
        const categoryModal = ref(null)
        let modal = null

        // Define columns for the table
        const columns = [
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            { key: 'actions', label: 'Actions' }
        ]

        const fetchCategories = async () => {
            loading.value = true
            try {
                const response = await axios.get('/admin/categories', {
                    params: {
                        page: pagination.value.currentPage
                    }
                })
                categories.value = response.data.data
                pagination.value = {
                    currentPage: response.data.current_page,
                    totalPages: response.data.last_page,
                    totalItems: response.data.total
                }
            } catch (error) {
                toastService.error('Failed to fetch categories')
                console.error('Error fetching categories:', error)
            } finally {
                loading.value = false
            }
        }

        const showAddModal = () => {
            isEditing.value = false
            formData.value = {
                id: null,
                name: '',
                description: ''
            }
            modal.show()
        }

        const showEditModal = (category) => {
            isEditing.value = true
            formData.value = {
                id: category.id,
                name: category.name,
                description: category.description
            }
            modal.show()
        }

        const handleSubmit = async () => {
            try {
                if (isEditing.value) {
                    await axios.put(`/admin/categories/${formData.value.id}`, formData.value)
                    toastService.success('Category updated successfully')
                } else {
                    await axios.post('/admin/categories', formData.value)
                    toastService.success('Category added successfully')
                }
                modal.hide()
                fetchCategories()
            } catch (error) {
                toastService.error('Failed to save category')
                console.error('Error saving category:', error)
            }
        }

        const handleDelete = async (category) => {
            try {
                await axios.delete(`/admin/categories/${category.id}`)
                toastService.success('Category deleted successfully')
                fetchCategories()
            } catch (error) {
                toastService.error('Failed to delete category')
                console.error('Error deleting category:', error)
            }
        }

        const handlePageChange = (page) => {
            pagination.value.currentPage = page
            fetchCategories()
        }

        onMounted(() => {
            fetchCategories()
            modal = new Modal(categoryModal.value)
        })

        return {
            categories,
            loading,
            pagination,
            isEditing,
            formData,
            categoryModal,
            columns,
            showAddModal,
            showEditModal,
            handleSubmit,
            handleDelete,
            handlePageChange
        }
    }
}
</script>

<style scoped>
.categories-page {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
}
</style> 